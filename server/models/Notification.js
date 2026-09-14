import mongoose from 'mongoose';
export default mongoose.model('Notification', new mongoose.Schema({ user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, message: String, type: { type: String, default: 'INFO' }, entityType: String, entityId: mongoose.Schema.Types.ObjectId, read: { type: Boolean, default: false } }, { timestamps: true }));
