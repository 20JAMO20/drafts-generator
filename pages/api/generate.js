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
- EDGY and DIRECT - say uncomfortable truths others avoid
- Use visceral, slightly shocking analogies when they land the point (e.g., "You can wear all the perfume you want, but if you haven't showered in 5 days - you still stink")
- Wry observations with TEETH - make people laugh and wince simultaneously
- Don't soften observations for politeness - be honest, not nice
- Reference the power of storytelling and patterns observed over 30 years
- "The most powerful person in the world is the storyteller" - this philosophy underlies everything
- Think: would this make someone screenshot and share because it's BOLD?
- Punch up (at systems, BS, fake gurus) not down (at struggling people)
- Humor should have bite - not mean, but not polite either
- Vary sentence structures dramatically - don't start every note the same way
- When using analogies: make them specific, surprising, and slightly uncomfortable
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

Good examples OF THE STYLE (DO NOT copy these exact phrases):
- Direct/Edgy: "You can polish a newsletter with fancy design, but if your ideas are boring, people still won't read it. Packaging doesn't fix substance."
- Visceral analogy: "You can wear all the perfume you want, but if you haven't showered in 5 days - you still stink. Same with trying to grow without fixing your core offer."
- Uncomfortable truth: "Most 'authentic' content is just carefully curated messiness. Your audience isn't dumb. They see through it."
- With bite: "Posting daily without a point is performative anxiety. Your audience can feel it, and they're tired."
- Calling out BS: "The people selling you growth hacks are the ones who need your money to grow. Notice that?"
- Funny + edge: "Everyone's building in public. Half are lying, the other half are oversharing. Both are exhausting to watch."
- Punchy/provocative: "Small list. Big revenue. Zero BS. That's what actually works."
- Direct wisdom: "Thirty years in: the loudest voices have the least experience. The quiet ones? They're too busy making money to tweet about it."

THESE ARE STYLE EXAMPLES ONLY - create your own unique content following these patterns, don't reuse these exact phrases.

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
- Create your own unique punchy statements - don't copy the examples

CRITICAL FOR MAXIMUM VARIETY AND EDGE:
- Every note should feel distinct from the others
- Don't repeat sentence structures across the batch
- Vary your opening words dramatically (if one starts with "You don't", the next shouldn't)
- Mix interrogatives (questions), declaratives (statements), imperatives (commands), and observations
- Be BOLD - uncomfortable truths are more valuable than comfortable platitudes
- If it feels too safe or generic, push it further
- Think: "Would someone save this because it made them go 'DAMN, that's real'?"
- Randomize which themes get which hook types - don't fall into patterns

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
