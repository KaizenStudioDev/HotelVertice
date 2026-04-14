import { Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient.js';

export const register = async (req: Request, res: Response) => {
    const { email, password, full_name, role } = req.body;

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name,
                    role: role || 'guest'
                }
            }
        });

        if (error) throw error;
        res.status(201).json({ message: 'User registered successfully', data });
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

export const refreshToken = async (req: Request, res: Response) => {
    const { refresh_token } = req.body;
    if (!refresh_token) return res.status(400).json({ error: 'refresh_token required' });

    try {
        const { data, error } = await supabase.auth.refreshSession({ refresh_token });
        if (error || !data.session) throw error || new Error('No session');
        res.json({ data });
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) throw error;
        res.json({ message: 'Login successful', data });
    } catch (error: any) {
        res.status(401).json({ error: error.message });
    }
};

export const getProfile = async (req: any, res: Response) => {
    try {
        const { id, email, user_metadata } = req.user;
        // user_metadata.role is already merged from profiles table by authenticate()
        res.json({
            id,
            email,
            full_name: user_metadata?.full_name || '',
            role: user_metadata?.role || 'guest',
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updateProfile = async (req: any, res: Response) => {
    const { full_name } = req.body;

    if (!full_name || typeof full_name !== 'string' || full_name.trim().length === 0) {
        return res.status(400).json({ error: 'full_name is required' });
    }

    try {
        const { data, error } = await supabase.auth.admin.updateUserById(req.user.id, {
            user_metadata: { full_name: full_name.trim() }
        });

        if (error) throw error;
        res.json({
            id: data.user.id,
            email: data.user.email,
            full_name: data.user.user_metadata?.full_name,
            role: data.user.user_metadata?.role || 'guest',
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const updatePassword = async (req: any, res: Response) => {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    try {
        const { error } = await supabase.auth.admin.updateUserById(req.user.id, {
            password: newPassword
        });

        if (error) throw error;
        res.json({ message: 'Password updated successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
