# DESIGN BRIEF — Cori

> Intentions visuelles et règles d'interface.

## 1. Personnalité

**Officiel, calme, fiable.** Le site doit inspirer confiance à quelqu'un en difficulté : couleurs institutionnelles françaises, aucune fioriture, information hiérarchisée.

## 2. Principes

1. **L'urgence d'abord** : le numéro du Centre de crise est le premier contenu visible.
2. **Un tap = une action** : chaque numéro, e-mail et adresse est cliquable.
3. **Utilisable d'une main**, sous le soleil, en situation de stress : zones tactiles ≥ 44 px, contrastes forts.
4. **Honnêteté** : ce qui n'est pas confirmé est visiblement marqué.
5. **Mobile-first**, plein écran une fois installé (barre d'état translucide, *safe areas*).

## 3. Couleurs

| Variable | Valeur | Usage |
|---|---|---|
| `--bleu` | `#0b2a5b` | En-tête, titres, couleur de thème |
| `--bleu-clair` | `#1e4f9c` | Liens, actions |
| `--rouge` | `#c8102e` | Bloc urgence |
| `--fond` | `#f4f5f7` | Fond de page |
| `--carte` | `#ffffff` | Fiches |
| `--texte` | `#16202e` | Texte principal |
| `--texte-doux` | `#5a6675` | Texte secondaire |
| `--bord` | `#dfe3e8` | Bordures |
| `--alerte-fond` / `--alerte-bord` / `--alerte-texte` | `#fff8e1` / `#e8c86a` / `#6b4e00` | Badge « à vérifier », bandeau hors ligne |

Rayon des cartes : `12px` (`--rayon`). Taille tactile minimale : `44px` (`--tap`).

## 4. Composants

- **Barre supérieure** bleue : titre et liste des pays.
- **Navigation pays** : pastilles avec drapeau, défilement horizontal.
- **Bloc urgence** rouge, mis en évidence.
- **Fiche poste** : nom, type, ville, puis lignes « libellé / valeur cliquable », notes en puces grises.
- **Badge « à vérifier »** orange, à côté de la valeur concernée.
- **Bandeau hors ligne** jaune pâle, en haut de page.
- **Dépliant Sources** en fin de section pays.

## 5. Icônes et installation

- Icône SVG + PNG 192/512, version *maskable*, `apple-touch-icon`.
- Nom court : « Consulats FR » ; orientation portrait ; couleur de thème `#0b2a5b`.

## 6. Accessibilité

- `lang="fr"`, titres hiérarchisés, sections reliées à leur titre (`aria-labelledby`).
- Navigation étiquetée (« Choisir un pays »), bandeau hors ligne en `role="status"`.
- Information jamais transmise par la seule couleur (le badge contient du texte).
