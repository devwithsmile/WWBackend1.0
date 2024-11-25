import mongoose from "mongoose"; 

const bookingSchema = mongoose.Schema({ 
    gym_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Gym', required: true }, 
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails', required: true }, 
    transaction_id: { type: Number, required: true }, 
    date: { type: Date, required: true }, 
    from: { type: String, required: true }, // Start time of the booking
    to: { type: String, required: true }, // End time of the booking
    status: { type: String, enum: ['scheduled', 'completed', 'cancelled', 'pending'], required: true }, 
    cancellation_reason: { type: String }, // Reason for cancellation if applicable
    rating: { type: Object }, // Embedded rating with score and comments fields
    check_in_time: { type: String }, // Check-in time of the user
    check_out_time: { type: String }, // Check-out time of the user
    user_feedback: { type: String }, // User feedback for the session
    booking_source: { type: String }, // Platform through which the booking was made
    extensionId: { type: Number }, // Reference to extension request if applicable
}, { timestamps: true }); 

const Booking = mongoose.model('BookingDetails', bookingSchema); 
export default Booking;