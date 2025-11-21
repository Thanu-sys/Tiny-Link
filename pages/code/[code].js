import { pool } from '../../lib/db';

export async function getServerSideProps({ params }) {
  const { code } = params;
  const result = await pool.query('SELECT * FROM links WHERE code=$1', [code]);

  if (!result.rows.length) return { notFound: true };

  return { props: { link: result.rows[0] } };
}

export default function Stats({ link }) {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Stats for {link.code}</h1>
      <p>Target URL: {link.url}</p>
      <p>Total clicks: {link.clicks}</p>
      <p>Last clicked: {link.last_clicked || 'Never'}</p>
    </div>
  );
}
