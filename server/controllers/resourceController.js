import Contract from '../models/Contract.js';
import Application from '../models/Application.js';
import Notification from '../models/Notification.js';
import Harvest from '../models/Harvest.js';

const populateQuery = (query, populate = '') => populate ? query.populate(populate) : query;
const companyContractIds = (userId) => Contract.find({ company: userId }).distinct('_id');

async function scopedFilter(Model, req) {
  const { role, _id } = req.user;
  if (role === 'ADMIN') return {};
  if (Model.modelName === 'Notification') return { user: _id };
  if (role === 'FARMER') {
    if (['Farm', 'Application', 'Harvest', 'Payment', 'Complaint', 'CropMonitoring'].includes(Model.modelName)) return { farmer: _id };
    if (Model.modelName === 'User') return { _id };
    if (Model.modelName === 'QualityInspection') return { harvest: { $in: await Harvest.find({ farmer: _id }).distinct('_id') } };
    return {};
  }
  if (role === 'COMPANY') {
    const contractIds = await companyContractIds(_id);
    if (Model.modelName === 'Contract') return { company: _id };
    if (['Application', 'Harvest', 'Payment', 'CropMonitoring'].includes(Model.modelName)) return { contract: { $in: contractIds } };
    if (Model.modelName === 'QualityInspection') return { harvest: { $in: await Harvest.find({ contract: { $in: contractIds } }).distinct('_id') } };
    if (Model.modelName === 'User') return { _id: { $in: await Application.find({ contract: { $in: contractIds } }).distinct('farmer') }, role: 'FARMER' };
    if (Model.modelName === 'Farm') return { _id: { $in: await Application.find({ contract: { $in: contractIds } }).distinct('farm') } };
    return { _id: null };
  }
  if (role === 'OFFICER') {
    const contractIds = await Contract.find({ assignedOfficer: _id }).distinct('_id');
    if (Model.modelName === 'Contract') return { assignedOfficer: _id };
    if (Model.modelName === 'CropMonitoring') return { officer: _id };
    if (Model.modelName === 'User') return { _id: { $in: await Application.find({ contract: { $in: contractIds }, status: 'ACCEPTED' }).distinct('farmer') }, role: 'FARMER' };
    if (Model.modelName === 'Farm') return { _id: { $in: await Application.find({ contract: { $in: contractIds }, status: 'ACCEPTED' }).distinct('farm') } };
    return {};
  }
  return { _id: null };
}

function pathUserRole(req) {
  if (req.baseUrl.endsWith('/farmers')) return 'FARMER';
  if (req.baseUrl.endsWith('/companies')) return 'COMPANY';
  if (req.baseUrl.endsWith('/officers')) return 'OFFICER';
  return null;
}

export const list = (Model, populate = '') => async (req, res, next) => {
  try {
    const filter = await scopedFilter(Model, req);
    const requestedRole = Model.modelName === 'User' ? pathUserRole(req) : null;
    if (requestedRole && ['ADMIN', 'OFFICER'].includes(req.user.role)) filter.role = requestedRole;
    res.json(await populateQuery(Model.find(filter), populate).sort('-createdAt'));
  } catch (error) { next(error); }
};

export const getOne = (Model, populate = '') => async (req, res, next) => {
  try {
    const item = await populateQuery(Model.findOne({ ...(await scopedFilter(Model, req)), _id: req.params.id }), populate);
    if (!item) return res.status(404).json({ message: 'Record not found' });
    res.json(item);
  } catch (error) { next(error); }
};

export const create = (Model, decorate = (data) => data) => async (req, res, next) => {
  try { res.status(201).json(await Model.create(decorate(req.body, req))); }
  catch (error) { next(error); }
};

export const update = (Model) => async (req, res, next) => {
  try {
    const item = await Model.findOneAndUpdate({ ...(await scopedFilter(Model, req)), _id: req.params.id }, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Record not found' });
    res.json(item);
  } catch (error) { next(error); }
};

export const remove = (Model) => async (req, res, next) => {
  try {
    const item = await Model.findOneAndDelete({ ...(await scopedFilter(Model, req)), _id: req.params.id });
    if (!item) return res.status(404).json({ message: 'Record not found' });
    res.status(204).end();
  } catch (error) { next(error); }
};

export async function apply(req, res, next) {
  try {
    const contract = await Contract.findOne({ _id: req.body.contract, status: 'OPEN' });
    if (!contract) return res.status(400).json({ message: 'This contract is not open for applications' });
    const application = await Application.create({ ...req.body, farmer: req.user._id });
    await Notification.create({ user: contract.company, message: `A farmer applied for your ${contract.crop} contract.`, type: 'INFO', entityType: 'Application', entityId: application._id });
    res.status(201).json(application);
  } catch (error) {
    if (error.code === 11000) { res.status(409); error.message = 'You have already applied to this contract'; }
    next(error);
  }
}

export async function decideApplication(req, res, next) {
  try {
    if (!['ACCEPTED', 'REJECTED'].includes(req.body.status)) return res.status(400).json({ message: 'Decision must be ACCEPTED or REJECTED' });
    const application = await Application.findById(req.params.id).populate('contract farmer');
    if (!application) return res.status(404).json({ message: 'Application not found' });
    if (req.user.role !== 'ADMIN' && String(application.contract.company) !== String(req.user._id)) return res.status(403).json({ message: 'You cannot decide this application' });
    const wasAccepted = application.status === 'ACCEPTED';
    application.status = req.body.status;
    application.companyRemarks = req.body.companyRemarks;
    await application.save();
    if (!wasAccepted && req.body.status === 'ACCEPTED') await Contract.findByIdAndUpdate(application.contract._id, { $inc: { selectedFarmers: 1 }, status: 'ACTIVE' });
    await Notification.create({ user: application.farmer._id, message: `Your application for ${application.contract.crop} was ${req.body.status.toLowerCase()}.`, type: req.body.status === 'ACCEPTED' ? 'SUCCESS' : 'INFO', entityType: 'Contract', entityId: application.contract._id });
    res.json(application);
  } catch (error) { next(error); }
}

export async function createContract(req, res, next) {
  try {
    const count = await Contract.countDocuments();
    const contract = await Contract.create({ ...req.body, company: req.user._id, contractId: `CF-${String(count + 1).padStart(4, '0')}`, totalEstimatedValue: Number(req.body.requiredQuantity) * Number(req.body.pricePerUnit) });
    res.status(201).json(contract);
  } catch (error) { next(error); }
}
