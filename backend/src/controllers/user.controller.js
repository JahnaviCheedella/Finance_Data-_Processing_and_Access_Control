import { userService } from '../services/user.service.js';
import { sendSuccess } from '../utils/response.js';

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    sendSuccess(res, 200, 'Users fetched successfully', users);
  } catch (err) {
    next(err);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const user = await userService.updateUserRole(req.params.id, role);
    sendSuccess(res, 200, 'User role updated successfully', user);
  } catch (err) {
    next(err);
  }
};

export const updateUserStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const user = await userService.updateUserStatus(req.params.id, status);
    sendSuccess(res, 200, 'User status updated successfully', user);
  } catch (err) {
    next(err);
  }
};
