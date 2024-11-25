import mongoose from 'mongoose';

const extensionSchema = new mongoose.Schema(
    {
        booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
        duration: { type: Number, required: true }, // Duration in minutes or hours
        extension_duration: { type: Number, required: true }, // Duration of the requested extension
        extension_cost: { type: mongoose.Decimal128, required: true }, // Cost of the extension
        status: { type: String, enum: ['approved', 'pending', 'cancelled'], required: true },
        owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails', required: true }, // Gym owner approving/rejecting
    },
    {
        timestamps: true,
    }
);

const Extension = mongoose.model('ExtensionDetails', extensionSchema);

export default Extension;