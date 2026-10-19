import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Authentication required');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user || req.user.status === 'SUSPENDED') throw new Error('Account is unavailable');
    next();
  } catch (error) { res.status(401); next(error); }
};
export const allow = (...roles) => (req, res, next) => { if (roles.includes(req.user.role)) return next(); res.status(403); next(new Error('You are not authorized for this action')); };
