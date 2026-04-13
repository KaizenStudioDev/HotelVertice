import { Router } from 'express';
import { getReservations, getAllReservations, createReservation, cancelReservation } from '../controllers/reservationController.js';
import { authenticate, authorize } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticate); // Protect all reservation routes

// User routes
router.get('/', getReservations);
router.post('/', createReservation);
router.patch('/:id/cancel', cancelReservation);

// Admin routes
router.get('/admin/all', authorize(['admin']), getAllReservations);

export default router;
