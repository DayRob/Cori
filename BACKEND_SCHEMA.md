# BACKEND SCHEMA — Cori

> Cori n'a **pas de serveur applicatif ni de base de données** : le « backend » est un fichier JSON statique, `data/consulats.json`, servi par Vercel et mis en cache par le service worker. Ce document en décrit le schéma.

## 1. Racine

```jsonc
{
  "meta": Meta,
  "pays": Pays[]
}
```

## 2. `Meta`

| Champ | Type | Rôle |
|---|---|---|
| `derniereMiseAJour` | string (AAAA-MM-JJ) | Affichée en pied de page |
| `avertissement` | string | Texte du bloc Avertissement |
| `urgenceFrance` | objet | Centre de crise : `nom`, `lieu`, `telephone`, `description`, `aVerifier` |
| `franceConsulaire` | objet | Service France Consulaire : `nom`, `description`, `aVerifier` |

## 3. `Pays`

| Champ | Type | Rôle |
|---|---|---|
| `id` | string | Ancre de navigation, **unique** (`perou`, `bolivie`…) |
| `nom` | string | Nom affiché |
| `emoji` | string | Drapeau |
| `indicatif` | string | Indicatif téléphonique (`+51`) |
| `siteOfficiel` | string (URL) | Site de l'ambassade |
| `urgencesLocales` | `UrgenceLocale[]` | Numéros d'urgence du pays |
| `postes` | `Poste[]` | Représentations françaises |
| `sources` | string[] (URL) | Pages officielles consultées |

### `UrgenceLocale`
| Champ | Type | Rôle |
|---|---|---|
| `service` | string | Ex. « Police nationale (PNP) » |
| `numero` | string | Court ou international, espaces ignorés |
| `aVerifier` | boolean | Affiche le badge |
| `note` | string | Précision sous le libellé |

### `Poste`
| Champ | Type | Rôle |
|---|---|---|
| `nom` | string | Ex. « Ambassade de France au Pérou » |
| `type` | string | Ambassade, consulat, agence consulaire… |
| `ville` | string | |
| `adresse` | string | `"à vérifier"` si inconnue |
| `adresseCarte` | string \| null | Requête cartes ; `null` = pas de lien |
| `telephones` | `{ libelle, numero, aVerifier }[]` | Liste vide = rien affiché |
| `emails` | `{ libelle, adresse }[]` | |
| `horaires` | string | |
| `siteWeb` | string (URL) | |
| `notes` | string[] | Puces grises en bas de fiche |

## 4. Règles de données

- **Aucune donnée inventée.** Valeur inconnue : `"à vérifier"` (texte) ou `"aVerifier": true` (numéros, e-mails).
- Numéros écrits lisiblement : la normalisation pour `tel:` est automatique.
- Mettre à jour `meta.derniereMiseAJour` à chaque correction.
- Valider : `python3 -m json.tool data/consulats.json > /dev/null`.

## 5. Politique de cache

| Ressource | HTTP (Vercel) | Service worker |
|---|---|---|
| `data/consulats.json` | `max-age=0, must-revalidate` | Réseau d'abord, cache en secours |
| `sw.js` | `max-age=0, must-revalidate` | — |
| HTML (navigations) | défaut | Réseau d'abord, cache en secours |
| CSS, JS, icônes | défaut | Cache d'abord, rafraîchi en arrière-plan |
