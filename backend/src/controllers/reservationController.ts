import { Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient.js';

export const getReservations = async (req: any, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('reservations')
            .select('*, rooms(*, room_types(*))')
            .eq('user_id', req.user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getAllReservations = async (_req: any, res: Response) => {
    try {
        const { data, error } = await supabase
            .from('reservations')
            .select('*, rooms(*, room_types(*))')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createReservation = async (req: any, res: Response) => {
    const { room_id, check_in, check_out } = req.body;

    try {
        // 0. Validate dates
        const checkInDate = new Date(check_in);
        const checkOutDate = new Date(check_out);
        if (checkOutDate <= checkInDate) {
            return res.status(400).json({ error: 'Check-out must be after check-in' });
        }

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
            .select('*')
            .eq('id', room_id)
            .maybeSingle();

        if (roomError) throw roomError;
        if (!room) {
            return res.status(404).json({ error: 'Room not found' });
        }

        // 2.1 Get price from room_types explicitly
        const { data: type, error: typeError } = await supabase
            .from('room_types')
            .select('base_price')
            .eq('id', room.type_id)
            .single();

        if (typeError || !type) {
            return res.status(500).json({ error: 'Room price not found for this type' });
        }

        const nights = Math.max(1, (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24));
        const total_price = nights * type.base_price;

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
    const role = req.user.user_metadata?.role;
    const isStaff = role === 'admin' || role === 'receptionist';

    try {
        const { data: existing } = await supabase
            .from('reservations')
            .select('*')
            .eq('id', id)
            .single();

        if (!existing) return res.status(404).json({ error: 'Reservation not found' });

        // Staff (admin/receptionist) can cancel any reservation; users can only cancel their own
        if (!isStaff && existing.user_id !== req.user.id) {
            return res.status(403).json({ error: 'Forbidden: Cannot cancel another user\'s reservation' });
        }

        const { data, error } = await supabase
            .from('reservations')
            .update({ status: 'cancelled' })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        res.json({ message: 'Reservation cancelled successfully', data });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};
