/**
 * IMPORTANT DEPLOIEMENT VERCEL :
 * La variable d'environnement ANTHROPIC_API_KEY doit être ajoutée manuellement 
 * dans les paramètres du projet Vercel (Settings → Environment Variables).
 * Sans cette clé, les requêtes à l'assistant renverront une erreur.
 */

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Méthode non autorisée' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const messages: ChatMessage[] = body?.messages || [];

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        error: "La clé d'API ANTHROPIC_API_KEY n'est pas configurée dans les variables d'environnement Vercel.",
      });
    }

    const systemPrompt =
      "Tu es l'assistant intégré au site Métrio, un outil qui transforme les plans de construction en métré et devis automatiquement. Réponds uniquement aux questions sur le fonctionnement de Métrio et ses fonctionnalités : l'upload de plans, le choix entre le mode DQE détaillé et le mode devis par m², le cahier de calcul (métré), le tableau DQE (lots, ouvrages, ajout de matériaux depuis la bibliothèque), la tarification par crédits, l'export PDF/Excel, la bibliothèque de matériaux et prix, le récapitulatif de projet, les variantes de devis, l'historique des versions, et les paramètres du cabinet. Sois concis, concret, et guide l'utilisateur étape par étape s'il demande comment faire quelque chose. Si la question sort du fonctionnement du site, réponds poliment que tu ne peux aider que sur l'utilisation de Métrio.";

    const formattedMessages = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1024,
        system: systemPrompt,
        messages: formattedMessages,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      console.error('Erreur API Anthropic:', response.status, errData);
      return res.status(500).json({
        error: "Erreur lors de la communication avec l'assistant Anthropic.",
      });
    }

    const data = await response.json();
    const textContent =
      data.content?.find((c: any) => c.type === 'text')?.text ||
      "Désolé, je n'ai pas pu générer de réponse.";

    return res.status(200).json({ reply: textContent });
  } catch (error: any) {
    console.error('Erreur handler assistant:', error);
    return res.status(500).json({
      error: "Une erreur interne s'est produite lors du traitement de la requête.",
    });
  }
}
