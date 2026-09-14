import mongoose from 'mongoose';
export const contractStatuses = ['DRAFT','OPEN','APPLICATIONS_CLOSED','ACTIVE','HARVEST_PENDING','QUALITY_CHECK','DELIVERY','COMPLETED','CANCELLED'];
export default mongoose.model('Contract', new mongoose.Schema({
  contractId: { type: String, unique: true }, company: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, crop: { type: String, required: true }, variety: String,
  requiredQuantity: { type: Number, required: true }, unit: { type: String, default: 'Quintal' }, pricePerUnit: { type: Number, required: true }, totalEstimatedValue: Number,
  startDate: Date, endDate: Date, cultivationDeadline: Date, harvestDeadline: Date, minimumLand: Number, qualityRequirements: String, deliveryLocation: String,
  paymentTerms: String, advancePaymentPercentage: { type: Number, default: 0 }, description: String, terms: String, maxFarmers: { type: Number, default: 1 }, selectedFarmers: { type: Number, default: 0 },
  status: { type: String, enum: contractStatuses, default: 'DRAFT' }, assignedOfficer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true }));
