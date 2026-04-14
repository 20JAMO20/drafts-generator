import { useState } from 'react';

const QUIZZES = [
  { label: 'None', value: '' },
  { label: 'Are you ready to go solo?', value: 'Are you ready to go solo?' },
  { label: 'What kind of solopreneur are you?', value: 'What kind of solopreneur are you?' },
  { label: 'Is your pricing too low?', value: 'Is your pricing too low?' },
  { label: 'How are you getting your next client?', value: 'How are you getting your next client?' },
  { label: 'Expertise discovery', value: 'Expertise discovery' },
];

const THEMES = [
  { label: '— pick one —', value: '' },
  { label: 'Small > Scale', value: 'Small > Scale' },
  { label: 'Premium > Cheap', value: 'Premium > Cheap' },
  { label: 'Rest > Hustle', value: 'Rest > Hustle' },
  { label: 'Enough > More', value: 'Enough > More' },
  { label: 'Stories > Sales', value: 'Stories > Sales' },
  { label: 'Experience as Edge', value: 'Experience as Edge' },
];

function buildPrompt(mode, story, theme, length, cta, outputs, splitScripts) {
  const ctaInstruction = cta
    ? `Near the end of the newsletter, include a soft natural mention of the quiz "${cta}" at solopreneurstory.net. One sentence, no hard pitch.`
    : 'No quiz CTA needed in the newsletter.';
  const themeInstruction = theme
    ? `The primary theme to lean into for the newsletter is: "${theme}".`
    : 'Let the newsletter theme emerge naturally from the story.';

  const sharedVoice = `VOICE AND NON-NEGOTIABLE RULES:
- No em dashes anywhere. Use periods, commas, or parentheses instead.
- No fabricated details. Never invent dialogue, scenes, emotions, metrics, or outcomes not in the input.
- No motivational poster language. No guru posturing. No "crushing it."
- Warm, conversational, direct. Sounds like someone 30+ years in business, not on a stage.
- Short sentences. If it sounds like an essay, break it up.
- No listicle format in the newsletter.

BACKGROUND (use naturally, never as a resume):
- 30+ years in business, 25+ years as a physician recruiter
- Built three AI-powered products without a coding background — BackupOnCall (AI voice agent for small businesses), HireHotline (AI candidate screening for companies hiring), and QuizCal (quiz-to-lead-gen tool)
- Core philosophy: Small > Scale, Premium > Cheap, Rest > Hustle, Enough > More, Stories > Sales`;

  const tiktokInstruction = outputs.tiktok ? `OUTPUT: TIKTOK SCRIPT${mode === 'found' && splitScripts ? 'S (SPLIT: YES — two parts)' : mode === 'found' ? ' (SPLIT: NO — single script)' : ''}
Target: 200-275 words per script. Hard limit. State word count at end in brackets like [Word count: 241].
Structure:
- Hook: 1-2 sentences. Bold, scroll-stopping. ${mode === 'found' ? 'No name yet.' : 'Grab attention immediately.'}
- Story: Short punchy sentences. Present tense where possible. Read-aloud format. ${mode === 'found' ? 'Withhold name until reveal.' : ''}
${mode === 'found' ? '- Reveal: Land the name simply. 1-2 sentences.\n' : ''}- Lesson: 2 sentences maximum.
- Tagline (exact): "Remember — being a solopreneur is a self-development program disguised as a job. The lessons are everywhere. Apply them and grow." Solopreneur Story.
No stage directions. Clean text only.` : '';

  const newsletterInstruction = outputs.newsletter ? `OUTPUT: NEWSLETTER
${length}. ${mode === 'personal' ? 'First person. Your real experience.' : 'Third person. Withhold the name until the natural reveal beat. Do NOT introduce the name in the opening paragraph.'}
Give 3 subject line options: 1. [Direct] 2. [Question] 3. [Observational]
${mode === 'found' ? 'Give 3 title options: 1. [Direct] 2. [Intriguing] 3. [Unexpected angle]\n' : ''}Open straight into the story. No preamble. Use only details from the input. Bridge to universal solopreneur truth. Extract the practical lesson. Brief personal reflection. Close with a single resonant thought.
${themeInstruction}
${ctaInstruction}
Sign off: —John
P.S. rotate between: "Writing your own solopreneur story? Hit reply. I read every one." / "If this resonated, share it with a solopreneur who needs to hear it." / "Curious about something I mentioned? Just reply. Real conversations only."` : '';

  const descriptionInstruction = outputs.description ? `OUTPUT: VIDEO DESCRIPTION
2-3 sentences plus hashtags. ${mode === 'found' ? 'Do NOT reveal the name or lesson.' : 'Create curiosity without giving away the lesson.'} Weave in naturally: success story, solopreneur, startup story, building in public.
End with: #successstory #solopreneur #buildinpublic #solopreneurlife #startupstory` : '';

  const instructions = [tiktokInstruction, newsletterInstruction, descriptionInstruction].filter(Boolean).join('\n\n');

  const modeContext = mode === 'personal'
    ? "The story below is a PERSONAL story — something the author actually experienced. Write in first person."
    : "The story below is a FOUND STORY from history, sports, business, or biography. Third person. Withhold the subject's name until the reveal beat in TikTok and newsletter. Never reveal name or lesson in the video description.";

  return `You are generating content for Solopreneur Story, a personal brand for a solopreneur with 30+ years of business experience.

${sharedVoice}

${modeContext}

Generate only the outputs requested. Label each section clearly.

${instructions}

STORY INPUT:
${story}

NOW PRODUCE ALL REQUESTED OUTPUTS IN FULL.`;
}

