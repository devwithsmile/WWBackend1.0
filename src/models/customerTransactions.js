import mongoose from "mongoose"; 

const customerTransactionSchema = mongoose.Schema({ 
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'UserDetails', required: true }, 
    amount_in_inr: { type: mongoose.Decimal128, required: true }, // Amount in INR
    amount_in_ww_coins: { type: mongoose.Decimal128, required: true }, // Converted to WWCoins
    coupon_code: { type: String }, // Applied coupon code if any
    type: { type: String, enum: ['credit', 'debit'], required: true }, // Type of transaction
    transaction_source: { type: String }, // Source of the transaction (e.g., booking, refund)
    payment_status: { type: String, enum: ['completed', 'pending', 'failed'], required: true }, // Status of payment
    payment_method: { type: String }, // Method used for payment (UPI, card, etc.)
    totalPrice: { type: mongoose.Decimal128, required: true }, // Total price for the booking
}, { timestamps: true }); 

const CustomerTransaction = mongoose.model('CustomerTransaction', customerTransactionSchema); 
export default CustomerTransaction;