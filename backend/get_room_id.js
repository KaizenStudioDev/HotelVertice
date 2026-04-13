import 'dotenv/config';
import { supabase } from './src/utils/supabaseClient.js';

async function getRoom() {
    const { data, error } = await supabase.from('rooms').select('id').limit(1).single();
    if (error) {
        console.error('Error fetching room:', error);
        process.exit(1);
    }
    console.log(data.id);
}

getRoom();
