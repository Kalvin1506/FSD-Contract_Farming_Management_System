import mongoose from 'mongoose';
export default mongoose.model('Farm', new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true }, name: { type: String, required: true },
  location: { latitude: Number, longitude: Number, address: String, district: String }, landArea: { type: Number, required: true }, landUnit: { type: String, default: 'Acres' },
  soilType: String, irrigationType: String, ownershipType: String, image: String, crops: [String]
}, { timestamps: true }));
