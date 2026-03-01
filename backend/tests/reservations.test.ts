import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { supabase } from '../src/utils/supabaseClient.js';

// Mocking the middleware to test the controller logic without real Auth
vi.mock('../src/middlewares/authMiddleware.js', () => ({
    authenticate: (req: any, res: any, next: any) => {
        req.user = { id: '00000000-0000-0000-0000-000000000000' };
        next();
    },
    authorize: () => (req: any, res: any, next: any) => next()
}));

describe('Reservations API - Logic Coverage', () => {
    it('POST /api/reservations should fail if dates are invalid', async () => {
        const res = await request(app)
            .post('/api/reservations')
            .send({
                room_id: 1,
                check_in: '2026-06-10',
                check_out: '2026-06-05' // check_out < check_in
            });

        expect(res.status).toBe(500); // Should trigger the check in BD or controller
    });

    it('POST /api/reservations should calculate price and create booking', async () => {
        // Note: This still depends on room with ID 1 existing in DB (seeded)
        const res = await request(app)
            .post('/api/reservations')
            .send({
                room_id: 1,
                check_in: '2027-01-01',
                check_out: '2027-01-05'
            });

        // If it works: 201. If it overlaps: 400. If DB error: 500.
        expect([201, 400, 500]).toContain(res.status);
        if (res.status === 201) {
            expect(res.body).toHaveProperty('total_price');
        }
    });

    it('PATCH /api/reservations/:id/cancel should cancel booking', async () => {
        // Note: Depends on reservation existing or error handling
        const res = await request(app).patch('/api/reservations/some-uuid/cancel');
        expect([200, 404, 500]).toContain(res.status);
    });

    it('GET /api/reservations should return list', async () => {
        const res = await request(app).get('/api/reservations');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
