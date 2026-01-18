import { useState } from 'react';
import Head from 'next/head';

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
    <>
      <Head>
        <title>Anti-Hustle Notes Generator</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div className="container">
        <div className="header-card">
          <div className="header-content">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="#9333ea" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <div>
              <h1 className="title">Anti-Hustle Notes Generator</h1>
              <p className="subtitle">
                Generate 10 fresh, authentic notes powered by Claude AI. Each batch is unique.
              </p>
            </div>
          </div>
          
          <button
            onClick={generateNotes}
            disabled={loading}
            className={`generate-btn ${loading ? 'loading' : ''}`}
          >
            <span className={loading ? 'spin' : ''}>↻</span>
            {loading ? 'Generating with AI...' : 'Generate 10 Fresh Notes'}
          </button>

          {error && (
            <div className="error">
              {error}
            </div>
          )}
        </div>

        {notes.length > 0 && (
          <div className="notes-container">
            <div className="info-banner">
              <p>
                ✨ <strong>Fresh content generated!</strong> Each note is unique and follows your anti-hustle philosophy. Click any note to copy.
              </p>
            </div>

            {notes.map((note, i) => (
              <div
                key={i}
                onClick={() => copyToClipboard(note.text, i)}
                className="note-card"
              >
                <div className="note-header">
                  <div className="tags">
                    <span className={`tag ${note.theme}`}>
                      {getThemeName(note.theme)}
                    </span>
                    <span className="tag hook">
                      {getHookLabel(note.hook)}
                    </span>
                  </div>
                  <div className="copy-icon">
                    {copiedIndex === i ? '✓' : '📋'}
                  </div>
                </div>
                <p className="note-text">
                  {note.text}
                </p>
              </div>
            ))}

            <div className="footer-banner">
              <p className="footer-main">
                Want a fresh batch? Click generate again for 10 completely new notes.
              </p>
              <p className="footer-sub">
                Each generation creates unique content based on your philosophy.
              </p>
            </div>
          </div>
        )}

        {notes.length === 0 && !loading && !error && (
          <div className="empty-state">
            <div className="empty-icon">✨</div>
            <p className="empty-main">
              Ready to generate your daily notes?
            </p>
            <p className="empty-sub">
              Click the button above to get 10 AI-generated notes tailored to your anti-hustle philosophy
            </p>
          </div>
        )}

        <style jsx global>{`
          * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f8fafc;
          }
        `}</style>

        <style jsx>{`
          .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 24px;
            min-height: 100vh;
          }
          .header-card {
            background: white;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            padding: 32px;
            margin-bottom: 24px;
          }
          .header-content {
            display: flex;
            align-items: start;
            gap: 12px;
            margin-bottom: 12px;
          }
          .icon {
            width: 32px;
            height: 32px;
            flex-shrink: 0;
          }
          .title {
            font-size: 32px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 8px;
          }
          .subtitle {
            color: #64748b;
          }
          .generate-btn {
            background: linear-gradient(to right, #9333ea, #3b82f6);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            border: none;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: opacity 0.2s;
          }
          .generate-btn:hover {
            opacity: 0.9;
          }
          .generate-btn.loading {
            background: #cbd5e1;
            cursor: not-allowed;
          }
          .spin {
            display: inline-block;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .error {
            margin-top: 16px;
            padding: 16px;
            background: #fef2f2;
            border: 1px solid #fecaca;
            border-radius: 8px;
            color: #991b1b;
          }
          .notes-container {
            display: flex;
            flex-direction: column;
            gap: 16px;
          }
          .info-banner {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 16px;
          }
          .info-banner p {
            font-size: 14px;
            color: #64748b;
          }
          .note-card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 24px;
            cursor: pointer;
            transition: box-shadow 0.2s;
          }
          .note-card:hover {
            box-shadow: 0 8px 16px rgba(0,0,0,0.15);
          }
          .note-header {
            display: flex;
            align-items: start;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 12px;
          }
          .tags {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }
          .tag {
            font-size: 12px;
            padding: 4px 12px;
            border-radius: 9999px;
            font-weight: 500;
          }
          .tag.small_scale { background: #dbeafe; color: #1e40af; }
          .tag.premium { background: #f3e8ff; color: #7c3aed; }
          .tag.rest { background: #dcfce7; color: #15803d; }
          .tag.enough { background: #fef3c7; color: #a16207; }
          .tag.stories { background: #ffe4e6; color: #be123c; }
          .tag.wisdom { background: #f1f5f9; color: #334155; }
          .tag.hook { background: #f1f5f9; color: #475569; }
          .copy-icon {
            flex-shrink: 0;
            color: #94a3b8;
          }
          .note-text {
            color: #334155;
            line-height: 1.6;
          }
          .footer-banner {
            background: linear-gradient(to right, #faf5ff, #eff6ff);
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 24px;
            text-align: center;
          }
          .footer-main {
            color: #334155;
            margin-bottom: 8px;
          }
          .footer-sub {
            font-size: 14px;
            color: #64748b;
          }
          .empty-state {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            padding: 48px;
            text-align: center;
          }
          .empty-icon {
            font-size: 64px;
            margin-bottom: 16px;
          }
          .empty-main {
            color: #64748b;
            font-size: 18px;
            margin-bottom: 8px;
          }
          .empty-sub {
            font-size: 14px;
            color: #94a3b8;
          }
        `}</style>
      </div>
    </>
  );
}
