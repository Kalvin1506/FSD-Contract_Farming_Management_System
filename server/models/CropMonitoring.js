import mongoose from 'mongoose';
export default mongoose.model('CropMonitoring', new mongoose.Schema({
  contract: { type: mongoose.Schema.Types.ObjectId, ref: 'Contract', required: true }, farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, farm: { type: mongoose.Schema.Types.ObjectId, ref: 'Farm', required: true }, officer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  visitDate: { type: Date, default: Date.now }, cropStage: { type: String, enum: ['LAND_PREPARATION','SOWING','GERMINATION','VEGETATIVE','FLOWERING','FRUITING','MATURATION','HARVEST_READY'] }, plantHealth: String, irrigationStatus: String, fertilizerStatus: String, pestDetected: Boolean, diseaseDetected: Boolean, expectedYield: Number, image: String, remarks: String
}, { timestamps: true }));
