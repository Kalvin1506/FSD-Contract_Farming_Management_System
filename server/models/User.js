import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true }, email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6, select: false }, phone: String,
  role: { type: String, enum: ['FARMER','COMPANY','OFFICER','ADMIN'], default: 'FARMER' },
  status: { type: String, enum: ['ACTIVE','SUSPENDED'], default: 'ACTIVE' }, verified: { type: Boolean, default: false },
  companyName: String, address: String, avatar: String
}, { timestamps: true });
userSchema.pre('save', async function(next) { if (!this.isModified('password')) return next(); this.password = await bcrypt.hash(this.password, 12); next(); });
userSchema.methods.matchPassword = function(value) { return bcrypt.compare(value, this.password); };
export default mongoose.model('User', userSchema);