function extract(fullText, ...markers) {
  for (const marker of markers) {
    const idx = fullText.toLowerCase().indexOf(marker.toLowerCase());
    if (idx === -1) continue;
    const start = fullText.indexOf('\n', idx);
    if (start === -1) continue;
    const remaining = fullText.slice(start + 1).trim();
    const stops = ['output: tiktok', 'output: newsletter', 'output: video', 'tiktok script', 'newsletter\n', 'video description'];
    let end = remaining.length;
    for (const s of stops) {
      if (marker.toLowerCase().includes(s)) continue;
      const ni = remaining.toLowerCase().indexOf(s);
      if (ni > 0 && ni < end) end = ni;
    }
    return remaining.slice(0, end).trim();
  }
  return '';
}

const s = {
  wrap: { fontFamily: 'Georgia, serif', background: '#faf9f7', minHeight: '100vh', padding: '0 0 64px' },
  header: { background: '#fff', borderBottom: '1px solid #e8e2d9', padding: '18px 32px', display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 28 },
  h1: { fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: '#1c1814', margin: 0 },
  nav: { marginLeft: 'auto', display: 'flex', gap: 16 },
  navLink: { fontFamily: 'sans-serif', fontSize: 13, color: '#8a8278', textDecoration: 'none' },
  navActive: { fontFamily: 'sans-serif', fontSize: 13, color: '#1c1814', fontWeight: 600, textDecoration: 'none' },
  inner: { maxWidth: 700, margin: '0 auto', padding: '0 24px' },
  lbl: { fontFamily: 'sans-serif', fontSize: 12, fontWeight: 600, color: '#6b6560', display: 'block', marginTop: 20, marginBottom: 6, letterSpacing: 0.3 },
  hint: { fontFamily: 'sans-serif', fontSize: 12, color: '#a09890', marginTop: 4 },
  modeRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 6 },
  modeCard: (active) => ({ border: active ? '1.5px solid #1c1814' : '1px solid #d8d0c8', borderRadius: 10, padding: '14px 16px', cursor: 'pointer', background: '#fff' }),
  modeTitle: { fontFamily: 'sans-serif', fontSize: 14, fontWeight: 600, color: '#1c1814', marginBottom: 3 },
  modeDesc: { fontFamily: 'sans-serif', fontSize: 12, color: '#8a8278', lineHeight: 1.5 },
  outRow: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 6 },
  outCard: (active) => ({ border: active ? '1.5px solid #1c1814' : '1px solid #d8d0c8', borderRadius: 8, padding: '12px 14px', cursor: 'pointer', background: active ? '#f5f2ee' : '#fff' }),
  outTitle: { fontFamily: 'sans-serif', fontSize: 13, fontWeight: 600, color: '#1c1814' },
  outDesc: { fontFamily: 'sans-serif', fontSize: 11, color: '#a09890', marginTop: 2 },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 },
  select: { width: '100%', fontFamily: 'sans-serif', fontSize: 14, color: '#1c1814', background: '#fff', border: '1px solid #d8d0c8', borderRadius: 8, padding: '9px 12px' },
  tags: { display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 },
  tag: (active) => ({ fontFamily: 'sans-serif', fontSize: 12, padding: '4px 10px', background: active ? '#fff' : '#f0ece6', border: active ? '1.5px solid #1c1814' : '1px solid #d8d0c8', borderRadius: 20, cursor: 'pointer', color: active ? '#1c1814' : '#6b6560', fontWeight: active ? 600 : 400 }),
  splitRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 6 },
  splitBtn: (active) => ({ border: active ? '1.5px solid #1c1814' : '1px solid #d8d0c8', borderRadius: 8, padding: '9px 14px', cursor: 'pointer', fontFamily: 'sans-serif', fontSize: 13, fontWeight: active ? 600 : 400, color: active ? '#1c1814' : '#6b6560', textAlign: 'center', background: '#fff' }),
  textarea: { width: '100%', fontFamily: 'Georgia, serif', fontSize: 14, color: '#1c1814', background: '#fff', border: '1px solid #d8d0c8', borderRadius: 8, padding: '12px 14px', lineHeight: 1.7, resize: 'vertical' },
  genBtn: (disabled) => ({ marginTop: 20, width: '100%', padding: '12px', fontFamily: 'sans-serif', fontSize: 15, fontWeight: 600, cursor: disabled ? 'not-allowed' : 'pointer', background: '#fff', color: '#1c1814', border: '1px solid #d8d0c8', borderRadius: 8, opacity: disabled ? 0.45 : 1 }),
  status: { fontFamily: 'sans-serif', fontSize: 13, color: '#6b6560', marginTop: 10, minHeight: 18 },
  divider: { border: 'none', borderTop: '1px solid #e8e2d9', margin: '28px 0' },
  sectionLbl: { fontFamily: 'sans-serif', fontSize: 11, fontWeight: 600, letterSpacing: 0.8, color: '#a09890', marginBottom: 8, textTransform: 'uppercase' },
  outBox: { background: '#f5f2ee', border: '1px solid #e8e2d9', borderRadius: 10, padding: '20px 24px', fontFamily: 'Georgia, serif', fontSize: 14, lineHeight: 1.8, color: '#1c1814', whiteSpace: 'pre-wrap', maxHeight: 520, overflowY: 'auto' },
  copyBtn: { marginTop: 8, padding: '7px 14px', fontFamily: 'sans-serif', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: '#fff', color: '#6b6560', border: '1px solid #d8d0c8', borderRadius: 8 },
};

