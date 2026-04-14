import { Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient.js';

export const getRooms = async (req: Request, res: Response) => {
    const { check_in, check_out } = req.query as { check_in?: string; check_out?: string };

    try {
        const { data: rooms, error } = await supabase
            .from('rooms')
            .select('*, room_types(*)');

        if (error) throw error;

        // If no dates provided, return rooms with static status only
        if (!check_in || !check_out || !rooms) {
            return res.json(rooms);
        }

        // Find room_ids that have a confirmed reservation overlapping the requested dates
        const { data: bookedReservations, error: resError } = await supabase
            .from('reservations')
            .select('room_id')
            .eq('status', 'confirmed')
            .lt('check_in', check_out)   // reservation starts before requested checkout
            .gt('check_out', check_in);  // reservation ends after requested checkin

        if (resError) throw resError;

        const bookedRoomIds = new Set((bookedReservations ?? []).map(r => r.room_id));

        const roomsWithAvailability = rooms.map(room => ({
            ...room,
            is_available_for_dates: room.status === 'available' && !bookedRoomIds.has(room.id),
        }));

        res.json(roomsWithAvailability);
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
