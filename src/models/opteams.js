import mongoose from "mongoose"; 

const opTeamSchema = mongoose.Schema({ 
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails', required: true }, 
    team_level: { type: Number, required: true }, 
    role_name: { type: String, required: true }, 
}, { timestamps: true }); 

const OpTeam = mongoose.model('OpTeamDetails', opTeamSchema); 
export default OpTeam;