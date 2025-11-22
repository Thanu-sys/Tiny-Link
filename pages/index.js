import { useEffect, useState } from 'react';
import LinkCard from '../components/LinkCard'; // adjust if your component path is different

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
        console.error('Failed to fetch links:', err);
        setError('Could not load links');
      }
    }

    fetchLinks();
  }, []);

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">TinyLink Dashboard</h1>

      {error && <p className="text-red-500">{error}</p>}

      {Array.isArray(links) && links.length > 0 ? (
        <div className="space-y-2">
          {links.map((link) => (
            <LinkCard key={link.id} {...link} />
          ))}
        </div>
      ) : (
        <p>No links found</p>
      )}
    </main>
  );
}
