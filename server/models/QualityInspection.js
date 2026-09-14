import mongoose from 'mongoose';
export default mongoose.model('QualityInspection', new mongoose.Schema({
  harvest: { type: mongoose.Schema.Types.ObjectId, ref: 'Harvest', required: true }, inspector: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, inspectionDate: { type: Date, default: Date.now }, quantityInspected: Number,
  grade: { type: String, enum: ['A+','A','B','C','REJECTED'] }, moisturePercentage: Number, damagedPercentage: Number, defectPercentage: Number, notes: String, images: [String], approved: Boolean
}, { timestamps: true }));
