import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const tokenFor = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
const response = (res, user) => res.status(200).json({ token: tokenFor(user._id), user: { id: user._id, name: user.name, email: user.email, role: user.role, companyName: user.companyName } });
export async function register(req, res, next) { try { const exists = await User.findOne({ email: req.body.email }); if (exists) return res.status(409).json({ message: 'Email is already registered' }); const role = ['FARMER','COMPANY'].includes(req.body.role) ? req.body.role : 'FARMER'; const user = await User.create({ name: req.body.name, email: req.body.email, password: req.body.password, phone: req.body.phone, companyName: req.body.companyName, address: req.body.address, role }); response(res, user); } catch (e) { next(e); } }
export async function login(req, res, next) { try { const user = await User.findOne({ email: req.body.email?.toLowerCase() }).select('+password'); if (!user || !(await user.matchPassword(req.body.password))) return res.status(401).json({ message: 'Invalid email or password' }); if (user.status === 'SUSPENDED') return res.status(403).json({ message: 'Your account has been suspended' }); response(res, user); } catch (e) { next(e); } }
export const me = async (req, res) => res.json({ user: req.user });
