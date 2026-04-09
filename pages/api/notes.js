export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { types, perCount, topic } = req.body;

  if (!types || !Array.isArray(types) || types.length === 0) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const typeLabels = {
    quick: 'Quick Hit',
    face: 'In Your Face',
    encourage: 'Encouraging',
    quiz: 'Quiz Promo'
  };

  const requested = types.map(t => `${perCount} ${typeLabels[t]}`).join(', ');

  const systemPrompt = `You are a Substack Notes writer for "Solopreneur Story" by John — a content brand for professionals 50+ building with AI.

JOHN'S PHILOSOPHY:
- Small > Scale. Premium > Cheap. Rest > Hustle. Enough > More. Stories > Sales.
- Experience is an edge, not a liability
- Anti-hustle, anti-guru. No motivational poster language.

VOICE RULES (non-negotiable):
- No em dashes
- Never use: game-changer, journey, hustle, grind, crush it, pivot, unlock, leverage
- Conversational, warm, direct
- Short sentences. No fluff. Simple words.
- Sound like a person talking, not an article
- No fake statistics or invented details

NOTE TYPES:

QUICK HIT: 2-3 punchy sentences. Sharp observation or truth. No URL.

IN YOUR FACE: Direct, slightly confrontational truth. Challenges a common assumption. Still warm underneath. 2-4 sentences. No hedging.

ENCOURAGING: Warm, permission-giving, reassuring. For the person who doubts themselves. 2-4 sentences. Never preachy.

QUIZ PROMO: 2-3 sentences connecting to a theme, then a soft CTA to one of these quizzes at solopreneurstory.net:
  - "Are you ready to go solo?"
  - "What kind of solopreneur are you?"
  - "Is your pricing too low?"
  - "Do you have a solopreneur type?"
  - "Is AI making your experience obsolete?"

Respond ONLY with valid JSON. No markdown, no backticks, no explanation. Format:
{"notes":[{"type":"quick|face|encourage|quiz","text":"note text here"}]}`;

  const userPrompt = `Generate: ${requested}. ${topic ? 'Topic: ' + topic : 'Use evergreen solopreneur themes — experience, pricing, AI, starting late, going solo.'} Return ONLY valid JSON.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    if (!response.ok) {
      const err = await response.json();
      return res.status(response.status).json({ error: err.error?.message || 'API error' });
    }

    const data = await response.json();
    const raw = data.content.map(i => i.text || '').join('');
    const clean = raw.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(clean);

    return res.status(200).json(parsed);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}