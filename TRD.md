# TRD — Cori

> Technical Requirements Document.

## 1. Stack

| Élément | Choix | Raison |
|---|---|---|
| Page | HTML5 unique (`index.html`) | Chargement immédiat, rien à compiler |
| Style | CSS natif (`styles.css`), variables, mobile-first | Aucune dépendance |
| Logique | JavaScript natif (`app.js`, IIFE, DOM natif) | 0 dépendance, compatible anciens navigateurs mobiles |
| Données | `data/consulats.json` | Séparées du code, éditables sans rebuild |
| Hors ligne | Service worker (`sw.js`) + Cache API | Consultation sans réseau |
| Installation | `manifest.webmanifest` + balises Apple | PWA plein écran sur iOS et Android |
| Hébergement | Vercel, site statique (framework « Other », pas de build) | HTTPS automatique, déploiement à chaque push |

## 2. Architecture

```
index.html ──► app.js ──fetch──► data/consulats.json
                 │                     ▲
                 │ rendu DOM            │ réseau d'abord, cache en secours
                 ▼                     │
        fiches pays / postes      sw.js (Cache API, VERSION)
                                       │ cache d'abord + rafraîchissement
                                       ▼
                         CSS, JS, icônes, manifest
```

## 3. Rendu (`app.js`)

- `fetch('data/consulats.json')` puis construction du DOM : `rendreUrgenceFrance`, `rendreNav`, `rendrePays`, `rendrePoste`, `rendreUrgences`.
- `versTel()` normalise les numéros pour `tel:` (garde le `+` initial et les chiffres).
- `estPlaceholder()` détecte « à vérifier » ; `badgeAVerifier()` affiche le badge.
- `suivreConnexion()` affiche le bandeau hors ligne selon `navigator.onLine`.
- `activerHorsLigne()` enregistre le service worker au chargement.
- Message d'erreur explicite si les données ne se chargent pas ; `<noscript>` renvoie vers le JSON brut.

## 4. Service worker (`sw.js`)

- `SHELL` : liste des fichiers mis en cache à l'installation.
- **Réseau d'abord** pour `data/consulats.json` et les navigations (correction visible dès qu'il y a du réseau).
- **Cache d'abord** pour CSS, JS, icônes, avec rafraîchissement en arrière-plan.
- `VERSION` (`consulats-v1`…) : à incrémenter à chaque modification de `sw.js` ou de `SHELL` ; l'ancien cache est purgé à l'activation.

## 5. Cache HTTP (`vercel.json`)

`Cache-Control: public, max-age=0, must-revalidate` sur `sw.js` et `data/consulats.json`, pour qu'une mise à jour soit prise en compte immédiatement.

## 6. Contraintes et limites

- Service worker uniquement en HTTPS ou `localhost`.
- `fetch()` impose un serveur HTTP en local (`python3 -m http.server 8000` ou `npx serve .`).
- iOS purge le cache d'une PWA non ouverte pendant quelques semaines : ouvrir l'app avant le départ.
- Installation iOS uniquement depuis Safari.

## 7. Qualité

- Validation du JSON avant chaque commit : `python3 -m json.tool data/consulats.json > /dev/null`.
- Vérification manuelle : liens `tel:` / `mailto:` / cartes, mode avion, installation sur iPhone.
