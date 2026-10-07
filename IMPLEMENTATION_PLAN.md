# IMPLEMENTATION PLAN — Cori

## Phases

| # | Phase | Contenu | Statut |
|---|---|---|---|
| 1 | Données | Collecte depuis `*.ambafrance.org` et France Diplomatie, schéma JSON, marquage « à vérifier » | ✅ Fait |
| 2 | Page et rendu | `index.html`, rendu DOM natif, liens `tel:` / `mailto:` / cartes, navigation pays | ✅ Fait |
| 3 | Style mobile | CSS mobile-first, couleurs institutionnelles, badges, zones tactiles 44 px | ✅ Fait |
| 4 | Hors ligne & PWA | Service worker, bandeau hors ligne, manifest, icônes, balises Apple | ✅ Fait |
| 5 | Déploiement | Vercel statique, en-têtes de cache | ✅ Fait |
| 6 | Complétude des données | Combler les entrées « à vérifier » (voir ci-dessous) | ⏳ En cours |
| 7 | Contrôle continu | Vérification automatique du JSON et des liens en CI | ⏳ À faire |
| 8 | Extension | Nouveaux pays d'Amérique latine, même schéma | 💡 Idée |

## Données restant à compléter (phase 6)

| Pays | À compléter |
|---|---|
| Pérou | Agences consulaires de Cusco, Arequipa, Iquitos ; numéro d'astreinte |
| Bolivie | Agences consulaires de Sucre et Tarija |
| Colombie | Adresses des consuls honoraires ; Barranquilla, Bucaramanga, Pereira, Santa Marta ; second numéro d'urgence |
| Guatemala | Agences consulaires ; numéro d'astreinte |
| Mexique | 13 des 17 agences consulaires ; e-mail de Monterrey |

## Phase 7 — détail

- [ ] GitHub Action : `python3 -m json.tool` sur le JSON à chaque push.
- [ ] Vérification de schéma (champs obligatoires, `id` uniques).
- [ ] Contrôle des URL (sites officiels, sources) avec rapport des liens morts.

## Procédure de mise à jour

1. Vérifier l'information sur le site officiel du poste.
2. Modifier `data/consulats.json` et `meta.derniereMiseAJour`.
3. Valider le JSON.
4. Si `sw.js` ou `SHELL` changent : incrémenter `VERSION`.
5. Commit, push : Vercel redéploie.

## Risques

| Risque | Parade |
|---|---|
| Coordonnées obsolètes | Date de mise à jour visible, sources listées, avertissement |
| Cache iOS purgé | Conseil d'ouvrir l'app avant le départ |
| Ancien service worker figé | Incrément systématique de `VERSION` |
