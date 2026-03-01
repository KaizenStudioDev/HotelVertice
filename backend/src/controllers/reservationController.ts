import { Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient.js';

export const getReservations = async (req: any, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('reservations')
            .select('*, rooms(*), room_types:rooms(room_types(*))')
            .eq('user_id', req.user.id);

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createReservation = async (req: any, res: Response) => {
    const { room_id, check_in, check_out } = req.body;

    try {
        // 1. Check for overlapping reservations
        const { data: overlap, error: overlapError } = await supabase
            .from('reservations')
            .select('*')
            .eq('room_id', room_id)
            .eq('status', 'confirmed')
            .lt('check_in', check_out)
            .gt('check_out', check_in);

        if (overlapError) throw overlapError;
        if (overlap && overlap.length > 0) {
            return res.status(400).json({ error: 'Room is already booked for these dates' });
        }

        // 2. Get room price
        const { data: room, error: roomError } = await supabase
            .from('rooms')
            .select('*, room_types(base_price)')
            .eq('id', room_id)
            .single();

        if (roomError || !room) throw new Error('Room not found');

        const nights = (new Date(check_out).getTime() - new Date(check_in).getTime()) / (1000 * 3600 * 24);
        const total_price = nights * room.room_types.base_price;

        // 3. Create reservation
        const { data, error } = await supabase
            .from('reservations')
            .insert({
                user_id: req.user.id,
                room_id,
                check_in,
                check_out,
                total_price,
                status: 'confirmed'
            })
            .select()
            .single();

        if (error) throw error;
        res.status(201).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const cancelReservation = async (req: any, res: Response) => {
    const { id } = req.params;

    try {
        const { data, error } = await supabase
            .from('reservations')
            .update({ status: 'cancelled' })
            .eq('id', id)
            .eq('user_id', req.user.id) // Ensure user owns the reservation
            .select()
            .single();

        if (error) throw error;
        res.json({ message: 'Reservation cancelled successfully', data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
