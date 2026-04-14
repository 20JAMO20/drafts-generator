import { useState } from 'react';

const PRODUCTS = [
  {
    id: 'boc',
    label: 'BackupOnCall',
    desc: 'AI answering service · $297/mo',
    color: '#1a3a5c',
    accent: '#2a6496'
  },
  {
    id: 'hh',
    label: 'HireHotline',
    desc: 'AI candidate screening · $497/mo',
    color: '#2d1b4e',
    accent: '#6a3fa0'
  }
];

const FORMATS = [
  {
    id: 'hook',
    label: 'Curiosity Gap Hook',
    desc: 'Tease the payoff — make them click "see more"'
  },
  {
    id: 'scenario',
    label: 'Scenario',
    desc: 'A specific moment that shows the pain or the win'
  },
  {
    id: 'myth',
    label: 'Myth vs. Reality',
    desc: 'Flip a common belief with specifics'
  },
  {
    id: 'punchy',
    label: 'Punchy',
    desc: 'Short, sharp, lands on a gut punch'
  }
];

export default function LinkedIn() {
  const [product, setProduct] = useState('boc');
  const [format, setFormat] = useState('hook');
  const [idea, setIdea] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const selectedProduct = PRODUCTS.find(p => p.id === product);

  async function generate() {
    if (!idea.trim()) return;
    setLoading(true);
    setOutput('');
    setError('');
    setCopied(false);

    try {
      const res = await fetch('/api/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, format, idea })
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setOutput(data.post);
    } catch (e) {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: #0e0e0f;
          color: #e8e6e1;
          font-family: 'DM Sans', sans-serif;
          min-height: 100vh;
        }

        .page {
          max-width: 740px;
          margin: 0 auto;
          padding: 48px 24px 80px;
        }

        .header {
          margin-bottom: 40px;
        }

        .header h1 {
          font-family: 'DM Serif Display', serif;
          font-size: 2rem;
          color: #f0ede8;
          line-height: 1.2;
          margin-bottom: 6px;
        }

        .header p {
          color: #888;
          font-size: 0.9rem;
        }

        .section-label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #666;
          margin-bottom: 12px;
        }

        .section {
          margin-bottom: 28px;
        }

        /* Product toggle */
        .product-toggle {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .product-btn {
          background: #1a1a1b;
          border: 1.5px solid #2a2a2b;
          border-radius: 10px;
          padding: 14px 16px;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
        }

        .product-btn:hover {
          border-color: #444;
        }

        .product-btn.active-boc {
          background: #0d1e2e;
          border-color: #2a6496;
        }

        .product-btn.active-hh {
          background: #1a0f2e;
          border-color: #6a3fa0;
        }

        .product-btn-name {
          font-weight: 600;
          font-size: 0.95rem;
          color: #e8e6e1;
          margin-bottom: 3px;
        }

        .product-btn-desc {
          font-size: 0.78rem;
          color: #666;
        }

        /* Format grid */
        .format-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }

        .format-btn {
          background: #1a1a1b;
          border: 1.5px solid #2a2a2b;
          border-radius: 10px;
          padding: 12px 14px;
          cursor: pointer;
          text-align: left;
          transition: all 0.15s ease;
        }

        .format-btn:hover {
          border-color: #444;
        }

        .format-btn.active {
          background: #141a14;
          border-color: #4a7c4a;
        }

        .format-btn-name {
          font-weight: 600;
          font-size: 0.85rem;
          color: #e8e6e1;
          margin-bottom: 3px;
        }

        .format-btn-desc {
          font-size: 0.75rem;
          color: #666;
          line-height: 1.4;
        }

        /* Textarea */
        textarea {
          width: 100%;
          background: #1a1a1b;
          border: 1.5px solid #2a2a2b;
          border-radius: 10px;
          padding: 14px 16px;
          color: #e8e6e1;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          line-height: 1.6;
          resize: vertical;
          min-height: 110px;
          transition: border-color 0.15s;
          outline: none;
        }

        textarea:focus {
          border-color: #444;
        }

        textarea::placeholder {
          color: #444;
        }

        /* Generate button */
        .generate-btn {
          width: 100%;
          padding: 14px;
          border-radius: 10px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          margin-top: 4px;
        }

        .generate-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .generate-boc {
          background: #2a6496;
          color: #fff;
        }

        .generate-boc:hover:not(:disabled) {
          background: #3278b0;
        }

        .generate-hh {
          background: #6a3fa0;
          color: #fff;
        }

        .generate-hh:hover:not(:disabled) {
          background: #7d4fbb;
        }

        /* Output */
        .output-box {
          background: #141414;
          border: 1.5px solid #2a2a2b;
          border-radius: 10px;
          padding: 20px;
          margin-top: 28px;
          position: relative;
        }

        .output-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
        }

        .output-label {
          font-size: 0.72rem;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #555;
        }

        .copy-btn {
          background: #1e1e1f;
          border: 1px solid #333;
          border-radius: 6px;
          padding: 5px 12px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          color: #aaa;
          cursor: pointer;
          transition: all 0.15s;
        }

        .copy-btn:hover {
          background: #2a2a2b;
          color: #e8e6e1;
        }

        .copy-btn.copied {
          color: #6aaa6a;
          border-color: #4a7c4a;
        }

        .output-text {
          font-size: 0.9rem;
          line-height: 1.75;
          color: #d0cdc8;
          white-space: pre-wrap;
        }

        .loading-state {
          color: #555;
          font-size: 0.85rem;
          text-align: center;
          padding: 20px 0;
          font-style: italic;
        }

        .error-msg {
          color: #c0392b;
          font-size: 0.85rem;
          margin-top: 12px;
          text-align: center;
        }

        .divider {
          border: none;
          border-top: 1px solid #1e1e1f;
          margin: 32px 0;
        }

        @media (max-width: 480px) {
          .product-toggle, .format-grid {
            grid-template-columns: 1fr;
          }
          .header h1 { font-size: 1.6rem; }
        }
      `}</style>

      <div className="page">
        <div className="header">
          <h1>LinkedIn Post Generator</h1>
          <p>BackupOnCall · HireHotline · Posts that perform</p>
          <nav style={{ marginTop: 8, display: 'flex', gap: 16 }}>
  <a href="/" style={{ fontSize: '0.8rem', color: '#555', textDecoration: 'none' }}>Notes</a>
  <a href="/notes" style={{ fontSize: '0.8rem', color: '#555', textDecoration: 'none' }}>Notes v2</a>
  <a href="/studio" style={{ fontSize: '0.8rem', color: '#555', textDecoration: 'none' }}>Studio</a>
  <span style={{ fontSize: '0.8rem', color: '#888' }}>LinkedIn</span>
</nav>
        </div>

        {/* Product */}
        <div className="section">
          <div className="section-label">Product</div>
          <div className="product-toggle">
            {PRODUCTS.map(p => (
              <button
                key={p.id}
                className={`product-btn ${product === p.id ? `active-${p.id}` : ''}`}
                onClick={() => setProduct(p.id)}
              >
                <div className="product-btn-name">{p.label}</div>
                <div className="product-btn-desc">{p.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Format */}
        <div className="section">
          <div className="section-label">Format</div>
          <div className="format-grid">
            {FORMATS.map(f => (
              <button
                key={f.id}
                className={`format-btn ${format === f.id ? 'active' : ''}`}
                onClick={() => setFormat(f.id)}
              >
                <div className="format-btn-name">{f.label}</div>
                <div className="format-btn-desc">{f.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Idea */}
        <div className="section">
          <div className="section-label">Raw Idea or Observation</div>
          <textarea
            value={idea}
            onChange={e => setIdea(e.target.value)}
            placeholder="Drop in a rough idea, a stat, a customer story, a pain point — anything real. The messier the better."
          />
        </div>

        <button
          className={`generate-btn generate-${product}`}
          onClick={generate}
          disabled={loading || !idea.trim()}
        >
          {loading ? 'Writing...' : `Generate ${selectedProduct.label} Post`}
        </button>

        {error && <div className="error-msg">{error}</div>}

        {(output || loading) && (
          <div className="output-box">
            <div className="output-header">
              <span className="output-label">Your Post</span>
              {output && (
                <button className={`copy-btn ${copied ? 'copied' : ''}`} onClick={copy}>
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              )}
            </div>
            {loading
              ? <div className="loading-state">Writing your post...</div>
              : <div className="output-text">{output}</div>
            }
          </div>
        )}
      </div>
    </>
  );
}
