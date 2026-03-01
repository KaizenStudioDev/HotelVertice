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
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', req.user.id)
            .single();

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
