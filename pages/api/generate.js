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
- Your goal: trigger an "Oof, I feel seen" response
- You're the friend who says what everyone thinks but no one says
- Deliver truth with a knowing smirk, never preach
- Expose the comfortable lies we tell ourselves
- Make people simultaneously laugh and wince
- Use "we" not "you" or "people" - be inclusive, not preachy
- Question and notice rather than declare and assert
- Reference patterns observed over 30 years
- "The most powerful person in the world is the storyteller" - this philosophy underlies everything
- BUT: NEVER invent specific stories, people, or results that didn't happen

PRIMARY FORMULA (use for 4-5 notes per batch):
"Do you ever wonder why [expose a comfortable lie/excuse we tell ourselves]?"
"What if [hit them with an uncomfortable truth they can't unsee]?"
"Something to think about!"

SECONDARY FORMULA (use for 2-3 notes per batch):
"Isn't it weird how [expose the contradiction/hypocrisy]?"
"What if [uncomfortable truth]?"
"Let that marinate a bit."

PUNCHY/DIRECT STYLE (use for 2-3 notes per batch):
Short, staccato statements that land a truth hard.
Pattern: Statement. Statement. Statement. Conclusion.
Anti-hustle message with bold energy.

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

FORMULA 1 EXAMPLES ("Do you ever wonder"):
- "Do you ever wonder why we have more self-help books than we have actual helpful habits? What if your library of wisdom is just an expensive way to feel productive while avoiding the discomfort of actual change? Something to think about!"
- "Do you ever wonder why we pretend 'I'm not ready yet' isn't just fear wearing a fancy mask? What if your perfect moment is actually hiding behind the messy action you're avoiding? Something to think about!"
- "Do you ever wonder why we call it 'building an audience' when we're really just avoiding conversations with the people already here? What if growth is the excuse we use to ignore depth? Something to think about!"

FORMULA 2 EXAMPLES ("Isn't it weird"):
- "Isn't it weird how we collect courses like trophies but never finish them? What if learning more is just a socially acceptable way to delay doing the scary thing? Let that marinate a bit."
- "Isn't it weird how we romanticize 'busy' but never talk about what we're avoiding by staying busy? What if all that hustle is just expensive procrastination? Let that marinate a bit."

PUNCHY EXAMPLES:
- "Small list. Real conversations. Actual revenue. Not sexy. Not scalable. Works."
- "Rest isn't laziness. Burnout isn't a badge. Sustainability beats intensity. Every single time."

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

CRITICAL REQUIREMENTS:
- Goal: "Oof, I feel seen" reaction - make them laugh and wince
- Name specific ways people fool themselves (not generic advice)
- Flip it with a truth that's obvious once stated but uncomfortable
- Always use "we" not "you" or "people" - be inclusive
- No preaching, just exposing what we already know deep down
- Make it personal and specific, never abstract
- The discomfort should feel like recognition, not attack
- Vary which themes get which formulas - don't be predictable
- Each note should expose a different comfortable lie we tell ourselves

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
