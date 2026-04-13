import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testConnection() {
    console.log('🔌 Probando conexión con Supabase...');
    console.log(`   URL: ${supabaseUrl}`);
    console.log('');

    // 1. Ping: leer tabla rooms
    console.log('📋 [1/4] Consultando tabla "rooms"...');
    const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .select('id, room_number, floor, status')
        .limit(3);

    if (roomsError) {
        console.error('   ❌ ERROR:', roomsError.message);
    } else {
        console.log(`   ✅ OK — ${rooms?.length ?? 0} habitaciones devueltas (muestra de 3)`);
        rooms?.forEach(r => console.log(`      Room #${r.room_number} | Piso ${r.floor} | ${r.status}`));
    }

    console.log('');

    // 2. Tabla room_types
    console.log('🏷️  [2/4] Consultando tabla "room_types"...');
    const { data: types, error: typesError } = await supabase
        .from('room_types')
        .select('id, name, base_price, capacity');

    if (typesError) {
        console.error('   ❌ ERROR:', typesError.message);
    } else {
        console.log(`   ✅ OK — ${types?.length ?? 0} tipos de habitación encontrados`);
        types?.forEach(t => console.log(`      ${t.name} | Capacidad: ${t.capacity} | Precio: $${t.base_price}`));
    }

    console.log('');

    // 3. Tabla reservations
    console.log('📅 [3/4] Consultando tabla "reservations"...');
    const { data: reservations, error: resError } = await supabase
        .from('reservations')
        .select('id, status, check_in, check_out')
        .limit(3);

    if (resError) {
        console.error('   ❌ ERROR:', resError.message);
    } else {
        console.log(`   ✅ OK — ${reservations?.length ?? 0} reservas encontradas (muestra de 3)`);
        reservations?.forEach(r =>
            console.log(`      [${r.status}] ${r.check_in} → ${r.check_out}`)
        );
    }

    console.log('');

    // 4. Auth: listar usuarios (requiere service role)
    console.log('👤 [4/4] Verificando acceso a Auth (users)...');
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();

    if (usersError) {
        console.error('   ❌ ERROR:', usersError.message);
    } else {
        console.log(`   ✅ OK — ${users?.users?.length ?? 0} usuarios registrados en Auth`);
        users?.users?.slice(0, 3).forEach(u =>
            console.log(`      ${u.email} | Rol: ${u.user_metadata?.role ?? 'guest'}`)
        );
    }

    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const allOk = !roomsError && !typesError && !resError && !usersError;
    if (allOk) {
        console.log('🎉 Conexión con Supabase: EXITOSA');
    } else {
        console.log('⚠️  Conexión con Supabase: PARCIAL (ver errores arriba)');
    }
}

testConnection().catch(console.error);
