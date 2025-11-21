// pages/[code].js
import { pool } from '../lib/db';

export async function getServerSideProps({ params, res }) {
  const { code } = params;

  try {
    const result = await pool.query('SELECT url FROM links WHERE code = $1', [code]);

    if (result.rows.length === 0) {
      return {
        notFound: true,
      };
    }

    const longUrl = result.rows[0].url;

    // Update click count and timestamp
    await pool.query(`
      UPDATE links
      SET clicks = clicks + 1,
          last_clicked = NOW()
      WHERE code = $1
    `, [code]);

    // Redirect to the original URL
    res.writeHead(302, { Location: longUrl });
    res.end();

    return { props: {} };
  } catch (error) {
    console.error('Redirect error:', error);
    return {
      notFound: true,
    };
  }
}

export default function RedirectPage() {
  return null; // This page never renders — it's just for server-side redirect
}
