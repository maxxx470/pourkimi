# Métrio — SaaS de Métré et Devis Automatique 📐

Métrio est un SaaS innovant de métré et de devis automatique conçu spécifiquement pour les architectes et ingénieurs en génie civil en Afrique francophone et à l'international. Grâce à l'intelligence artificielle (propulsée par Claude Sonnet 3.5), Métrio analyse les plans de construction importés (PDF, images, DWG) pour extraire instantanément les quantitatifs et générer des tableaux de Devis Quantitatif et Estimatif (DQE) structurés.

Ce dépôt contient la **Phase 1 (Fondations & Architecture)** du projet.

---

## 🚀 Fonctionnalités — Phase 1

- **Design System Premium** : Entièrement basé sur la police **Urbanist** avec une charte de couleurs stricte par corps d'état (lots).
- **Structure Full-Stack Prête pour la Production** : 
  - **Frontend** : React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, et Recharts.
  - **Backend** : Express, TypeScript, Helmet (sécurité), Rate-Limiter (anti-spam), et validation d'entrées via Zod.
- **Client & Middleware Supabase** : Prêts pour l'authentification (JWT), la base de données (PostgreSQL), et le stockage de plans de construction.
- **Tableau de Bord Fonctionnel** : Un dashboard moderne, responsive avec affichage des statistiques et gestion intelligente des états de chargement (skeletons) et états vides (*empty states*).

---

## 📋 Prérequis

- **Node.js** v18.x ou supérieur
- **npm** ou **yarn** / **bun**
- Un projet **Supabase** (Base de données + Auth + Storage)
- Une clé API **Anthropic** (pour l'analyse intelligente des plans)
- Un compte **Resend** (pour l'envoi d'emails transactionnels)
- Un compte **CloudConvert** (pour la conversion des fichiers CAO/DWG en PDF)

---

## 🛠️ Instructions d'Installation

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/votre-compte/metrio.git
   cd metrio
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Configurer les variables d'environnement** :
   - Dupliquez le fichier `.env.example` en `.env` à la racine :
     ```bash
     cp .env.example .env
     ```
   - Remplissez les clés d'API correspondantes (Supabase, Anthropic, Resend, etc.).

---

## ⚙️ Variables d'Environnement Expliquées

| Variable | Type | Description |
| :--- | :--- | :--- |
| `VITE_SUPABASE_URL` | Frontend | URL publique de votre projet Supabase |
| `VITE_SUPABASE_ANON_KEY` | Frontend | Clé de lecture publique anonyme pour l'accès aux données |
| `VITE_API_URL` | Frontend | URL de destination du serveur API (ex: `http://localhost:3000`) |
| `PORT` | Serveur | Port d'écoute du serveur Express (par défaut: `3000`) |
| `NODE_ENV` | Serveur | Environnement d'exécution (`development` ou `production`) |
| `ALLOWED_ORIGINS` | Serveur | Origines autorisées pour les requêtes CORS séparées par des virgules |
| `ANTHROPIC_API_KEY` | Serveur | Clé d'API Claude Sonnet 3.5 pour l'analyse visuelle des plans |
| `SUPABASE_SERVICE_ROLE_KEY` | Serveur | Clé admin secrète Supabase pour contourner les règles RLS côté serveur |
| `RESEND_API_KEY` | Serveur | Clé API d'envoi d'emails transactionnels Resend |
| `CLOUDCONVERT_API_KEY` | Serveur | Clé API CloudConvert pour la conversion de fichiers DWG en PDF |

---

## 💻 Lancer l'Application en Développement

Lancez le serveur Express et le serveur de dev Vite en parallèle via une seule commande grâce à `tsx` :

```bash
npm run dev
```

L'application sera accessible sur :
- **Client & Serveur unifié** : [http://localhost:3000](http://localhost:3000)

---

## 🏗️ Compilation & Production

Pour compiler l'application en vue d'un déploiement :

```bash
npm run build
```

Cette commande compile le frontend React dans le dossier `dist/` et package le serveur Express TypeScript en un fichier unique optimisé `dist/server.cjs` à l'aide d'Esbuild.

Pour lancer le serveur de production :

```bash
npm run start
```

---

## ☁️ Déploiement

### Frontend (Vercel)
Pour déployer le frontend de manière indépendante sur Vercel :
1. Connectez votre dépôt GitHub à **Vercel**.
2. Définissez le dossier racine ou configurez les builds de sorte que `npm run build` soit exécuté.
3. Renseignez les variables d'environnement `VITE_` dans le dashboard de Vercel.

### Backend (Railway)
Pour déployer le backend Express sur Railway :
1. Créez un nouveau projet sur **Railway** lié à votre dépôt GitHub.
2. Ajoutez toutes les variables d'environnement serveur requises.
3. Le serveur démarrera automatiquement grâce au script `npm start` défini dans `package.json` et se liera au port affecté.