export default function StudioPage() {
  const [mode, setMode] = useState('personal');
  const [outputs, setOutputs] = useState({ tiktok: true, newsletter: true, description: true });
  const [splitScripts, setSplit] = useState(false);
  const [theme, setTheme] = useState('');
  const [length, setLength] = useState('600-700 words');
  const [cta, setCta] = useState('');
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [results, setResults] = useState({ tiktok: '', newsletter: '', description: '' });
  const [done, setDone] = useState(false);
  const [copied, setCopied] = useState({});

  function toggleOutput(key) {
    setOutputs(prev => ({ ...prev, [key]: !prev[key] }));
  }

  function copySection(key, text) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(prev => ({ ...prev, [key]: true }));
      setTimeout(() => setCopied(prev => ({ ...prev, [key]: false })), 1500);
    });
  }

  async function generate() {
    if (!story.trim() || story.trim().length < 60) { setStatus('Add more detail before generating.'); return; }
    if (!outputs.tiktok && !outputs.newsletter && !outputs.description) { setStatus('Select at least one output.'); return; }

    setLoading(true); setDone(false); setStatus('Generating your content...');
    const prompt = buildPrompt(mode, story.trim(), theme, length, cta, outputs, splitScripts);

    try {
      const res = await fetch('/api/studio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt }) });
      const data = await res.json();
      const text = data.result || '';
      setResults({
        tiktok: extract(text, 'output: tiktok scripts', 'output: tiktok script', 'tiktok scripts', 'tiktok script'),
        newsletter: extract(text, 'output: newsletter', 'newsletter'),
        description: extract(text, 'output: video description', 'video description'),
      });
      setDone(true); setStatus('Done. Review before publishing.');
    } catch { setStatus('Something went wrong. Try again.'); }
    finally { setLoading(false); }
  }

  const personalPlaceholder = `Describe something you experienced, noticed, or learned. The more real detail, the better.

Examples:
- Pasted my cold email into a spam checker. 72 trigger words. Rewrote it in plain language. Open rates went from 2% to 31%.
- A contractor said he didn't need AI — then described spending two hours every morning returning missed calls.
- Broke my Supabase database trying to fix a Row Level Security issue. Three hours. Fixed it. No course taught me that.`;

  const foundPlaceholder = `Paste the full story here — history, sports, business, biography. Include as much detail as you have. Don't summarize or clean it up. Let the prompt do that work.`;

  return (
    <div style={s.wrap}>
      <div style={s.header}>
        <h1 style={s.h1}>Solopreneur Story</h1>
        <span style={{ fontFamily: 'sans-serif', fontSize: 11, color: '#a09890', letterSpacing: 1.5 }}>CONTENT STUDIO</span>
        <nav style={s.nav}>
          <a href="/" style={s.navLink}>Notes</a>
<a href="/notes" style={s.navLink}>Notes v2</a>
<a href="/studio" style={s.navActive}>Studio</a>
<a href="/linkedin" style={s.navLink}>LinkedIn</a>
        </nav>
      </div>

      <div style={s.inner}>
        <span style={s.lbl}>Story mode</span>
        <div style={s.modeRow}>
          {[['personal','Personal story','Something that happened to you. First person, your voice.'],['found','Found story','History, sports, business, biography. Name withheld until the reveal.']].map(([val,title,desc])=>(
            <div key={val} style={s.modeCard(mode===val)} onClick={()=>setMode(val)}>
              <div style={s.modeTitle}>{title}</div>
              <div style={s.modeDesc}>{desc}</div>
            </div>
          ))}
        </div>

        <span style={s.lbl}>What do you want to generate?</span>
        <div style={s.outRow}>
          {[['tiktok','TikTok script','200-275 words, read-aloud'],['newsletter','Newsletter','500-700 words, Substack ready'],['description','Video description','2-3 sentences + hashtags']].map(([key,title,desc])=>(
            <div key={key} style={s.outCard(outputs[key])} onClick={()=>toggleOutput(key)}>
              <div style={s.outTitle}>{title}</div>
              <div style={s.outDesc}>{desc}</div>
            </div>
          ))}
        </div>

        {mode==='found' && outputs.tiktok && (
          <>
            <span style={s.lbl}>TikTok split? <span style={{fontWeight:400,color:'#a09890'}}>(two dramatic arcs?)</span></span>
            <div style={s.splitRow}>
              {[[false,'Single script'],[true,'Split into Part 1 + Part 2']].map(([val,label])=>(
                <div key={String(val)} style={s.splitBtn(splitScripts===val)} onClick={()=>setSplit(val)}>{label}</div>
              ))}
            </div>
          </>
        )}

        {outputs.newsletter && (
          <>
            <div style={{...s.twoCol, marginTop: 0}}>
              <div>
                <span style={s.lbl}>Primary theme</span>
                <select style={s.select} value={theme} onChange={e=>setTheme(e.target.value)}>
                  {THEMES.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <span style={s.lbl}>Target length</span>
                <select style={s.select} value={length} onChange={e=>setLength(e.target.value)}>
                  <option value="500-600 words">500–600 words</option>
                  <option value="600-700 words">600–700 words</option>
                  <option value="700-800 words">700–800 words</option>
                </select>
              </div>
            </div>
            <span style={s.lbl}>Include a CTA? <span style={{fontWeight:400,color:'#a09890'}}>(optional)</span></span>
            <div style={s.tags}>
              {QUIZZES.map(q=>(
                <span key={q.value} style={s.tag(cta===q.value)} onClick={()=>setCta(q.value)}>{q.label}</span>
              ))}
            </div>
            <p style={s.hint}>If selected, I'll weave in a soft quiz mention near the end — no hard pitch.</p>
          </>
        )}

        <span style={s.lbl}>{mode==='personal' ? 'Your story or observation' : 'The found story'}</span>
        <p style={{...s.hint, marginBottom:6}}>{mode==='personal' ? "Be specific. What happened, what you felt, what the outcome was. Don't leave gaps." : "Paste the raw story. Don't summarize or clean it up. Let the prompt do that work."}</p>
        <textarea rows={9} style={s.textarea} value={story} onChange={e=>setStory(e.target.value)} placeholder={mode==='personal' ? personalPlaceholder : foundPlaceholder} />

        <button style={s.genBtn(loading)} disabled={loading} onClick={generate}>
          {loading ? 'Generating...' : 'Generate ↗'}
        </button>
        <div style={s.status}>{status}</div>

        {done && (
          <>
            <hr style={s.divider} />
            {outputs.tiktok && results.tiktok && (
              <div style={{marginBottom:24}}>
                <div style={s.sectionLbl}>TikTok script</div>
                <div style={s.outBox}>{results.tiktok}</div>
                <button style={s.copyBtn} onClick={()=>copySection('tiktok',results.tiktok)}>{copied.tiktok?'Copied':'Copy'}</button>
              </div>
            )}
            {outputs.newsletter && results.newsletter && (
              <div style={{marginBottom:24}}>
                <div style={s.sectionLbl}>Newsletter</div>
                <div style={s.outBox}>{results.newsletter}</div>
                <button style={s.copyBtn} onClick={()=>copySection('newsletter',results.newsletter)}>{copied.newsletter?'Copied':'Copy'}</button>
              </div>
            )}
            {outputs.description && results.description && (
              <div style={{marginBottom:24}}>
                <div style={s.sectionLbl}>Video description</div>
                <div style={s.outBox}>{results.description}</div>
                <button style={s.copyBtn} onClick={()=>copySection('description',results.description)}>{copied.description?'Copied':'Copy'}</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}