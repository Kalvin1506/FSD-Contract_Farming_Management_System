import mongoose from 'mongoose';
export default mongoose.model('Harvest', new mongoose.Schema({
  contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true }, farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, harvestDate: Date, quantity: Number, unit: String, cropCondition: String, images: [String], notes: String, rejectionReason: String,
  status: { type: String, enum: ['SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED'], default: 'SUBMITTED' }
}, { timestamps: true }));
