const dotenv = require('dotenv');
dotenv.config({ path: '.env', override: true });

const postgres = require('postgres');
const url = process.env.DATABASE_URL;
console.log('Connecting to:', url.replace(/:[^:@]+@/, ':***@'));

const sql = postgres(url, { ssl: 'require', connect_timeout: 10 });

sql`SELECT 1 as ok`
  .then(r => { console.log('✓ DB connected:', r); process.exit(0); })
  .catch(e => { console.error('✗ DB error:', e.message); process.exit(1); });
