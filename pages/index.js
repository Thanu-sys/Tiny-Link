import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    fetch('/api/links')
      .then(res => res.json())
      .then(setLinks)
      .catch(err => console.error('Failed to fetch links', err));
  }, []);

  async function addLink(e) {
    e.preventDefault();
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, code })
    });
    if (res.ok) {
      setUrl('');
      setCode('');
      const updated = await fetch('/api/links').then(r => r.json());
      setLinks(updated);
    } else {
      alert('Failed to add link');
    }
  }

  async function deleteLink(code) {
    await fetch(`/api/links/${code}`, { method: 'DELETE' });
    setLinks(links.filter(l => l.code !== code));
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">TinyLink Dashboard</h1>

      {/* Add Link Form */}
      <form onSubmit={addLink} className="flex gap-2 mb-6">
        <input
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="Long URL"
          className="flex-1 border rounded p-2"
          required
        />
        <input
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Custom code"
          className="w-40 border rounded p-2"
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add
        </button>
      </form>

      {/* Links Table */}
      <table className="table-auto w-full border-collapse border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">Code</th>
            <th className="border px-4 py-2">URL</th>
            <th className="border px-4 py-2">Clicks</th>
            <th className="border px-4 py-2">Last Clicked</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {links.map(l => (
            <tr key={l.code} className="hover:bg-gray-50">
              <td className="border px-4 py-2">{l.code}</td>
              <td className="border px-4 py-2 truncate max-w-xs">{l.url}</td>
              <td className="border px-4 py-2">{l.clicks}</td>
              <td className="border px-4 py-2">{l.last_clicked || 'Never'}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => deleteLink(l.code)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {links.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4 text-gray-500">
                No links yet. Add one above!
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
