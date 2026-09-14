import mongoose from 'mongoose';
export default mongoose.model('Application', new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true }, farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true },
  appliedQuantity: { type: Number, required: true }, status: { type: String, enum: ['PENDING','ACCEPTED','REJECTED'], default: 'PENDING' }, companyRemarks: String
}, { timestamps: true }).index({ farmer: 1, contract: 1 }, { unique: true }));
