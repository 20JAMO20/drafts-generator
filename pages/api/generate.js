export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  const prompt = `You are generating Substack Notes for a newsletter creator with 30+ years of solo business experience who takes an anti-hustle, trust-building approach.

CORE PHILOSOPHY (6 Themes):
1. Small>Scale - Trusting you don't need to be huge to succeed
2. Premium>Cheap - Trusting your value enough to charge what you're worth
3. Rest>Hustle - Trusting that sustainable pace beats burnout
4. Enough>More - Trusting you have enough and are enough
5. Stories>Sales - Trusting authentic storytelling over hard selling (emphasize the POWER of stories, reference that people remember stories not tactics, challenge tips-and-tactics culture)
6. 30+ Years Wisdom - Trusting accumulated wisdom over trends

WRITING STYLE (applies to ALL notes):
- Story-driven and narrative-based
- Use analogies and humor ONLY when they serve the point - don't force them
- Wry observations beat clever wordplay
- Reference the power of storytelling and patterns observed over 30 years
- Observational tone - "Ever notice...", "The creators who last...", "Thirty years taught me..."
- People remember stories, not tips - this worldview should influence the voice
- "The most powerful person in the world is the storyteller" - this philosophy underlies everything
- When using analogies: make them specific and surprising, not generic (e.g., "Running solo is like being a one-person band. You need to know all the instruments, but the audience only cares about the music.")
- Humor should feel like a knowing nod, not a punchline
- Vary your sentence structures - don't start every note the same way
- BUT: NEVER invent specific stories, people, or results that didn't happen

CONTENT FILTER (each note needs 2 of 3):
1. Contrarian - Challenges conventional wisdom
2. Trust - Relates to building/breaking trust
3. Expertise - Shows deep understanding of newsletters/business

HOOK TYPES (vary these - use 2-3 Punchy per batch):
- Permission Hook: "You don't have to..."
- Myth-Busting Hook: "Why [common advice] doesn't work"
- Alternative Path Hook: "Here's a different way to think about [topic]"
- Punchy Hook (20-30% of notes): Short, staccato statements. 3-4 brief sentences with strong cadence. Anti-hustle message with hustle-culture energy.

KEY INSIGHTS:
- Give relief, not pressure
- Story-driven, not tactics-driven
- Anti-hustle positioning
- Audience wants DIFFERENT tactics, not MORE

CRITICAL: AVOID FABRICATED PERSONAL CLAIMS
- DO NOT invent specific results ("I doubled my income by...")
- DO NOT claim to know specific people ("Some creators I know...")
- DO NOT make up anecdotes that didn't happen
- DO use: observations, questions, universal truths, philosophy, patterns you've noticed
- DO use: "What if...", "Consider that...", "Ever notice how...", general wisdom

Good examples:
- "You don't have to scale to six figures to make a living. Smaller can mean more profitable."
- "Why does everyone assume bigger is better? Profit per subscriber matters more than total subscribers."
- "Ever notice the loudest voices about growth are selling growth courses?"
- "The creators who last? Storytellers first, marketers second. Always have been."
- "Thirty years taught me: people forget your tips by Tuesday. They remember your stories for years."
- ANALOGY: "Running solo is like being a one-person band. You need to know all the instruments, but the audience only cares about the music."
- HUMOR: "Everyone's chasing viral. I'm over here making a living from 800 people who actually read my stuff. Boring wins."
- PUNCHY: "Small list. High trust. Good money. That's the formula nobody sells."
- PUNCHY: "Rest first. Create second. Hustle never. That's sustainability."
- STORIES>SALES: "Tips get skimmed. Stories get savored. Sales pages get ignored. Narratives get shared. Choose accordingly."

Bad examples (AVOID):
- "I doubled my revenue by cutting my list in half" (fabricated claim)
- "The wealthiest creators I know have small lists" (made-up people)
- "My client made $200K with 800 subscribers" (invented story)
- PUNCHY BUT WRONG PHILOSOPHY: "Show up tired. Sell scared. Ship unsure. That's how you win." (hustle culture)

Generate 10 unique Substack Notes (short-form, Twitter-like posts). Each should be:
- 2-4 sentences max (punchy notes can be shorter)
- Authentic and conversational
- Contrarian but not obnoxious
- Trust-building
- Based on universal truths and observations, NOT fabricated personal anecdotes
- VARY YOUR OPENINGS - don't start multiple notes the same way
- Mix direct statements, questions, observations, and occasional analogies

IMPORTANT: Include 2-3 "Punchy" hook notes per batch (20-30%). These should have:
- Short, staccato rhythm (brief sentences, strong cadence)
- Anti-hustle message with hustle-culture energy
- Pattern: Statement. Statement. Statement. Conclusion.
- Examples: "Small list. High trust. Good money. Nobody teaches this." OR "Rest first. Create second. Profit always. Sustain forever."

CRITICAL: Create MAXIMUM variety in structure and opening. Don't repeat sentence patterns or use the same hook types back-to-back. If you catch yourself starting multiple notes with "You don't have to..." or "Ever notice..." or "Why does..." - STOP and use a completely different structure.

Vary the themes and hook types. Make them feel like they come from someone who's been in the trenches for 30+ years and has wisdom to share, without making up specific claims.

Return ONLY a JSON array with this exact structure:
[
  {
    "theme": "small_scale",
    "hook": "permission",
    "text": "The actual note text here"
  }
]

Valid theme values: small_scale, premium, rest, enough, stories, wisdom
Valid hook values: permission, myth, alternative, punchy`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        messages: [
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      return res.status(response.status).json({ error: 'Failed to generate notes' });
    }

    const data = await response.json();
    const textContent = data.content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join('\n');

    // Extract JSON from response
    let jsonText = textContent.trim();
    if (jsonText.includes('```json')) {
      jsonText = jsonText.split('```json')[1].split('```')[0].trim();
    } else if (jsonText.includes('```')) {
      jsonText = jsonText.split('```')[1].split('```')[0].trim();
    }

    const notes = JSON.parse(jsonText);

    if (!Array.isArray(notes) || notes.length === 0) {
      return res.status(500).json({ error: 'Invalid response format' });
    }

    return res.status(200).json({ notes });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to generate notes' });
  }
}
