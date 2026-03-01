import { describe, it, expect, vi } from 'vitest';
import { authenticate, authorize } from '../src/middlewares/authMiddleware.js';
import { supabase } from '../src/utils/supabaseClient.js';

describe('Auth Middleware', () => {
    it('authenticate should fail if no header', async () => {
        const req = { headers: {} } as any;
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
        const next = vi.fn();

        await authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ error: 'No authorization header provided' });
    });

    it('authenticate should fail if invalid token', async () => {
        const req = { headers: { authorization: 'Bearer invalid' } } as any;
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
        const next = vi.fn();

        // Mock supabase.auth.getUser to return error
        vi.spyOn(supabase.auth, 'getUser').mockResolvedValueOnce({ data: { user: null }, error: { message: 'invalid' } } as any);

        await authenticate(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('authorize should fail if role not included', async () => {
        const req = { user: { id: '123' } } as any;
        const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as any;
        const next = vi.fn();

        vi.spyOn(supabase, 'from').mockReturnValueOnce({
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn().mockResolvedValueOnce({ data: { role: 'guest' }, error: null })
        } as any);

        const authFn = authorize(['admin']);
        await authFn(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
    });
});
