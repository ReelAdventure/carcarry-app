# CarCarry — Démarrage rapide

## 1. Installer Node.js (si pas déjà installé)

Téléchargez et installez Node.js LTS depuis :
https://nodejs.org/

Vérifiez l'installation :
```
node --version
npm --version
```

## 2. Installer les dépendances

```bash
cd carcarry-app
npm install
```

## 3. Lancer l'application

```bash
npm run dev
```

Ouvrez http://localhost:5173

## 4. Se connecter (mode démo)

Sur la page de connexion, sélectionnez un rôle :
- **Client** → Espace client (Alexandre Morand)
- **CarCarry** → Espace interne admin
- **Partenaire** → Espace partenaire

Cliquez sur "Se connecter" sans entrer de mot de passe.

---

## Connexion Supabase (optionnel)

1. Créez un projet sur https://supabase.com
2. Copiez les clés dans `.env.local` :
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhb...
```
3. Exécutez le fichier `supabase-schema.sql` dans l'éditeur SQL Supabase
4. Dans `src/services/*.service.ts`, passez `USE_MOCK = false`

---

## Structure du projet

```
src/
  components/
    ui/          # Badge, Button, Card, Input, Avatar, Modal
    layout/      # AppLayout, Sidebar, Header
  pages/
    auth/        # LoginPage
    client/      # Dashboard, Vehicles, Requests, Profile
    internal/    # Dashboard, Kanban, Clients, Partners, Requests, Activity
    partner/     # PartnerDashboard
  lib/
    supabase.ts  # Client Supabase
    utils.ts     # Fonctions utilitaires
  types/
    database.ts  # Types Supabase
  data/
    mockData.ts  # Données de démonstration
  services/
    vehicles.service.ts
    requests.service.ts
    partners.service.ts
  styles/
    globals.css  # Design system CarCarry
```

## Build production

```bash
npm run build
```
