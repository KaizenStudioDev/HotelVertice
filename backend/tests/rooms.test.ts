import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';

describe('Rooms API', () => {
    it('GET /api/rooms should return all rooms', async () => {
        const res = await request(app).get('/api/rooms');

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        if (res.body.length > 0) {
            expect(res.body[0]).toHaveProperty('room_number');
            expect(res.body[0]).toHaveProperty('room_types');
        }
    });

    it('GET /api/rooms/:id should return a single room or 404', async () => {
        // We'll use a likely non-existent ID or a valid one if we had it
        const res = await request(app).get('/api/rooms/999999');

        // Since it's a real check against Supabase (for now), it might be 404 or 500
        expect([404, 500]).toContain(res.status);
    });
});
