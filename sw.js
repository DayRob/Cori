/**
 * Service worker : rend les coordonnées consultables sans réseau.
 *
 * Stratégie :
 *  - data/consulats.json et les navigations → réseau d'abord, copie en cache
 *    en secours. Une correction de coordonnées est donc visible immédiatement
 *    quand il y a du réseau, et la dernière version connue reste lisible sans.
 *  - le reste (CSS, JS, icônes) → cache d'abord, rafraîchi en arrière-plan.
 *
 * Incrémentez VERSION après toute modification de ce fichier ou de la liste
 * SHELL : l'ancien cache est alors purgé à l'activation.
 */
'use strict';

var VERSION = 'consulats-v1';

var SHELL = [
  './',
  'index.html',
  'styles.css',
  'app.js',
  'data/consulats.json',
  'manifest.webmanifest',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-512-maskable.png',
  'icons/apple-touch-icon.png'
];

/** Met la réponse en cache sans bloquer la réponse rendue à la page. */
function mettreEnCache(requete, reponse) {
  if (!reponse || !reponse.ok) return;
  var copie = reponse.clone();
  caches.open(VERSION).then(function (cache) {
    cache.put(requete, copie);
  }).catch(function () { /* quota plein : on sert quand même la page */ });
}

self.addEventListener('install', function (evt) {
  evt.waitUntil(
    caches.open(VERSION).then(function (cache) {
      // Ajout fichier par fichier : un seul échec ne doit pas priver
      // l'utilisateur de tout le mode hors ligne.
      return Promise.all(SHELL.map(function (url) {
        return cache.add(url).catch(function () {});
      }));
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener('activate', function (evt) {
  evt.waitUntil(
    caches.keys().then(function (noms) {
      return Promise.all(noms.map(function (nom) {
        return nom === VERSION ? null : caches.delete(nom);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function (evt) {
  var requete = evt.request;
  if (requete.method !== 'GET') return;

  var url;
  try {
    url = new URL(requete.url);
  } catch (e) {
    return;
  }
  if (url.origin !== self.location.origin) return;

  var estDonnees = url.pathname.indexOf('data/consulats.json') !== -1;
  var estNavigation = requete.mode === 'navigate';

  if (estDonnees || estNavigation) {
    evt.respondWith(
      fetch(requete).then(function (reponse) {
        mettreEnCache(requete, reponse);
        return reponse;
      }).catch(function () {
        return caches.match(requete, { ignoreSearch: true }).then(function (cache) {
          if (cache) return cache;
          return caches.match(estDonnees ? 'data/consulats.json' : 'index.html');
        });
      })
    );
    return;
  }

  evt.respondWith(
    caches.match(requete).then(function (cache) {
      var reseau = fetch(requete).then(function (reponse) {
        mettreEnCache(requete, reponse);
        return reponse;
      }).catch(function () {
        return cache;
      });
      return cache || reseau;
    })
  );
});
