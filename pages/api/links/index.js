export default async function handler(req, res) {
  try {
    const links = await db.query('SELECT * FROM links'); // or your ORM call
    res.status(200).json(links.rows); // ✅ must be an array
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch links' });
  }
}
