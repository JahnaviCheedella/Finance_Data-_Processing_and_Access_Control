import { Router } from 'express';
import * as recordController from '../controllers/record.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { authorizeRoles } from '../middlewares/rbac.js';
import { validateRequest } from '../middlewares/validate.js';
import { createRecordSchema, updateRecordSchema, getRecordsQuerySchema } from '../models/record.schema.js';

const router = Router();

// All record routes require authentication
router.use(authenticate);

// List and single view: accessible by all authenticated users
router.get('/', validateRequest(getRecordsQuerySchema, 'query'), recordController.getRecords);
router.get('/:id', recordController.getRecordById);

// Create, Update, Delete: accessible only by Analyst and Admin
const writeAuth = authorizeRoles('ANALYST', 'ADMIN');

router.post('/', writeAuth, validateRequest(createRecordSchema), recordController.createRecord);
router.put('/:id', writeAuth, validateRequest(updateRecordSchema), recordController.updateRecord);
router.delete('/:id', writeAuth, recordController.deleteRecord);

export default router;
