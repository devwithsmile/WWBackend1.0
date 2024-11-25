import { json } from "express";
import mongoose from "mongoose";

const clientSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails', required: true },
    gym_ids: { type: [Number] },
    gst_number: { type: String },

    bank_details: {
        bank_account_number: { type: Number },
        ifsc_number: { type: String },
        upi_id: { type: String }
    },

    total_gyms: { type: Number },
    earnings: { type: mongoose.Decimal128, default: 0.00 },
}, { timestamps: true });

const Clients = mongoose.model('ClientDetails', clientSchema);
export default Clients;