# APP FLOW — Cori

> Parcours utilisateur sur la page unique.

## 1. Structure de la page

```
┌ En-tête : « Consulats de France » · Pérou · Bolivie · Colombie · Guatemala · Mexique
├ Navigation pays (ancres, drapeaux)
├ [Bandeau hors ligne — visible seulement sans réseau]
├ Urgence depuis l'étranger (Centre de crise MEAE, 24 h/24)
├ Pour chaque pays :
│   ├ Urgences locales (police, pompiers, secours)
│   ├ Fiches des postes (ambassade, consulats, agences)
│   └ Sources (dépliant)
└ Avertissement + date de dernière mise à jour
```

## 2. Première visite (avec réseau)

```
Ouverture du lien ──► chargement de la page ──► fetch des données ──► rendu des fiches
                                └─► enregistrement du service worker ──► mise en cache du site et des données
Safari : Partager ► « Sur l'écran d'accueil » ──► icône installée
```

## 3. Usage en situation d'urgence

```
Tap sur l'icône ──► page en plein écran
   ├─ urgence grave ──► tap sur le numéro du Centre de crise ──► appel
   └─ choix du pays dans la navigation ──► saut à la section
         ├─ urgence locale ──► tap sur le numéro ──► appel
         └─ fiche du poste le plus proche
               ├─ tap téléphone ──► appel (tel:)
               ├─ tap e-mail ──► client mail (mailto:)
               └─ tap adresse ──► application de cartes
```

## 4. Sans réseau

```
Ouverture ──► service worker sert la page et la dernière copie des données
          ──► bandeau « Hors ligne — coordonnées affichées depuis la copie enregistrée »
Retour du réseau ──► bandeau masqué ; prochaine ouverture : données rafraîchies
```

## 5. Cas d'erreur

| Situation | Comportement |
|---|---|
| Données introuvables (1re visite sans réseau) | Message d'erreur explicite |
| JavaScript désactivé | `<noscript>` avec lien vers le JSON brut |
| Donnée non confirmée | Badge orange « à vérifier » |
| Adresse sans requête carte | Adresse affichée sans lien |

## 6. Flux de maintenance

```
Correction trouvée sur un site officiel
   ──► édition de data/consulats.json (+ meta.derniereMiseAJour)
   ──► validation JSON ──► commit ──► push ──► redéploiement Vercel
   ──► visible immédiatement (pas de cache HTTP sur le JSON)
```
