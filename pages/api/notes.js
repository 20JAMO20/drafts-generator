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
    reframe: 'Reframe',
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
- The flip must happen early — don't build to it, lead with it
- Short lines do emotional work. Don't combine what belongs on separate lines.
- Closing lines give permission or direction. Never a question.

NOTE TYPES:

QUICK HIT: 2-3 punchy sentences. Sharp observation or truth. No URL.

IN YOUR FACE: Direct, slightly confrontational truth. Challenges a common assumption. Still warm underneath. 2-4 sentences. No hedging.

ENCOURAGING: Warm, permission-giving, reassuring. For the person who doubts themselves. 2-4 sentences. Never preachy.

REFRAME: Names a belief the reader holds that is quietly limiting them — often a fear or doubt. Flips it in line 1 or 2. Stacks 2-3 short proof lines that build momentum. Lands on a fresh label for the opposite of that belief. Closes with one forward-pointing sentence that gives permission or direction. 4-6 lines max. No hedging. No URL.

Example of the Reframe structure that works:
Your years of experience aren't baggage to overcome.
They're your moat.
You've seen what works and what doesn't.
You've handled real problems, real people, real stakes.
That's not a disadvantage at 50+.
That's your unfair advantage.
Build from there.

Use this as your structural model, not your template. Different belief, different flip, different label each time.

QUIZ PROMO: 2-3 sentences connecting to a theme, then a soft CTA to one of these quizzes at solopreneurstory.net:
  - "Are you ready to go solo?"
  - "What kind of solopreneur are you?"
  - "Is your pricing too low?"
  - "Do you have a solopreneur type?"
  - "Is AI making your experience obsolete?"

Respond ONLY with valid JSON. No markdown, no backticks, no explanation. Format:
{"notes":[{"type":"quick|face|encourage|reframe|quiz","text":"note text here"}]}`;

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