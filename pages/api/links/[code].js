import { pool } from '../../../lib/db';

export default async function handler(req, res) {
  const { code } = req.query;

  if (req.method === 'GET') {
    const result = await pool.query('SELECT * FROM links WHERE code=$1', [code]);
    if (!result.rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(result.rows[0]);
  }

  if (req.method === 'DELETE') {
    await pool.query('DELETE FROM links WHERE code=$1', [code]);
    res.json({ ok: true });
  }
}
