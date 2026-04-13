import { describe, it, expect, vi, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { supabase } from '../src/utils/supabaseClient.js';

// Global variable to store a real user ID for tests
let realUserId: string;

describe('Reservations API - QA Logic', () => {
    let testRoomId: number;

    beforeAll(async () => {
        // 1. Get a real room
        const roomRes = await request(app).get('/api/rooms');
        if (roomRes.body && roomRes.body.length > 0) {
            testRoomId = roomRes.body[0].id;
        }

        // 2. Get/Create a test user in auth.users (to satisfy FK)
        // Since we can't easily create auth.users from here without the admin key or real signup
        // we'll try to find any existing user or use a dedicated test user.
        // For QA, we'll use a known test UUID or fetch one.
        const { data: users } = await supabase.from('reservations').select('user_id').limit(1);
        if (users && users.length > 0) {
            realUserId = users[0].user_id;
        } else {
            // If no reservations exist, we might need to fetch a user from auth (if we have permissions)
            // or we'll just skip the FK check for now by mocking it if it's too complex
            // But let's assume we have at least one user from the Auth tests we just ran.
            realUserId = '00000000-0000-0000-0000-000000000000'; // Default fallback
        }
    });

    // Mocking the middleware AFTER we have the real ID if possible
    vi.mock('../src/middlewares/authMiddleware.js', () => ({
        authenticate: (req: any, res: any, next: any) => {
            req.user = { id: realUserId || '00000000-0000-0000-0000-000000000000' };
            next();
        },
        authorize: () => (req: any, res: any, next: any) => next()
    }));

    it('POST /api/reservations should successfully create a booking or return overlap', async () => {
        const year = 2030 + Math.floor(Math.random() * 5);
        const res = await request(app)
            .post('/api/reservations')
            .send({
                room_id: testRoomId,
                check_in: `${year}-05-01`,
                check_out: `${year}-05-05`
            });

        // Error log for debugging
        if (res.status === 500) {
            console.error('Reservation 500 Error:', res.body.error);
        }

        expect([201, 400]).toContain(res.status);
    });

    it('POST /api/reservations should fail with 400 if dates are backwards', async () => {
        const res = await request(app)
            .post('/api/reservations')
            .send({
                room_id: testRoomId,
                check_in: '2030-05-10',
                check_out: '2030-05-05'
            });

        expect(res.status).toBe(400);
    });

    it('POST /api/reservations should return 404 for non-existent room', async () => {
        const res = await request(app)
            .post('/api/reservations')
            .send({
                room_id: 999999,
                check_in: '2030-12-01',
                check_out: '2030-12-05'
            });

        expect(res.status).toBe(404);
    });
});
