import { Router } from 'express';
import { getRooms, getRoomById } from '../controllers/roomController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

// Public routes
router.get('/', getRooms);
router.get('/:id', getRoomById);

// Admin-only routes (placeholder handlers until roomController is extended)
router.post('/', authenticate, authorize(['admin']), (_req, res) => {
    res.status(501).json({ message: 'Create room: not yet implemented' });
});
router.patch('/:id', authenticate, authorize(['admin']), (_req, res) => {
    res.status(501).json({ message: 'Update room: not yet implemented' });
});
router.delete('/:id', authenticate, authorize(['admin']), (_req, res) => {
    res.status(501).json({ message: 'Delete room: not yet implemented' });
});

export default router;
