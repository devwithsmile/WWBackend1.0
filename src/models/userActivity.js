import mongoose from "mongoose"; 

const userActivitySchema = mongoose.Schema({ 
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails', required: true }, 
    activity_type: { type: [String], required: true }, 
    activity_timestamp: { type: [Date], required: true }, 
    latitude: { type: [mongoose.Decimal128] }, 
    longitude: { type: [mongoose.Decimal128] }, 
    page_url: { type: [String] }, 
}, { timestamps: true }); 

const UserActivity = mongoose.model('UserActivityDetails', userActivitySchema); 
export default UserActivity;