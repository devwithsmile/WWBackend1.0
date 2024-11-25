import mongoose from "mongoose"; 

const clientTransactionSchema = mongoose.Schema({ 
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }, 
    amount_in_inr: { type: mongoose.Decimal128, required: true }, // Amount transferred to the client
    amount_in_ww_coins: { type: mongoose.Decimal128, required: true }, // Converted to WWCoins
    total: { type: Number, required: true }, // Total amount
    transaction_type: { type: String, required: true }, // Type of transaction (payment, refund, etc.)
    description: { type: String }, // Details about the transaction
}, { timestamps: true }); 

const ClientTransaction = mongoose.model('ClientTransaction', clientTransactionSchema); 
export default ClientTransaction;