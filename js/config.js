// JavaScript Document

//let url_site = 'https://localhost/bdmoules';
let url_site = '.';
let url_serveur = url_site+'/php/';     // Les scripts PHP du serveur
let url_data = url_site+'/data/';   // les fichiers de sortie
let url_images = url_site+'/images/';   // les fichiers de photos de modèles et de moules
let url_vignettes = url_site+'/images/vignettes/';   // les vignettes de modèles et de moules

let mode_debug = true; // Le mod debug est activé

// Logins à remplacer par md5 
let admins = ["jean.fruitet@gmail.com", "domi.d@arbl.fr", "bureau.arbl@laposte.net"];

// Pass 1234 5678 9012
let adminspass = ["1234","5678","9012"];

// Fair un calcul de Md5 en javascript n'est pas judicieux car trop facile à intercepter. 
// Revoir l'implantation en PHP + gestion de session
let adminspassmd5 = ["81dc9bdb52d04dc20036dbd8313ed055","674f3c2c1a8a6f90461e8a66fb5550ba","c5c53759e4dd1bfe8b3dcfec37d0ea72"];

// Alternative pour l'envoi de formulaires par Ajax vu les bugs POST avec Firefox
// la valeur &appel=pageadmin est incluse dans tous les formulaires POST faisant appel à des scripts PHP comme ./php/addmoulebypost.php 
let pageadmin='../administrer.html';
let pageindex='../index.html';
let pageuser='../users.html';

// let courriel_reservation='bureau-arbl@laposte.net'; // Version d'exploitation
let courriel_reservation='jean.fruitet@laposte.net';  // Version de test
let courriel_webmaster= 'jean.fruitet@free.fr';

