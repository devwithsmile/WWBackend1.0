import mongoose from "mongoose"; 

const gymSchema = mongoose.Schema({ 
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails', required: true }, 
    gym_name: { type: String, required: true }, 
    map_detail: { type: Object }, // Geospatial map details
    address: { type: Object }, // Full address details
    description: { type: String }, 
    images: { type: [String] }, // Array of image URLs
    facilities: { type: [String] }, // List of gym facilities
    equipments: { type: [String] }, // List of gym equipments
    gst_number: { type: String }, 
    price: { type: mongoose.Decimal128, required: true }, 
    schedule: { type: Object }, // Embedded schedule details
    average_rating: { type: mongoose.Decimal128, default: 0.00 }, 
    total_ratings: { type: Number, default: 0 }, 
    total_occupancy: { type: Number, default: 0 }, 
    trainer: { type: Boolean, default: false }, 
    booking_id: { type: [Object] }, // Array of references to booking details
    blocked_date: { type: [Date] }, // Array of dates when the gym is unavailable
    status: { type: String, enum: ['active', 'inactive', 'rejected'], required: true }, 
    tags: { type: [String] }, // List of tags
}, { timestamps: true }); 

const Gyms = mongoose.model('GymsDetails', gymSchema); 
export default Gyms;