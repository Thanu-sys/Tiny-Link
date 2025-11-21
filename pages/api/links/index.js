import { pool } from '../../../lib/db';


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url, code } = req.body;

    if (!url || !code) {
      return res.status(400).json({ error: 'Missing url or code' });
    }

    try {
      await pool.query('INSERT INTO links (code, url) VALUES ($1, $2)', [code, url]);
      return res.status(201).json({ message: 'Link added' });
    } catch (error) {
      console.error('DB insert error:', error);
      return res.status(500).json({ error: 'Failed to add link' });
    }
  } else {
    // Handle GET request
    try {
      const result = await pool.query('SELECT * FROM links ORDER BY last_clicked DESC NULLS LAST');
      return res.status(200).json(result.rows);
    } catch (error) {
      console.error('DB fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch links' });
    }
  }
}
