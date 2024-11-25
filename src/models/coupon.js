import mongoose from "mongoose"; 

const couponSchema = mongoose.Schema({ 
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }, 
    code: { type: String, required: true }, 
    discount_amount: { type: mongoose.Decimal128, required: true }, // Discount amount
    discount_percentage: { type: Number }, 
    criteria: { type: Object }, 
    valid_from: { type: Date, required: true }, // Start time of validity
    valid_until: { type: Date, required: true }, // End time of validity
    sticker_id: { type: Number }, // ID of the associated sticker
    is_redeemable: { type: Boolean, default: true } // Whether the coupon is redeemable
}, 
{
    timestamps: true,
    validate: {
        validator: function() {
            return !(this.discount_amount && this.discount_percentage);
        },
        message: 'Either discount_amount or discount_percentage must be set, not both.'
    }
}); 

const Coupon = mongoose.model('CouponDetails', couponSchema); 
export default Coupon;