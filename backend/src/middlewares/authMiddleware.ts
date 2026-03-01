import { Request, Response, NextFunction } from 'express';
import { supabase } from '../utils/supabaseClient.js';

export interface AuthRequest extends Request {
    user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: 'No authorization header provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(500).json({ error: 'Internal server error during authentication' });
    }
};

export const authorize = (roles: string[]) => {
    return async (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const { data: profile, error } = await supabase
            .from('profiles') // We might need a profiles table to store roles
            .select('role')
            .eq('id', req.user.id)
            .single();

        if (error || !profile || !roles.includes(profile.role)) {
            return res.status(403).json({ error: 'Forbidden: Access denied' });
        }

        next();
    };
};
