import { useState, useEffect } from 'react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [links, setLinks] = useState([]);
  const [error, setError] = useState(null);

  // Fetch existing links
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

  // Submit new link
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const result = await res.json();
      if (result.code) {
        setLinks(prev => [...prev, result]);
        setUrl('');
      } else {
        throw new Error('Failed to shorten link');
      }
    } catch (err) {
      console.error(err);
      setError('Could not shorten link');
    }
  }

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">TinyLink Dashboard</h1>

      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter full URL"
          required
          className="flex-grow border px-3 py-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Shorten
        </button>
      </form>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {Array.isArray(links) && links.length > 0 ? (
        <ul className="space-y-2">
          {links.map(link => (
            <li key={link.id} className="border p-3 rounded">
              <p className="font-medium">{link.url}</p>
              <p className="text-sm text-gray-600">
                Shortlink: <a href={`/${link.code}`} className="text-blue-500">{link.code}</a>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No links found</p>
      )}
    </main>
  );
}
