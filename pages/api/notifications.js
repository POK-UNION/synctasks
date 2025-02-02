import { Pool } from 'pg';

// Konfigurasi koneksi ke Neon PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Pastikan variabel ini diset di .env
  ssl: {
    rejectUnauthorized: false,
  },
});

const ensureTableExists = async () => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS "Notification" (
      notifid SERIAL PRIMARY KEY,
      pesan TEXT NOT NULL,
      tanggal TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `;
  await pool.query(createTableQuery);
};

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      await ensureTableExists();
      const result = await pool.query('SELECT * FROM "Notification" ORDER BY tanggal DESC');
      res.status(200).json(result.rows);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
