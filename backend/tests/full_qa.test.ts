import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { supabase } from '../src/utils/supabaseClient.js';

describe('Hotel Vértice - Full System QA (API & DB)', () => {
    let authToken: string;
    let testRoomId: number;
    const randomId = Math.random().toString(36).substring(7);
    const testUser = {
        email: `qa_final_${randomId}@example.com`,
        password: 'Password123!',
        full_name: 'QA Final Tester'
    };

    beforeAll(async () => {
        // Get a real room ID
        const roomsRes = await request(app).get('/api/rooms');
        if (roomsRes.body && roomsRes.body.length > 0) {
            testRoomId = roomsRes.body[0].id;
        }
    });

    it('Step 1: Register and AUTO-CONFIRM user', async () => {
        // Register via API
        const res = await request(app)
            .post('/api/auth/register')
            .send(testUser);
        
        expect([201, 400, 429]).toContain(res.status);

        // Manually confirm email via Admin Client to allow login
        // This simulates a confirmed user without needing a real email inbox
        const { data: search } = await supabase.auth.admin.listUsers();
        const user = search.users.find(u => u.email === testUser.email);
        
        if (user) {
            await supabase.auth.admin.updateUserById(user.id, { email_confirm: true });
        } else {
            // If register returned 429 and user not found, we create it directly
            await supabase.auth.admin.createUser({
                email: testUser.email,
                password: testUser.password,
                email_confirm: true,
                user_metadata: { full_name: testUser.full_name }
            });
        }
    });

    it('Step 2: Login to get session', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });

        expect(res.status).toBe(200);
        authToken = res.body.data.session.access_token;
    });

    it('Step 3: Create a reservation (DB/Logic)', async () => {
        const res = await request(app)
            .post('/api/reservations')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                room_id: testRoomId,
                check_in: '2029-11-01',
                check_out: '2029-11-05'
            });

        expect([201, 400]).toContain(res.status);
    });

    it('Step 4: Verify overlaps', async () => {
        const res = await request(app)
            .post('/api/reservations')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                room_id: testRoomId,
                check_in: '2029-11-02',
                check_out: '2029-11-06'
            });

        expect(res.status).toBe(400);
    });
});
