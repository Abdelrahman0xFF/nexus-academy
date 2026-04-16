import { Router } from 'express';
import { getEarnings } from '../controllers/earning.controller.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', authenticate, authorize('instructor', 'admin'), getEarnings);

export default router;
