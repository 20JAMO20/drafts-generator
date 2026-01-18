import { useState } from 'react';

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const themes = [
    { name: "Small>Scale", key: "small_scale", color: "bg-blue-100 text-blue-800" },
    { name: "Premium>Cheap", key: "premium", color: "bg-purple-100 text-purple-800" },
    { name: "Rest>Hustle", key: "rest", color: "bg-green-100 text-green-800" },
    { name: "Enough>More", key: "enough", color: "bg-amber-100 text-amber-800" },
    { name: "Stories>Sales", key: "stories", color: "bg-rose-100 text-rose-800" },
    { name: "30+ Years Wisdom", key: "wisdom", color: "bg-slate-100 text-slate-800" }
  ];

  const getThemeName = (key) => themes.find(t => t.key === key)?.name || key;
  const getThemeColor = (key) => themes.find(t => t.key === key)?.color || "bg-gray-100 text-gray-800";

  const getHookLabel = (hook) => {
    const labels = {
      permission: "Permission Hook",
      myth: "Myth-Busting",
      alternative: "Alternative Path",
      punchy: "Punchy"
    };
    return labels[hook] || hook;
  };

  const generateNotes = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!res.ok) {
        throw new Error('Failed to generate notes');
      }

      const data = await res.json();
      setNotes(data.notes);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <style jsx global>{`
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', padding: '32px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'start', gap: '12px', marginBottom: '12px' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 8px 0' }}>
              Anti-Hustle Notes Generator
            </h1>
            <p style={{ color: '#64748b', margin: 0 }}>
              Generate 10 fresh, authentic notes powered by Claude AI. Each batch is unique.
            </p>
          </div>
        </div>
        
        <button
          onClick={generateNotes}
          disabled={loading}
          style={{
            background: loading ? '#cbd5e1' : 'linear-gradient(to right, #9333ea, #3b82f6)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '500',
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span style={{ display: 'inline-block', animation: loading ? 'spin 1s linear infinite' : 'none' }}>↻</span>
          {loading ? 'Generating with AI...' : 'Generate 10 Fresh Notes'}
        </button>

        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>

        {error && (
          <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b' }}>
            {error}
          </div>
        )}
      </div>

      {notes.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '16px' }}>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              ✨ <strong>Fresh content generated!</strong> Each note is unique and follows your anti-hustle philosophy. Click any note to copy.
            </p>
          </div>

          {notes.map((note, i) => (
            <div
              key={i}
              onClick={() => copyToClipboard(note.text, i)}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                padding: '24px',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'}
            >
              <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '16px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '9999px', fontWeight: '500' }} className={getThemeColor(note.theme)}>
                    {getThemeName(note.theme)}
                  </span>
                  <span style={{ fontSize: '12px', padding: '4px 12px', borderRadius: '9999px', fontWeight: '500', backgroundColor: '#f1f5f9', color: '#475569' }}>
                    {getHookLabel(note.hook)}
                  </span>
                </div>
                <div style={{ flexShrink: 0 }}>
                  {copiedIndex === i ? (
                    <span style={{ color: '#16a34a' }}>✓</span>
                  ) : (
                    <span style={{ color: '#94a3b8' }}>📋</span>
                  )}
                </div>
              </div>
              <p style={{ color: '#334155', lineHeight: '1.6', margin: 0 }}>
                {note.text}
              </p>
            </div>
          ))}

          <div style={{ background: 'linear-gradient(to right, #faf5ff, #eff6ff)', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '24px', textAlign: 'center' }}>
            <p style={{ color: '#334155', marginBottom: '8px' }}>
              Want a fresh batch? Click generate again for 10 completely new notes.
            </p>
            <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
              Each generation creates unique content based on your philosophy.
            </p>
          </div>
        </div>
      )}

      {notes.length === 0 && !loading && !error && (
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '48px', textAlign: 'center' }}>
          <div style={{ fontSize: '64px', marginBottom: '16px' }}>✨</div>
          <p style={{ color: '#64748b', fontSize: '18px', marginBottom: '8px' }}>
            Ready to generate your daily notes?
          </p>
          <p style={{ fontSize: '14px', color: '#94a3b8', margin: 0 }}>
            Click the button above to get 10 AI-generated notes tailored to your anti-hustle philosophy
          </p>
        </div>
      )}
    </div>
  );
}
