import bcrypt from 'bcrypt';
import axios from 'axios';
import validator from 'validator';
import User from '../models/Users.js';
import Customer from '../models/Customers.js';
import Gyms from '../models/Gyms.js'
import Client from '../models/Clients.js';
import OpTeam from '../models/opteams.js';
import { sendTemplatedEmail } from '../utils/emailUtils.js';
import { generateToken } from '../utils/tokenUtils.js';
import config from '../config/config.js';

const VALID_ROLES = ['customer', 'client'];

export const registerController = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        let googleData = null;

        // Google OAuth handling
        if (req.body.googleAccessToken) {
            const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    Authorization: `Bearer ${req.body.googleAccessToken}`,
                },
            });
            googleData = response.data;
        }

        // Validate and sanitize inputs
        const sanitizedEmail = validator.normalizeEmail(email || googleData?.email);
        if (!sanitizedEmail || (!googleData && !password)) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Validate role
        if (!VALID_ROLES.includes(role) && !/^op-team-\d+$/.test(role)) {
            return res.status(400).json({ error: 'Invalid role.' });
        }

        const existingUser = await User.findOne({ email: sanitizedEmail });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered.' });
        }

        const hashedPassword = password ? await bcrypt.hash(password, 12) : null;

        const newUser = new User({
            email: sanitizedEmail,
            password: hashedPassword,
            role,
            full_name: googleData?.name || '',
        });

        await newUser.save();

        // Save to the corresponding model based on the role
        if (role === 'customer') {
            const newCustomer = new Customer({
                user_id: newUser._id,
                // Add any other customer-specific fields here if needed
            });
            await newCustomer.save();
        } else if (role === 'client') {
            const newClient = new Client({
                user_id: newUser._id, // Reference to the user
                // Add any other client-specific fields here if needed
            });
            await newClient.save();
        } else if (/^op-team-\d+$/.test(role)) {
            // For op-team roles, save using the OpTeam model

            const team_level = role.split('-').pop();
            console.log(team_level);

            const newOpTeamMember = new OpTeam({
                user_id: newUser._id, // Reference to the user
                team_level: team_level, // Set this dynamically based on your logic or input
                role_name: role,
                // Add any other op-team specific fields here if needed
            });
            await newOpTeamMember.save();
        }

        // Send welcome email
        await sendTemplatedEmail(sanitizedEmail, 'welcome', {
            userName: sanitizedEmail.split('@')[0],
        });

        res.status(201).json({ message: 'Registration successful.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error.' });
    }
};


