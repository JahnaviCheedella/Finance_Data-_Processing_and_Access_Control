import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

// All dashboard routes require authentication. All roles can view them.
router.use(authenticate);

router.get('/summary', dashboardController.getSummary);
router.get('/category-breakdown', dashboardController.getCategoryBreakdown);
router.get('/monthly-trends', dashboardController.getMonthlyTrends);
router.get('/recent-transactions', dashboardController.getRecentTransactions);

export default router;
