import mongoose from "mongoose"; 

const leaderboardSchema = mongoose.Schema({ 
    type: { type: String, enum: ['Circle', 'Global'], required: true }, // Type of leaderboard
    user_count: { type: Number, required: true }, // Total number of users in this leaderboard
}, { timestamps: true }); 

const Leaderboard = mongoose.model('LeaderboardDetails', leaderboardSchema); 
export default Leaderboard;