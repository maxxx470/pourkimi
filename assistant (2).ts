import { Router, Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';

const router = Router();

const SYSTEM_PROMPT = `Tu es l'assistant virtuel expert de Métrio, une plateforme SaaS qui transforme les plans de construction en métrés et devis automatiquement par IA.

Voici tes connaissances principales sur Métrio pour guider les utilisateurs :
1. **Nouveau Projet / Upload de plans** : Cliquez sur le bouton "+" ou "Nouveau projet" pour importer vos plans au format PDF, DWG ou images (PNG/JPG).
2. **Choix du Mode** :
   - **Mode DQE détaillé** : Génère un métré complet lot par lot (terrassement, gros œuvre, menuiserie, etc.) avec quantités précises, prix unitaires et détails d'ouvrages.
   - **Mode Devis rapide (au m²)** : Un chiffrage estimatif global basé sur la surface et la typologie du bâtiment.
3. **Cahier de Calcul & DQE** : Vous pouvez modifier chaque ligne de métré, ajouter des articles personnalisés, ou lier des produits depuis la Bibliothèque de Matériaux et Prix.
4. **Exportation** : Exportez vos récapitulatifs, DQE et devis au format PDF ou Excel en un clic depuis les pages projet.
5. **Abonnement & Crédits** : Chaque analyse consomme 1 crédit projet. Vos crédits restants sont indiqués en haut à droite.

Sois concis, amical et clair dans vos explications. Si la question sort du cadre de Métrio, indiquez poliment que vous êtes spécialisé dans l'assistance sur l'application Métrio.`;

router.post('/', async (req: Request, res: Response) => {
  try {
    const { messages = [] } = req.body || {};
    
    // 1. Try Gemini API if GEMINI_API_KEY is available
    if (process.env.GEMINI_API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        
        // Format history for Gemini
        const formattedContents = messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: formattedContents,
          config: {
            systemInstruction: SYSTEM_PROMPT,
            temperature: 0.7,
            maxOutputTokens: 800,
          },
        });

        if (response.text) {
          return res.json({ reply: response.text });
        }
      } catch (geminiErr) {
        console.error('[Assistant] Gemini API call error:', geminiErr);
      }
    }

    // 2. Try Anthropic API if ANTHROPIC_API_KEY is available
    if (process.env.ANTHROPIC_API_KEY) {
      try {
        const formattedMessages = messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        }));

        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-3-5-sonnet-20241022',
            max_tokens: 800,
            system: SYSTEM_PROMPT,
            messages: formattedMessages,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const textContent = data.content?.find((c: any) => c.type === 'text')?.text;
          if (textContent) {
            return res.json({ reply: textContent });
          }
        }
      } catch (anthropicErr) {
        console.error('[Assistant] Anthropic API call error:', anthropicErr);
      }
    }

    // 3. Fallback rule-based helper if no API key is available or if calls fail
    const lastUserMsg = [...messages].reverse().find((m: any) => m.role === 'user')?.content?.toLowerCase() || '';

    let reply = "Je suis l'assistant Métrio ! Je peux vous aider à importer vos plans, créer des DQE ou des devis au m², exporter en PDF/Excel ou gérer votre bibliothèque de prix. Que souhaitez-vous savoir ?";

    if (lastUserMsg.includes('projet') || lastUserMsg.includes('nouveau') || lastUserMsg.includes('plan') || lastUserMsg.includes('upload') || lastUserMsg.includes('importer')) {
      reply = "Pour créer un nouveau projet, cliquez sur le bouton **'+'** dans le menu ou l'en-tête. Téléversez vos plans (PDF, DWG, images), puis choisissez entre le **mode DQE détaillé** ou le **mode Devis rapide**.";
    } else if (lastUserMsg.includes('dqe') || lastUserMsg.includes('métré') || lastUserMsg.includes('metre') || lastUserMsg.includes('calcul')) {
      reply = "Le mode **DQE** extrait automatiquement toutes les quantités par lot (terrassement, gros œuvre, second œuvre...). Vous pouvez ajuster les lignes dans le **Cahier de calcul** ou ajouter des fournitures directement depuis votre bibliothèque de matériaux.";
    } else if (lastUserMsg.includes('export') || lastUserMsg.includes('pdf') || lastUserMsg.includes('excel')) {
      reply = "Vous pouvez exporter tous vos documents au format **PDF** ou **Excel** depuis les pages de résultats (DQE, Devis ou Récapitulatif) via les boutons d'exportation en haut à droite.";
    } else if (lastUserMsg.includes('prix') || lastUserMsg.includes('matériau') || lastUserMsg.includes('bibliothèque')) {
      reply = "Accédez à l'onglet **Matériaux** depuis le menu pour gérer vos prix unitaires personnalisés et vos références de produits. Ces éléments s'insèrent directement dans vos DQE.";
    } else if (lastUserMsg.includes('crédit') || lastUserMsg.includes('abonnement') || lastUserMsg.includes('tarif')) {
      reply = "Chaque analyse de plan consomme **1 crédit projet**. Vous pouvez consulter votre solde actuel dans l'en-tête en haut à droite ou vous rendre sur la page **Abonnement** pour recharger.";
    }

    return res.json({ reply });
  } catch (error) {
    console.error('[Assistant Route Error]:', error);
    return res.status(500).json({ error: "Une erreur est survenue lors de la communication avec l'assistant." });
  }
});

export default router;
