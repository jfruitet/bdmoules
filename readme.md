# BdMoules
## Gestion des moules de l'ARBL
*Version 0.3* - JF - 2024

Cette application Web permet de recenser la listes des moules disponibles en prêt à l'ARBL.

Ces moules sont disponibles pour les membre du club et en prêt extérieur selon des modalités à définir par le bureau de l'association.
### Installation de l'application
 - Charger les sources depuis le GitHub [https://github.com/jfruitet/bdmoules] ;
 - Installer un serveur  HTTPD de type Apache (j'utilise Xampp sur PC sous Windows en local) qui doit être configuré pour supporter le module GD ;
 - Installer une base de données de type MySQL Lite et importer le fichier de sauvegarde ;
  *./bd/bdmoules.sql*.
 - Modifier les fichiers de configuration *./js/config.js*, *./php/include/config.php* et *./php/include/mysql.php* pour les adapter à votre configuration.
 
### Appels Ajax vers le serveur
Tous les appels Ajax GET sont de type Fetch.
Pour les appels Ajax de type POST cependant, bizarrement, j'ai des erreurs avec Firefox de type CROSS DOMAIN que je n'arrive pas à corriger.
J'ai dû me rabattre sur l'envoi de formulaires POST vers les scripts PHP.

### Modèle de données
La base de donnée est de type MySQL Lite.

Le modèle de données est simplissime. Voir les schémas dans la partie documentation.
Pour faciliter les modifications en cours de développement je n'ai pas déclaré de clés externes aux tables d'association. 
De coup il faut "gérer à la main" les références internes entre tables.

De toute façon vu le volume de données ridicule, toute optimisation est illusoire.

### Sources
Du côté code c'est du HTML et du Javascript "à la PHP", facile à lire et redondant, et de courts scripts PHP réalisant les connexions à la base de données. 
Si l'appli a un avenir je verrai à simplifier et optimiser le code.

### Feuilles de style CSS
Attention de ne pas modifier les feuilles de styles inconsidérément car la mise en page est décisive pour cette application.

A priori la version actuelle doit aussi fonctionner sur smartphone...

### Serveur SMTP
Les demandes de réservation sont communiquées par courriel au bureau de l'ARBL.
Pour le cas où le protocole SMTP sur le serveur d'exploitation ne fonctionnerait pas (Free.fr ne le permet pas) 
j'ai aussi développé l'envoi d'un mail adressé avec le lien <a href="mailto...>

Si le serveur d'hébergement autorise l'utilisation de la  fonction mail (et d'un serveur SMTP), configurer les paramètres ad hoc dans le fichier *./js/config.js* et dans le *php.ini* du serveur.

### Moules
La réservation de moules se fait depuis la page d'accueil en sélectionnant un modèle et ses moules associés.
Pour cela il faut s'identifier par son adresse mail et remplir le formulaire de réservation qui est adressé au bureau de l'association.


### Photos de modèles et de moules
Concernant les photos de moules et de modèles, j'ai fonctionné un peu à l'aveugle car les moules sont très mal identifiés à la Minais. Je verrai avec Ludovic comment corriger ça.

### Rôles 
L'administration est réservée à quelques personnes du club. Les fonctionnalités d'ajout de modèles, de moules et de photos associées sont implantées, ainsi que l'édition et la suppression.

On distingue dans la version définitive
- les visiteurs, qui peuvent seulement consulter la liste des modèles et des moules ;
- les lecteurs (membres du club) en mesure de faire des réservations ;
- les auteurs  (membres du club) autorisés à ajouter, éditer, réassigner des photos de modèles et de moules ;
- les administrateurs, qui gérent les connexions et les ajouts / suppressions de modèles, moules, photos et utilisateurs.

### Connexion
L'authentification des connexions utilise des identification de session et des cookies.

La table des utilisateurs *bdm_user* stocke les informations permettant la connexion.

Lors d'une première connexion un compte utilisateur est créé avec le courriel comme login et le rôle *lecteur*. Cette adresse courriel n'est pas modifiable en ligne. 
En cas d'erreur seul l'administrateur de la base de données peut intervenier sur la table *bdm_user*.

Par contre en passant par l'onglet "**Profil**" un utilisateur connecté peut modifier son profil (Nom Prénom, adresse, téléphone, club).

### Mots de passe
Les mots de passe enregistrés dans la table *bdm_user* sont cryptés. En cas de perte il n'est donc pas possible de les restituer.
Aussi j'ai implanté un mécanisme de lien  vers un script de changement de mot de passe adressé par courriel à l'adresse enregistrée sur la fiche utilisateur.

### Ce qui reste à faire
Intégrer le fichier des mails des adhérents de l'ARBL.

Permettre aux utilisateurs de supprimer leur compte. 

## License
MIT
**Free Software, Hell Yeah!**

Jean Fruitet - <**jean.fruitet@free.fr**> - France