export const loginController = async (req, res) => {
    try {
        let { email, password, googleAccessToken, role } = req.body;


        // Handle Google OAuth login
        if (googleAccessToken) {
            try {
                const response = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${googleAccessToken}` },
                });
                email = response.data.email;
                password = null; // No password required for OAuth
            } catch (oauthError) {
                console.error('Google OAuth Error:', oauthError);
                return res.status(401).json({ global: 'Invalid Google access token.' });
            }
        }

        // Sanitize email
        email = validator.normalizeEmail(email);

        // Validate email
        if (!validator.isEmail(email)) {
            return res.status(400).json({ global: 'Invalid email.' });
        }

        // Validate password for non-OAuth login
        if (!googleAccessToken && (!password || password.trim() === '')) {
            return res.status(400).json({ global: 'Password is required.' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ global: 'Invalid credentials.' });
        }

        // Verify password for non-OAuth login
        if (!googleAccessToken) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ global: 'Invalid credentials.' });
            }
        }

        // Role-based access validation
        if (user.role !== role) {
            return res
                .status(403)
                .json({ global: `Access denied. User is not a ${role}.` });
        }

        // Generate JWT
        const token = generateToken(
            {
                _id: user._id,
                role: user.role,
                profile_image: user?.profile_image || false,
            },
            { expiresIn: config.AUTH_CONFIG.TOKEN_EXPIRY || '1h' } // Default expiry to 1 hour
        );

        // Owner-specific redirection logic
        if (user.role === 'client') {
            const gym = await Gyms.findOne({ owner_id: user._id });
            const response = { token, status: 'unknown' }; // Default response

            if (gym) {
                switch (gym.status) {
                    case 'active':
                        response.status = 'active';
                        break;
                    case 'inactive':
                        response.status = 'inactive';
                        response.reason = 'Your gym registration is still under review.';
                        break;
                    case 'rejected':
                        response.status = 'rejected';
                        response.reason = 'Your gym registration has been denied.';
                        break;
                }
            } else {
                // Gym not registered
                response.status = 'new';
                response.reason = 'You have not submitted your gym registration form yet.';
            }
            return res.status(200).json(response);
        }

        // Standard login response
        res.status(200).json({ token, message: 'Login successful.' });
    } catch (error) {
        console.error('Internal Server Error:', error.message);
        res.status(500).json({
            global: 'Internal server error, please try again later.',
        });
    }
};


export const reqForgetPwdController = async (req, res) => {
    const { email } = req.body;

    try {
        // Sanitize and validate email
        const sanitizedEmail = validator.normalizeEmail(email || '');
        if (!sanitizedEmail) {
            return res.status(400).json({
                errors: {
                    global: 'Email is required.',
                },
            });
        }

        if (!validator.isEmail(sanitizedEmail)) {
            return res.status(400).json({
                errors: {
                    global: 'Invalid email address.',
                },
            });
        }

        // Check if the user exists
        const user = await User.findOne({ email: sanitizedEmail });
        if (!user) {
            // Security improvement: Do not disclose that the email doesn't exist
            return res.status(200).json({
                message: 'If the email exists, a password reset link has been sent.',
            });
        }

        // Generate JWT token for password reset
        const resetToken = generateToken(
            { _id: user._id },
            { expiresIn: config.AUTH_CONFIG.RESET_PASSWORD_EXPIRATION || '1h' } // Default expiration 1 hour
        );

        // Construct the reset link
        const resetLink = `${config.GENERAL_CONFIG.REDIRECT_URL}/resetpassword?token=${resetToken}`;

        // Send the password reset email
        await sendTemplatedEmail(sanitizedEmail, 'passwordReset', {
            userName: user?.full_name || sanitizedEmail.split('@')[0],
            resetLink,
        });

        // Always respond with a success message for security
        return res.status(200).json({ message: 'If the email exists, a password reset link has been sent.' });
    } catch (error) {
        console.error('Error in requesting password reset:', error);

        if (!res.headersSent) {
            return res.status(500).json({
                errors: {
                    global: 'Internal server error. Please try again later.',
                },
            });
        }
    }
};


export const resetPwdController = async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;

    try {
        // Validate input fields
        if (validator.isEmpty(password)) {
            return res.status(400).json({
                errors: {
                    global: 'New password is required.',
                },
            });
        }

        // Validate token
        if (validator.isEmpty(token)) {
            return res.status(400).json({
                errors: {
                    global: 'Reset token is required.',
                },
            });
        }

        // Verify the JWT token
        const decodedToken = verifyToken(token);

        // If the token is invalid or expired, return an error
        if (!decodedToken) {
            return res.status(401).json({
                errors: {
                    global: 'Invalid token',
                },
            });
        }

        if (decodedToken === 'expired') {
            return res.status(401).json({
                errors: {
                    global: 'Token expired',
                },
            });
        }

        // Find the user by ID
        const user = await User.findOne({ _id: decodedToken.payload._id }).select(
            '_id'
        );

        if (!user) {
            return res.status(404).json({
                errors: {
                    global: 'User not found.',
                },
            });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        res
            .status(200)
            .json({ message: 'Password has been updated successfully.' });
    } catch (error) {
        // Check if response already sent before sending an error response
        if (!res.headersSent) {
            console.error('Unhandled error in Error resetting password:', error);
            res.status(500).json({
                errors: {
                    global: 'Internal Server Error.',
                },
            });
        }
    }
};