/**
 * Rend les fiches pays à partir de data/consulats.json.
 * Aucune dépendance : DOM natif uniquement.
 */
(function () {
  'use strict';

  var A_VERIFIER = 'à vérifier';

  /** Numéro utilisable dans un lien tel: (garde le + initial et les chiffres). */
  function versTel(numero) {
    var brut = String(numero).trim();
    var plus = brut.charAt(0) === '+' ? '+' : '';
    var chiffres = brut.replace(/[^0-9]/g, '');
    return chiffres ? plus + chiffres : '';
  }

  /** Vrai si la valeur est un placeholder « à vérifier » plutôt qu'une donnée. */
  function estPlaceholder(valeur) {
    return !valeur || String(valeur).trim().toLowerCase() === A_VERIFIER;
  }

  function el(balise, classe, texte) {
    var noeud = document.createElement(balise);
    if (classe) noeud.className = classe;
    if (texte != null) noeud.textContent = texte;
    return noeud;
  }

  function badgeAVerifier() {
    return el('span', 'badge', A_VERIFIER);
  }

  /**
   * Un champ de fiche : libellé + valeur, cliquable si href est fourni.
   */
  function champ(libelle, valeur, href, aVerifier) {
    var noeud = href ? el('a', 'champ') : el('span', 'champ champ-statique');
    if (href) {
      noeud.href = href;
      if (href.indexOf('http') === 0) {
        noeud.target = '_blank';
        noeud.rel = 'noopener';
      }
    }
    var lab = el('span', 'champ-libelle', libelle);
    if (aVerifier) lab.appendChild(badgeAVerifier());
    noeud.appendChild(lab);
    noeud.appendChild(el('span', 'champ-valeur', valeur));
    return noeud;
  }

  /** Bloc « Urgence depuis l'étranger » (contacts français, tous pays). */
  function rendreUrgenceFrance(meta) {
    var cible = document.getElementById('urgence-france-contenu');
    var u = meta.urgenceFrance;
    if (u) {
      var fiche = el('div', 'poste');
      fiche.appendChild(el('h4', null, u.nom));
      fiche.appendChild(el('p', 'poste-type', u.lieu || ''));
      var tel = versTel(u.telephone);
      fiche.appendChild(champ('Téléphone', u.telephone, tel ? 'tel:' + tel : null, u.aVerifier));
      if (u.description) {
        var notes = el('ul', 'poste-notes');
        notes.appendChild(el('li', null, u.description));
        fiche.appendChild(notes);
      }
      cible.appendChild(fiche);
    }
    var fc = meta.franceConsulaire;
    if (fc) {
      var bloc = el('div', 'poste');
      bloc.appendChild(el('h4', null, fc.nom));
      var n2 = el('ul', 'poste-notes');
      n2.appendChild(el('li', null, fc.description));
      bloc.appendChild(n2);
      cible.appendChild(bloc);
    }
  }

  /** Liste des numéros d'urgence locaux d'un pays. */
  function rendreUrgences(urgences) {
    var liste = el('ul', 'urgences');
    urgences.forEach(function (u) {
      var ligne = document.createElement('li');
      var tel = versTel(u.numero);
      var contenu = tel ? el('a', null) : el('span', 'sans-lien');
      if (tel) contenu.href = 'tel:' + tel;

      var gauche = document.createElement('span');
      var service = el('span', 'service', u.service);
      if (u.aVerifier) service.appendChild(badgeAVerifier());
      gauche.appendChild(service);
      if (u.note) gauche.appendChild(el('span', 'note', u.note));

      contenu.appendChild(gauche);
      contenu.appendChild(el('span', 'numero', u.numero));
      ligne.appendChild(contenu);
      liste.appendChild(ligne);
    });
    return liste;
  }

  /** Fiche d'un poste : ambassade, consulat général ou agence consulaire. */
  function rendrePoste(poste) {
    var fiche = el('article', 'poste');
    fiche.appendChild(el('h4', null, poste.nom));
    fiche.appendChild(el('p', 'poste-type', [poste.type, poste.ville].filter(Boolean).join(' · ')));

    // Adresse → application de cartes
    if (poste.adresse) {
      if (estPlaceholder(poste.adresse)) {
        fiche.appendChild(champ('Adresse', A_VERIFIER, null, true));
      } else {
        var requete = encodeURIComponent(poste.adresseCarte || poste.adresse);
        fiche.appendChild(champ('Adresse', poste.adresse, 'https://maps.google.com/?q=' + requete, false));
      }
    }

    (poste.telephones || []).forEach(function (t) {
      var tel = versTel(t.numero);
      fiche.appendChild(champ(t.libelle, t.numero, tel ? 'tel:' + tel : null, t.aVerifier));
    });

    (poste.emails || []).forEach(function (e) {
      fiche.appendChild(champ(e.libelle, e.adresse, 'mailto:' + e.adresse, e.aVerifier));
    });

    if (poste.horaires) {
      fiche.appendChild(champ('Horaires', poste.horaires, null, false));
    }

    if (poste.siteWeb) {
      fiche.appendChild(champ('Site officiel', poste.siteWeb, poste.siteWeb, false));
    }

    if (poste.notes && poste.notes.length) {
      var notes = el('ul', 'poste-notes');
      poste.notes.forEach(function (n) { notes.appendChild(el('li', null, n)); });
      fiche.appendChild(notes);
    }

    return fiche;
  }

  function rendrePays(pays) {
    var section = el('section', 'pays');
    section.id = pays.id;

    var titre = el('h2', 'pays-titre');
    if (pays.emoji) {
      var emoji = el('span', 'emoji', pays.emoji);
      emoji.setAttribute('aria-hidden', 'true');
      titre.appendChild(emoji);
    }
    titre.appendChild(document.createTextNode(pays.nom));
    section.appendChild(titre);

    if (pays.urgencesLocales && pays.urgencesLocales.length) {
      section.appendChild(el('h3', 'sous-titre', "Numéros d'urgence locaux"));
      section.appendChild(rendreUrgences(pays.urgencesLocales));
    }

    if (pays.postes && pays.postes.length) {
      section.appendChild(el('h3', 'sous-titre', 'Représentations françaises'));
      pays.postes.forEach(function (p) { section.appendChild(rendrePoste(p)); });
    }

    if (pays.sources && pays.sources.length) {
      var details = el('details', 'sources-bloc');
      details.appendChild(el('summary', null, 'Sources'));
      var liste = el('ul', 'sources');
      pays.sources.forEach(function (url) {
        var li = document.createElement('li');
        var a = el('a', null, url);
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener';
        li.appendChild(a);
        liste.appendChild(li);
      });
      details.appendChild(liste);
      section.appendChild(details);
    }

    return section;
  }

  function rendreNav(listePays) {
    var nav = document.getElementById('paysnav');
    listePays.forEach(function (pays) {
      var a = el('a', null, (pays.emoji ? pays.emoji + ' ' : '') + pays.nom);
      a.href = '#' + pays.id;
      nav.appendChild(a);
    });
  }

  function rendre(donnees) {
    rendreUrgenceFrance(donnees.meta || {});
    rendreNav(donnees.pays);

    var cible = document.getElementById('pays-contenu');
    donnees.pays.forEach(function (pays) { cible.appendChild(rendrePays(pays)); });

    var meta = donnees.meta || {};
    document.getElementById('avertissement-texte').textContent = meta.avertissement || '';
    document.getElementById('maj-date').textContent = meta.derniereMiseAJour || '—';
  }

  function erreur(message) {
    var p = el('p', 'erreur', message);
    document.getElementById('main').prepend(p);
  }

  /** Bandeau « hors ligne » : indique que les données affichées viennent du cache. */
  function suivreConnexion() {
    var bandeau = document.getElementById('hors-ligne');
    function majEtat() { bandeau.hidden = navigator.onLine !== false; }
    window.addEventListener('online', majEtat);
    window.addEventListener('offline', majEtat);
    majEtat();
  }

  /** Enregistre le service worker qui rend le site consultable sans réseau. */
  function activerHorsLigne() {
    if (!('serviceWorker' in navigator)) return;
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () {
        // Hors ligne indisponible (file://, navigation privée) : le site
        // continue de fonctionner normalement avec du réseau.
      });
    });
  }

  suivreConnexion();
  activerHorsLigne();

  fetch('data/consulats.json', { cache: 'no-cache' })
    .then(function (r) {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(rendre)
    .catch(function (e) {
      erreur('Impossible de charger les données (' + e.message + '). Les coordonnées restent lisibles dans data/consulats.json.');
    });
})();
