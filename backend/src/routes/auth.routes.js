import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validateRequest } from '../middlewares/validate.js';
import { registerSchema, loginSchema, refreshSchema } from '../models/auth.schema.js';
import { authenticate } from '../middlewares/auth.js';

const router = Router();

router.post('/register', validateRequest(registerSchema), authController.register);
router.post('/login', validateRequest(loginSchema), authController.login);
router.post('/refresh', validateRequest(refreshSchema), authController.refresh);
router.post('/logout', authenticate, authController.logout);

export default router;
