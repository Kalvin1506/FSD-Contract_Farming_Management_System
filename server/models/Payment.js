import mongoose from 'mongoose';
export default mongoose.model('Payment', new mongoose.Schema({
  contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true }, farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, type: { type: String, enum: ['ADVANCE','HARVEST','FINAL'] }, amount: Number, dueDate: Date, paidDate: Date, reference: String,
  status: { type: String, enum: ['PENDING','PROCESSING','PAID','FAILED'], default: 'PENDING' }
}, { timestamps: true }));
