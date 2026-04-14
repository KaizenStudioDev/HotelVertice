export default function handler(_req: any, res: any) {
    res.json({
        status: 'function ok',
        SUPABASE_URL: process.env.SUPABASE_URL ? 'SET (' + process.env.SUPABASE_URL.slice(0, 30) + '...)' : 'NOT SET',
        SUPABASE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY
            ? 'SET (length: ' + process.env.SUPABASE_SERVICE_ROLE_KEY.length + ')'
            : 'NOT SET',
    });
}
