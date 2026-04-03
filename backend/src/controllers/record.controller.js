import { recordService } from '../services/record.service.js';
import { sendSuccess } from '../utils/response.js';

export const createRecord = async (req, res, next) => {
  try {
    const record = await recordService.createRecord(req.user.userId, req.body);
    sendSuccess(res, 201, 'Record created successfully', record);
  } catch (error) {
    next(error);
  }
};

export const getRecords = async (req, res, next) => {
  try {
    const query = {
      ...req.query,
      userId: req.user.userId,
      role: req.user.role
    };
    const data = await recordService.getRecords(query);
    sendSuccess(res, 200, 'Records fetched successfully', data);
  } catch (error) {
    next(error);
  }
};

export const getRecordById = async (req, res, next) => {
  try {
    const record = await recordService.getRecordById(req.params.id);
    sendSuccess(res, 200, 'Record fetched successfully', record);
  } catch (error) {
    next(error);
  }
};

export const updateRecord = async (req, res, next) => {
  try {
    const record = await recordService.updateRecord(req.params.id, req.body);
    sendSuccess(res, 200, 'Record updated successfully', record);
  } catch (error) {
    next(error);
  }
};

export const deleteRecord = async (req, res, next) => {
  try {
    await recordService.deleteRecord(req.params.id);
    sendSuccess(res, 200, 'Record deleted successfully');
  } catch (error) {
    next(error);
  }
};
