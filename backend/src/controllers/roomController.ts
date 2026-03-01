import { Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient.js';

export const getRooms = async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('rooms')
            .select(`
        *,
        room_types (*)
      `);

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getRoomById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('rooms')
            .select(`
        *,
        room_types (*)
      `)
            .eq('id', id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: 'Room not found' });

        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
