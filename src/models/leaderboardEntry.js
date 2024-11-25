import mongoose from "mongoose"; 

const leaderboardEntrySchema = mongoose.Schema({ 
    leaderboard_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Leaderboard', required: true }, 
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails', required: true }, 
    score: { type: Number, required: true }, // User’s score for the leaderboard ranking
    rank: { type: Number, required: true }, // Computed rank of the user
}, { timestamps: true }); 

const LeaderboardEntry = mongoose.model('LeaderboardEntry', leaderboardEntrySchema); 
export default LeaderboardEntry;