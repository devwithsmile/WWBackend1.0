import mongoose from "mongoose";
const customerSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails', required: true },
    preferred_time: { type: String, enum: ['morning', 'afternoon', 'evening', 'night'] },
    persona: { type: [Object] }, age: { type: Number },
    height: { type: mongoose.Decimal128 },
    weight: { type: mongoose.Decimal128 },
    stickers: { type: [Object] }, ww_coins: { type: mongoose.Decimal128, default: 0.00 },
    bio: { type: String },
    contacts: { type: Object },
    last_login: { type: Date }
},
    { timestamps: true }
);
const Customer = mongoose.model('customerDetails', customerSchema);
export default Customer;