import { useState } from 'react';
import Head from 'next/head';

const TYPE_CONFIG = {
  quick:    { label: '⚡ Quick Hit',    color: '#1e5c1e', bg: '#eaf4ea', border: '#b8d8b8' },
  face:     { label: '🔥 In Your Face', color: '#8b1a1a', bg: '#fdeaea', border: '#f0b8b8' },
  encourage:{ label: '💛 Encouraging',  color: '#1a2e8b', bg: '#eaeefd', border: '#b8c4f0' },
  reframe:  { label: '🔄 Reframe',      color: '#5b2d8e', bg: '#f3eefe', border: '#d4b8f0' },
  quiz:     { label: '🎯 Quiz Promo',   color: '#6b4800', bg: '#fdf3e0', border: '#e8cc88' },
};

export default function Notes() {
  const [topic, setTopic] = useState('');
  const [activeTypes, setActiveTypes] = useState(['quick', 'face', 'encourage', 'reframe', 'quiz']);
  const [perCount, setPerCount] = useState(1);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  function toggleType(type) {
    if (activeTypes.includes(type)) {
      if (activeTypes.length > 1) setActiveTypes(activeTypes.filter(t => t !== type));
    } else {
      setActiveTypes([...activeTypes, type]);
    }
  }

  async function generate() {
    setLoading(true);
    setError('');
    setNotes([]);
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ types: activeTypes, perCount, topic })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      setNotes(data.notes || []);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  async function rewrite(index) {
    const note = notes[index];
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ types: [note.type], perCount: 1, topic })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const updated = [...notes];
      updated[index] = data.notes[0];
      setNotes(updated);
    } catch (e) {}
  }

  function copyNote(index) {
    navigator.clipboard.writeText(notes[index].text).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    });
  }

  function copyAll() {
    const all = notes.map(n => n.text).join('\n\n---\n\n');
    navigator.clipboard.writeText(all).then(() => {
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1800);
    });
  }

  return (
    <>
      <Head>
        <title>Notes Generator — Solopreneur Story</title>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #f7f3ee; font-family: 'DM Sans', sans-serif; color: #1c1814; }
        .header { background: #fff; border-bottom: 1px solid #e0d8ce; padding: 18px 32px; display: flex; align-items: baseline; gap: 14px; }
        .header h1 { font-family: 'Playfair Display', serif; font-size: 22px; font-weight: 700; }
        .header span { font-size: 11px; color: #8a8278; letter-spacing: 1.5px; text-transform: uppercase; }
        .main { max-width: 900px; margin: 0 auto; padding: 32px 24px; display: grid; grid-template-columns: 280px 1fr; gap: 24px; align-items: start; }
        @media(max-width:680px){ .main { grid-template-columns: 1fr; padding: 20px 16px; } .header { padding: 16px; } }
        .panel { background: #fff; border: 1px solid #e0d8ce; border-radius: 14px; padding: 24px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
        .panel-label { font-size: 11px; color: #8a8278; letter-spacing: 1.5px; text-transform: uppercase; font-weight: 600; margin-bottom: 8px; display: block; }
        textarea { width: 100%; background: #f7f3ee; border: 1px solid #e0d8ce; border-radius: 8px; padding: 10px 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1c1814; resize: vertical; min-height: 70px; outline: none; margin-bottom: 20px; line-height: 1.5; }
        textarea:focus { border-color: #b8860b; }
        textarea::placeholder { color: #b8b0a8; }
        .type-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 20px; }
        .type-btn { background: #f7f3ee; border: 2px solid #e0d8ce; border-radius: 8px; padding: 9px 10px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: #4a4540; cursor: pointer; text-align: left; transition: all 0.15s; }
        .type-btn.active { border-color: #b8860b; background: #fdf6e3; color: #7a5800; font-weight: 600; }
        .type-btn:hover { border-color: #b8860b; color: #7a5800; }
        .count-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
        .count-label { font-size: 13px; color: #4a4540; font-weight: 500; }
        .count-btns { display: flex; border: 1px solid #e0d8ce; border-radius: 7px; overflow: hidden; }
        .count-btn { background: #f7f3ee; border: none; border-right: 1px solid #e0d8ce; padding: 6px 16px; font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600; color: #4a4540; cursor: pointer; transition: all 0.15s; }
        .count-btn:last-child { border-right: none; }
        .count-btn.active { background: #b8860b; color: #fff; }
        .count-btn:hover:not(.active) { background: #fdf6e3; color: #7a5800; }
        .generate-btn { width: 100%; background: #b8860b; border: none; border-radius: 8px; padding: 13px; color: #fff; font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 15px; cursor: pointer; transition: background 0.2s; }
        .generate-btn:hover { background: #8a6408; }
        .generate-btn:disabled { background: #ccc; cursor: not-allowed; }
        .output { display: flex; flex-direction: column; gap: 14px; }
        .empty { background: #fff; border: 2px dashed #e0d8ce; border-radius: 14px; padding: 48px 24px; text-align: center; color: #8a8278; font-size: 14px; line-height: 1.6; }
        .empty .icon { font-size: 32px; margin-bottom: 12px; }
        .copy-all-row { display: flex; justify-content: flex-end; }
        .copy-all-btn { background: #fff; border: 2px solid #b8860b; border-radius: 7px; padding: 8px 18px; color: #7a5800; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 600; cursor: pointer; transition: all 0.15s; }
        .copy-all-btn:hover, .copy-all-btn.success { background: #b8860b; color: #fff; }
        .note-card { background: #fff; border: 1px solid #e0d8ce; border-radius: 12px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); animation: slideIn 0.25s ease; }
        @keyframes slideIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .badge { font-size: 12px; font-weight: 700; padding: 4px 12px; border-radius: 20px; border: 1px solid; display: inline-block; margin-bottom: 14px; }
        .note-text { font-size: 15px; line-height: 1.75; color: #1c1814; white-space: pre-wrap; margin-bottom: 16px; }
        .note-actions { display: flex; gap: 8px; }
        .action-btn { background: #f7f3ee; border: 1px solid #e0d8ce; border-radius: 6px; padding: 6px 14px; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; color: #4a4540; cursor: pointer; transition: all 0.15s; }
        .action-btn:hover { background: #b8860b; border-color: #b8860b; color: #fff; }
        .action-btn.success { background: #eaf4ea; border-color: #b8d8b8; color: #1e5c1e; }
        .loading { background: #fff; border: 1px solid #e0d8ce; border-radius: 12px; padding: 32px; text-align: center; color: #8a8278; font-size: 14px; }
        .dots { display: inline-flex; gap: 5px; margin-top: 10px; }
        .dot { width: 7px; height: 7px; background: #b8860b; border-radius: 50%; animation: blink 1.2s ease-in-out infinite; }
        .dot:nth-child(2) { animation-delay: 0.2s; }
        .dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes blink { 0%,80%,100%{opacity:0.15} 40%{opacity:1} }
        .error-card { background: #fdeaea; border: 1px solid #f0b8b8; border-radius: 10px; padding: 16px 20px; color: #8b1a1a; font-size: 14px; }
      `}</style>

      <header className="header">
        <h1>Solopreneur Story</h1>
        <span>Notes Generator</span>
      </header>

      <div className="main">
        <div className="panel">
          <span className="panel-label">Topic or Theme</span>
          <textarea
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder={"e.g. cold email, pricing, starting late…\n\nLeave blank for evergreen content."}
          />

          <span className="panel-label">Note Types</span>
          <div className="type-grid">
            {Object.entries(TYPE_CONFIG).map(([type, cfg]) => (
              <button
                key={type}
                className={`type-btn${activeTypes.includes(type) ? ' active' : ''}`}
                onClick={() => toggleType(type)}
              >
                {cfg.label}
              </button>
            ))}
          </div>

          <div className="count-row">
            <span className="count-label">Per type</span>
            <div className="count-btns">
              {[1, 2, 3].map(n => (
                <button
                  key={n}
                  className={`count-btn${perCount === n ? ' active' : ''}`}
                  onClick={() => setPerCount(n)}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <button className="generate-btn" onClick={generate} disabled={loading}>
            {loading ? 'Generating…' : 'Generate Notes'}
          </button>
        </div>

        <div className="output">
          {loading && (
            <div className="loading">
              Writing in your voice…
              <div className="dots">
                <div className="dot" /><div className="dot" /><div className="dot" />
              </div>
            </div>
          )}

          {error && <div className="error-card">{error}</div>}

          {!loading && !error && notes.length === 0 && (
            <div className="empty">
              <div className="icon">✍️</div>
              <p>Choose your settings and hit Generate.<br />Notes appear here, ready to copy into Substack.</p>
            </div>
          )}

          {notes.length > 0 && (
            <>
              <div className="copy-all-row">
                <button className={`copy-all-btn${copiedAll ? ' success' : ''}`} onClick={copyAll}>
                  {copiedAll ? '✓ Copied!' : 'Copy All'}
                </button>
              </div>

              {notes.map((note, i) => {
                const cfg = TYPE_CONFIG[note.type] || TYPE_CONFIG.quick;
                return (
                  <div key={i} className="note-card">
                    <span
                      className="badge"
                      style={{ background: cfg.bg, color: cfg.color, borderColor: cfg.border }}
                    >
                      {cfg.label}
                    </span>
                    <div className="note-text">{note.text}</div>
                    <div className="note-actions">
                      <button
                        className={`action-btn${copiedIndex === i ? ' success' : ''}`}
                        onClick={() => copyNote(i)}
                      >
                        {copiedIndex === i ? '✓ Copied' : 'Copy'}
                      </button>
                      <button className="action-btn" onClick={() => rewrite(i)}>
                        Rewrite
                      </button>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
}