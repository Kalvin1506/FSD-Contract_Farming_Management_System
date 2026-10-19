import { Router } from 'express';
import { protect, allow } from '../middleware/auth.js';
import { list, getOne, create, update, remove, apply, decideApplication, createContract } from '../controllers/resourceController.js';
import Farm from '../models/Farm.js';
import Contract from '../models/Contract.js';
import Application from '../models/Application.js';
import CropMonitoring from '../models/CropMonitoring.js';
import Harvest from '../models/Harvest.js';
import QualityInspection from '../models/QualityInspection.js';
import Payment from '../models/Payment.js';
import Notification from '../models/Notification.js';
import Complaint from '../models/Complaint.js';
import User from '../models/User.js';

const resource = (Model, { createRoles = [], updateRoles = createRoles, deleteRoles = createRoles, decorate, populate = 'farmer contract farm company officer harvest' } = {}) => {
  const router = Router();
  router.use(protect);
  router.route('/').get(list(Model, populate)).post(allow(...createRoles), create(Model, decorate));
  router.route('/:id').get(getOne(Model, populate)).patch(allow(...updateRoles), update(Model)).delete(allow(...deleteRoles), remove(Model));
  return router;
};

export const farms = resource(Farm, { createRoles: ['FARMER'], updateRoles: ['FARMER'], deleteRoles: ['FARMER'], decorate: (body, req) => ({ ...body, farmer: req.user._id }), populate: 'farmer' });

export const contracts = Router();
contracts.use(protect);
contracts.route('/').get(list(Contract, 'company assignedOfficer')).post(allow('COMPANY'), createContract);
contracts.route('/:id').get(getOne(Contract, 'company assignedOfficer')).patch(allow('COMPANY', 'ADMIN'), update(Contract)).delete(allow('COMPANY', 'ADMIN'), remove(Contract));

export const applications = Router();
applications.use(protect);
applications.get('/', list(Application, 'farmer contract farm'));
applications.post('/', allow('FARMER'), apply);
applications.patch('/:id/decision', allow('COMPANY', 'ADMIN'), decideApplication);

export const monitoring = resource(CropMonitoring, { createRoles: ['OFFICER'], updateRoles: ['OFFICER'], deleteRoles: ['OFFICER'], decorate: (body, req) => ({ ...body, officer: req.user._id }), populate: 'farmer contract farm officer' });
export const harvests = resource(Harvest, { createRoles: ['FARMER'], updateRoles: ['FARMER', 'COMPANY', 'ADMIN'], deleteRoles: ['FARMER'], decorate: (body, req) => ({ ...body, farmer: req.user._id }), populate: 'farmer contract' });
export const quality = resource(QualityInspection, { createRoles: ['COMPANY', 'ADMIN'], updateRoles: ['COMPANY', 'ADMIN'], deleteRoles: ['COMPANY', 'ADMIN'], decorate: (body, req) => ({ ...body, inspector: req.user._id }), populate: 'harvest inspector' });
export const payments = resource(Payment, { createRoles: ['COMPANY', 'ADMIN'], updateRoles: ['COMPANY', 'ADMIN'], deleteRoles: ['ADMIN'], populate: 'farmer contract' });
export const notifications = resource(Notification, { createRoles: ['ADMIN'], updateRoles: ['FARMER', 'COMPANY', 'OFFICER', 'ADMIN'], deleteRoles: ['FARMER', 'COMPANY', 'OFFICER', 'ADMIN'], decorate: (body, req) => ({ ...body, user: body.user || req.user._id }), populate: '' });
export const complaints = resource(Complaint, { createRoles: ['FARMER'], updateRoles: ['FARMER', 'ADMIN'], deleteRoles: ['FARMER', 'ADMIN'], decorate: (body, req) => ({ ...body, farmer: req.user._id }), populate: 'farmer contract' });
export const users = resource(User, { createRoles: ['ADMIN'], updateRoles: ['ADMIN'], deleteRoles: ['ADMIN'], populate: '' });
