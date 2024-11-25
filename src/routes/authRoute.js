import express from 'express';
import {
    registerController,
    loginController,
    reqForgetPwdController,
    resetPwdController,
} from '../controllers/authController.js';

const authRouter = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: strongpassword
 *               role:
 *                 type: string
 *                 example: customer
 *     responses:
 *       201:
 *         description: Registration successful
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
authRouter.post('/register', registerController);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user.
 *     description: Allows users to log in using email and password or Google OAuth token. Returns a JWT token on successful login.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address.
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password. Required unless using Google OAuth.
 *                 example: password123
 *               googleAccessToken:
 *                 type: string
 *                 description: Google OAuth access token. Required for Google login.
 *                 example: ya29.a0AfH6SMAy12345exampleToken
 *               role:
 *                 type: string
 *                 description: Role of the user (e.g., customer, client).
 *                 example: customer
 *     responses:
 *       200:
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for the user.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 message:
 *                   type: string
 *                   description: Success message.
 *                   example: Login successful.
 *                 status:
 *                   type: string
 *                   description: Status of the gym registration (only for clients).
 *                   example: active
 *                 reason:
 *                   type: string
 *                   description: Reason for the status if applicable.
 *                   example: Your gym registration is still under review.
 *       400:
 *         description: Invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 global:
 *                   type: string
 *                   description: Error message.
 *                   example: Invalid email or password.
 *       401:
 *         description: Unauthorized - Invalid Google access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 global:
 *                   type: string
 *                   description: Error message.
 *                   example: Invalid Google access token.
 *       403:
 *         description: Access denied - Role mismatch.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 global:
 *                   type: string
 *                   description: Error message.
 *                   example: Access denied. User is not a client.
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 global:
 *                   type: string
 *                   description: Error message.
 *                   example: Internal server error, please try again later.
 */
authRouter.post('/login', loginController);

authRouter.post('/forgetPassword', reqForgetPwdController);

authRouter.post('/resetpassword/:token', resetPwdController);

export default authRouter;