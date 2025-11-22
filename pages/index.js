import { useEffect, useState } from 'react';

export default function Home() {
  const [links, setLinks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchLinks() {
      try {
        const res = await fetch('/api/links');
        const json = await res.json();

        if (Array.isArray(json)) {
          setLinks(json);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error(err);
        setError('Could not load links');
      }
    }

    fetchLinks();
  }, []);

  return (
    <main>
      <h1>TinyLink Dashboard</h1>
      {error && <p>{error}</p>}
      {Array.isArray(links) && links.length > 0 ? (
        links.map(link => <div key={link.id}>{link.url}</div>)
      ) : (
        <p>No links found</p>
      )}
    </main>
  );
}
