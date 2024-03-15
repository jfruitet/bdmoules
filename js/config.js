// JavaScript Document

//let url_site = 'https://localhost/bdmoules';
let url_site = '.';
let url_serveur = url_site+'/php/';     // Les scripts PHP du serveur
let url_data = url_site+'/data/';   // les fichiers de sortie
let url_images = url_site+'/images/';   // les fichiers de photos de modèles et de moules
let url_vignettes = url_site+'/images/vignettes/';   // les vignettes de modèles et de moules

let mode_debug = true; // Le mod debug est activé

// Alternative pour l'envoi de formulaires par Ajax vu les bugs POST avec Firefox
// la valeur &appel=pageadmin est incluse dans tous les formulaires POST faisant appel à des scripts PHP comme ./php/addmoulebypost.php 
let pageadmin='../administrer.html';
let pageindex='../index.html';
let pageuser='../users.html';

// let courriel_reservation='bureau-arbl@laposte.net'; // Version d'exploitation
let courriel_reservation='jean.fruitet@laposte.net';  // Version de test
let courriel_webmaster= 'jean.fruitet@free.fr';

