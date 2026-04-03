import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/rbac.js';

const router = Router();

// Apply auth and ADMIN-only requirement for all user management routes
router.use(authenticate, authorizeRoles('ADMIN'));

router.get('/', userController.getAllUsers);
router.patch('/:id/role', userController.updateUserRole);
router.patch('/:id/status', userController.updateUserStatus);

export default router;
