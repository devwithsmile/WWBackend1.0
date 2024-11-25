import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: { type: String },
        full_name: { type: String, trim: true },
        profile_pic: { type: String },
        email: { type: String, required: true, unique: true, trim: true, lowercase: true },
        phone_number: { type: Number, min: [1000000000, 'Phone number is too short'], max: [9999999999, 'Phone number is too long'] },
        email_verified: { type: Boolean },
        phone_verified: { type: Boolean },
        address: { type: String },
        password: { type: String },
        city: { type: String },
        role: {
            type: String,
            validate: {
                validator: function (value) {
                    return (
                        value === 'customer' ||
                        value === 'client' ||
                        /^op-team-\d+$/.test(value) // Matches 'op-team-' followed by one or more digits
                    );
                },
                message: props => `${props.value} is not a valid role!`
            }
        },
        status: { type: String },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.model('UserDetails', userSchema);

export default User;