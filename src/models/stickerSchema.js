import mongoose from "mongoose"; 

const stickerSchema = mongoose.Schema({ 
    name: { type: String, required: true }, 
    level: { type: Number, required: true }, 
    type: { type: String, required: true }, 
    description: { type: String }, 
    criteria: { type: String }, 
    image_url: { type: String }, 
    tags: { type: [String] }, // Assuming tags are stored as an array of strings
}, { timestamps: true }); 

const Sticker = mongoose.model('StickerDetails', stickerSchema); 
export default Sticker;