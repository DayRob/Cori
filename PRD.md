# PRD — Cori · Consulats de France en Amérique latine

> Product Requirements Document : le *quoi* et le *pourquoi*.

## 1. Résumé

Cori (*Centralisation d'informations importantes*) est un site statique, consultable depuis un téléphone **même sans réseau**, qui regroupe sur une seule page les coordonnées des représentations françaises et les numéros d'urgence de cinq pays : **Pérou, Bolivie, Colombie, Guatemala, Mexique**.

## 2. Problème

En voyage, quand un problème survient (vol de passeport, accident, arrestation, catastrophe), il faut trouver vite le bon numéro. Or :
- l'information est dispersée sur plusieurs sites d'ambassades et sur France Diplomatie ;
- la connexion est souvent absente ou coûteuse (roaming, zones rurales) ;
- une donnée fausse mais plausible est pire qu'une donnée manquante.

## 3. Utilisateurs

- **Voyageur français** dans l'un des cinq pays, sur iPhone ou Android, souvent stressé et pressé.
- **Mainteneur** qui met à jour les coordonnées sans toucher au code.

## 4. Objectifs

| Objectif | Mesure |
|---|---|
| Trouver un numéro en quelques secondes | ≤ 2 taps depuis l'ouverture pour lancer un appel |
| Fonctionner hors ligne | Toutes les fiches lisibles sans réseau après la première visite |
| Fiabilité | 0 donnée inventée ; toute donnée non confirmée est signalée « à vérifier » |
| Maintenance simple | Une correction = une modification de `data/consulats.json`, sans build |

## 5. Fonctionnalités

1. **Urgence depuis l'étranger** en tête de page : Centre de crise et de soutien du MEAE (24 h/24).
2. **Navigation par pays** (ancres) avec drapeau.
3. **Urgences locales** par pays : police, pompiers, secours médicaux.
4. **Fiches des postes** : ambassade, consulats, agences consulaires ; adresse, téléphones, e-mails, horaires, site web, notes.
5. **Actions directes** : `tel:` pour appeler, `mailto:` pour écrire, lien cartes pour l'itinéraire.
6. **Badge « à vérifier »** sur toute donnée non confirmée.
7. **Sources** officielles listées par pays.
8. **Mode hors ligne** avec bandeau signalant l'affichage depuis la copie locale.
9. **Installation** sur l'écran d'accueil (PWA, plein écran).

## 6. Hors périmètre

- Démarches consulaires en ligne, prise de rendez-vous.
- Autres pays (l'architecture le permet, mais non prévu à ce stade).
- Comptes utilisateurs, géolocalisation.

## 7. Exigences non fonctionnelles

- Aucune dépendance, aucun build, aucun traceur.
- Lisible en plein soleil, utilisable d'une main (zones tactiles ≥ 44 px).
- HTTPS obligatoire (service worker).
- Données à jour : date de dernière mise à jour affichée en pied de page.
