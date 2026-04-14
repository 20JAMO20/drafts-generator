export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { product, format, idea } = req.body;
  if (!product || !format || !idea) return res.status(400).json({ error: 'Missing fields' });

  const products = {
    boc: {
      name: 'BackupOnCall',
      price: '$297/month',
      demo: '800-948-2822',
      pitch: 'AI voice answering service for small businesses — answers calls, captures messages, never misses a lead',
      niches: 'plumbers, electricians, HVAC, roofers, locksmiths, chiropractors, dentists, salons, real estate agents, property managers',
      pain: 'missed calls = missed revenue. Every unanswered call is a job going to a competitor.',
      cta: 'Hear it yourself: 800-948-2822'
    },
    hh: {
      name: 'HireHotline',
      price: '$497/month',
      demo: '800-915-0323 (code 1234)',
      pitch: 'AI candidate screening service — candidates call in, AI screens them, you get a ranked shortlist',
      niches: 'home health agencies, skilled nursing, assisted living, any business hiring at volume',
      pain: 'hiring is broken — phone tag, no-shows, gut-feel decisions, bad hires that cost thousands',
      cta: 'Experience the screening yourself: 800-915-0323 · code 1234'
    }
  };

  const formats = {
    hook: `CURIOSITY GAP HOOK FORMAT:
- Line 1: A bold statement or unexpected fact that stops the scroll. DO NOT give the payoff yet.
- Line 2-3: Build tension. Hint at what's coming without revealing it.
- "See more" break happens around line 3-4. The payoff must come AFTER this break.
- Body: Tell the story or make the case. Short paragraphs, one idea per line.
- End with ONE clear takeaway or observation.
- Optional soft CTA in last line or as a PS.
- 150-250 words total.`,

    scenario: `SCENARIO FORMAT:
- Open with a specific moment: time, place, what happened. Make it feel real.
- Walk through what the business owner experienced (the pain, the miss, the cost).
- Pivot: introduce what changed or what could have been different.
- Land on the lesson or the product — naturally, not as a pitch.
- Conversational tone. Present tense where possible. Short sentences.
- 150-250 words total.`,

    myth: `MYTH VS REALITY FORMAT:
- Open with the myth as a bold statement (what most people believe).
- One line break.
- "Reality:" — then flip it with specifics. Use numbers where possible.
- 2-3 lines expanding the reality.
- Close with a sharp one-liner that makes the contrast undeniable.
- Optional CTA.
- 120-200 words total.`,

    punchy: `PUNCHY FORMAT:
- 3-6 short lines. Each one lands on its own.
- Build to a point. Don't explain — imply.
- Last line is the gut punch. Make it stick.
- No fluff. No filler. Every word earns its place.
- Under 100 words.`
  };

  const p = products[product];
  const f = formats[format];

  const systemPrompt = `You write LinkedIn posts for a solopreneur who has been self-employed for 30+ years. He is not a guru. He does not hustle. He builds small, focused AI-powered tools for small businesses.

VOICE RULES:
- Conversational. Direct. A little dry.
- No "I'm excited to share" — ever.
- No bullet points unless it's the myth format.
- No em dashes. Use periods or commas.
- No corporate language. No buzzwords.
- Short sentences. 4th grade reading level.
- Sounds like a person, not a press release.
- Anti-hustle, anti-guru. Experience is an edge, not a liability.

PRODUCT BEING PROMOTED: ${p.name}
What it does: ${p.pitch}
Who it's for: ${p.niches}
The core pain it solves: ${p.pain}
Price: ${p.price}
CTA to use (if including one): ${p.cta}

WRITING FORMAT TO USE:
${f}

LINKEDIN ALGORITHM NOTES:
- The first 3-4 lines must earn the click to "see more"
- Curiosity gap: hint at the payoff, don't give it away before the break
- No hashtags unless 1-2 highly relevant ones at the very end
- Line breaks matter — white space keeps people reading on mobile

OUTPUT: The post only. No intro, no explanation, no title. Just the post, ready to copy and publish.`;

  const userPrompt = `Here is the raw idea or observation to build this post from:\n\n${idea}\n\nWrite the LinkedIn post now.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    const data = await response.json();
    const text = data.content?.map(b => b.text || '').join('') || '';
    res.status(200).json({ post: text });
  } catch (err) {
    res.status(500).json({ error: 'Generation failed' });
  }
}
