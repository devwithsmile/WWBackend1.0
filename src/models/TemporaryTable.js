import mongoose from "mongoose"; 

const temporarySchema = mongoose.Schema({ 
    id: { type: Number, required: true }, 
    values1: { type: Number, required: true }, 
    value2: { type: String, required: true } 
}, { timestamps: true }); 

const Temporary = mongoose.model('TemporaryDetails', temporarySchema); 
export default Temporary;