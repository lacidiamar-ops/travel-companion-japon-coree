export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  try {
    const { question, day } = req.body || {};
    if (!process.env.ANTHROPIC_API_KEY) {
      return res.status(200).json({
        answer: "L'assistant IA est prêt, mais la variable ANTHROPIC_API_KEY n'est pas encore configurée dans Vercel."
      });
    }
    const prompt = `Tu es un guide touristique familial francophone pour un voyage Japon/Corée. Réponds de façon pratique, courte et utile (max 4 phrases). ${day ? `Contexte journée: ${JSON.stringify(day)}.` : ''} Question: ${question}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 650,
        system: 'Tu es un assistant voyage mobile pour la famille Lacidi. Réponds en français, avec des conseils concrets, des infos GPS, timing, conseils familiaux et budget. Sois bref et pratique.',
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(200).json({ answer: `IA indisponible. Détail: ${text.slice(0, 200)}` });
    }

    const data = await response.json();
    const answer = data.content?.[0]?.text || 'Réponse vide.';
    return res.status(200).json({ answer });
  } catch (error) {
    return res.status(200).json({ answer: `Erreur assistant: ${error.message}` });
  }
}
