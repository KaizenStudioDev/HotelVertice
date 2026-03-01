import { supabase } from './src/utils/supabaseClient';

async function seedRooms() {
    console.log('Seeding rooms...');

    // 1. Get Room Types IDs
    const { data: types, error: typeError } = await supabase.from('room_types').select('id, name');
    if (typeError) {
        console.error('Error fetching room types:', typeError);
        return;
    }

    const standard = types.find(t => t.name === 'Estándar')?.id;
    const suite = types.find(t => t.name === 'Suite')?.id;
    const familiar = types.find(t => t.name === 'Familiar')?.id;

    if (!standard || !suite || !familiar) {
        console.error('Room types not found. Please run the SQL schema first.');
        return;
    }

    const rooms = [];

    // Generate 24 rooms
    // Floor 1: 8 rooms (Standard)
    for (let i = 1; i <= 8; i++) {
        rooms.push({
            room_number: `10${i}`,
            type_id: standard,
            floor: 1,
            view_type: i % 2 === 0 ? 'Ciudad' : 'Jardín',
            status: 'available'
        });
    }

    // Floor 2: 8 rooms (4 Suite, 4 Familiar)
    for (let i = 1; i <= 4; i++) {
        rooms.push({
            room_number: `20${i}`,
            type_id: suite,
            floor: 2,
            view_type: 'Mar',
            status: 'available'
        });
        rooms.push({
            room_number: `20${i + 4}`,
            type_id: familiar,
            floor: 2,
            view_type: 'Jardín',
            status: 'available'
        });
    }

    // Floor 3: 8 rooms (4 Suite, 4 Standard)
    for (let i = 1; i <= 4; i++) {
        rooms.push({
            room_number: `30${i}`,
            type_id: suite,
            floor: 3,
            view_type: 'Mar',
            status: 'available'
        });
        rooms.push({
            room_number: `30${i + 4}`,
            type_id: standard,
            floor: 3,
            view_type: 'Ciudad',
            status: 'available'
        });
    }

    const { error } = await supabase.from('rooms').insert(rooms);

    if (error) {
        console.error('Error inserting rooms:', error);
    } else {
        console.log('24 rooms seeded successfully!');
    }
}

seedRooms();
