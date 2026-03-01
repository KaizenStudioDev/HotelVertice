import { Router } from 'express';
import { getReservations, createReservation, cancelReservation } from '../controllers/reservationController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authenticate); // Protect all reservation routes

router.get('/', getReservations);
router.post('/', createReservation);
router.patch('/:id/cancel', cancelReservation);

export default router;
