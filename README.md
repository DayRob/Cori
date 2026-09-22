# Consulats de France — Amérique latine

Site statique qui centralise, sur une seule page consultable depuis un téléphone,
les coordonnées des représentations françaises et les numéros d'urgence pour
cinq pays : **Pérou, Bolivie, Colombie, Guatemala, Mexique**.

- Chaque téléphone est un lien `tel:` — un tap lance l'appel.
- Chaque adresse ouvre l'application de cartes.
- Chaque e-mail est un lien `mailto:`.
- Le site s'ajoute à l'écran d'accueil d'un iPhone et s'ouvre en plein écran.

## ⚠️ Fiabilité des données

Les coordonnées ont été rassemblées depuis les sites officiels des postes
diplomatiques (`*.ambafrance.org`) et France Diplomatie. **Aucune donnée n'a été
inventée.** Ce qui n'a pas pu être confirmé de façon fiable porte la mention
`à vérifier` et s'affiche avec un badge orange, plutôt qu'une valeur plausible
mais fausse.

Restent à compléter, à la source, sur les pages officielles listées dans la
section « Sources » de chaque pays :

| Pays | À compléter |
|---|---|
| Pérou | agences consulaires de Cusco, Arequipa et Iquitos ; numéro d'astreinte |
| Bolivie | agences consulaires de Sucre et Tarija |
| Colombie | adresses postales des consuls honoraires ; Barranquilla, Bucaramanga, Pereira, Santa Marta ; second numéro d'urgence |
| Guatemala | agences consulaires ; numéro d'astreinte |
| Mexique | 13 des 17 agences consulaires ; e-mail de Monterrey |

Les coordonnées consulaires changent régulièrement : **vérifiez sur le site
officiel du poste avant de vous déplacer.**

## Où éditer les données

Tout le contenu vit dans **[`data/consulats.json`](data/consulats.json)**, séparé
du code. Aucun rebuild n'est nécessaire : modifiez le fichier, rechargez la page.

```jsonc
{
  "meta": {
    "derniereMiseAJour": "2026-09-22",   // affiché en bas de page
    "avertissement": "…",
    "urgenceFrance": { … },              // contact d'urgence français, tous pays
    "franceConsulaire": { … }
  },
  "pays": [
    {
      "id": "perou",                     // ancre de la navigation, doit être unique
      "nom": "Pérou",
      "emoji": "🇵🇪",
      "urgencesLocales": [
        {
          "service": "Police nationale (PNP)",
          "numero": "105",               // court ou international, les espaces sont ignorés
          "aVerifier": false,            // true → badge « à vérifier »
          "note": ""                     // précision affichée sous le libellé
        }
      ],
      "postes": [
        {
          "nom": "Ambassade de France au Pérou",
          "type": "Ambassade et section consulaire",
          "ville": "Lima",
          "adresse": "Av. Arequipa 3415, San Isidro, Lima 15046",
          "adresseCarte": "…",           // requête envoyée à Google Maps ; null = pas de lien
          "telephones": [{ "libelle": "Standard", "numero": "+51 1 215 84 00", "aVerifier": false }],
          "emails": [{ "libelle": "Contact", "adresse": "contact.lima-amba@diplomatie.gouv.fr" }],
          "horaires": "…",
          "siteWeb": "https://pe.ambafrance.org/",
          "notes": ["…"]                 // puces grises en bas de la fiche
        }
      ],
      "sources": ["https://…"]           // dépliant « Sources » en fin de section
    }
  ]
}
```

Conventions utiles :

- Pour une donnée inconnue, écrivez la chaîne `"à vérifier"` (adresse) ou mettez
  `"aVerifier": true` (téléphone, e-mail, numéro d'urgence). Une liste vide
  (`"telephones": []`) n'affiche simplement rien.
- Les numéros de téléphone sont normalisés automatiquement pour le lien `tel:`
  (seuls le `+` initial et les chiffres sont conservés) — écrivez-les de la
  façon la plus lisible.
- Pensez à mettre `meta.derniereMiseAJour` à jour après une correction.

Après édition, validez le JSON :

```sh
python3 -m json.tool data/consulats.json > /dev/null && echo "JSON valide"
```

## Lancer en local

Le site est purement statique, mais les données sont chargées via `fetch()` :
il faut donc un serveur HTTP (ouvrir `index.html` en `file://` ne fonctionne pas).

```sh
python3 -m http.server 8000
# puis http://localhost:8000
```

Ou, si vous avez Node :

```sh
npx serve .
```

## Déployer sur Vercel

Aucune configuration, aucune dépendance, aucune étape de build.

**Depuis l'interface Vercel** — importez le dépôt GitHub sur
[vercel.com/new](https://vercel.com/new). Laissez le framework sur
« Other », les commandes de build et d'installation vides, et le répertoire
de sortie à la racine. Chaque push sur la branche par défaut redéploie.

**Depuis le CLI :**

```sh
npm i -g vercel
vercel          # déploiement de prévisualisation
vercel --prod   # mise en production
```

Le fichier [`vercel.json`](vercel.json) ne fait qu'une chose : empêcher la mise
en cache de `data/consulats.json`, pour qu'une correction de coordonnées soit
visible immédiatement.

## Installer sur iPhone

Dans **Safari** (les autres navigateurs iOS ne le permettent pas) : bouton
Partager → **Sur l'écran d'accueil**. L'icône apparaît sur l'écran d'accueil et
le site s'ouvre sans la barre d'adresse.

## Structure

```
index.html              page unique
styles.css              mise en forme, mobile d'abord
app.js                  rendu des fiches depuis le JSON (DOM natif, 0 dépendance)
data/consulats.json     ← toutes les données éditables
manifest.webmanifest    métadonnées d'installation
icons/                  icônes PNG + SVG, dont apple-touch-icon
vercel.json             en-têtes de cache
```

## Pousser sur un nouveau dépôt GitHub

Créez un dépôt vide sur GitHub (sans README ni `.gitignore`), puis :

```sh
git remote add origin git@github.com:<votre-compte>/<votre-depot>.git
git push -u origin claude/consulats-france-static-site-tghmmk
```

Avec le CLI GitHub, la création et le push en une fois :

```sh
gh repo create <votre-depot> --private --source=. --remote=origin --push
```

Pour publier ce travail sur la branche par défaut :

```sh
git branch -M main
git push -u origin main
```
