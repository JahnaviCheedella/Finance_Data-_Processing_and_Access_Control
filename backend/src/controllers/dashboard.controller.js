import { dashboardService } from '../services/dashboard.service.js';
import { sendSuccess } from '../utils/response.js';

export const getSummary = async (req, res, next) => {
  try {
    const data = await dashboardService.getSummary();
    sendSuccess(res, 200, 'Dashboard summary fetched', data);
  } catch (err) {
    next(err);
  }
};

export const getCategoryBreakdown = async (req, res, next) => {
  try {
    const data = await dashboardService.getCategoryBreakdown();
    sendSuccess(res, 200, 'Category breakdown fetched', data);
  } catch (err) {
    next(err);
  }
};

export const getMonthlyTrends = async (req, res, next) => {
  try {
    const data = await dashboardService.getMonthlyTrends();
    sendSuccess(res, 200, 'Monthly trends fetched', data);
  } catch (err) {
    next(err);
  }
};

export const getRecentTransactions = async (req, res, next) => {
  try {
    const data = await dashboardService.getRecentTransactions();
    sendSuccess(res, 200, 'Recent transactions fetched', data);
  } catch (err) {
    next(err);
  }
};
