// JavaScript Document

var fichieracharger='';
let tModeles = []; // Tableau du contenu des modeles chargés
let tModele = []; // Tableau du contenu du modele sélectionné
let tMoules = []; // Tableau des moules associés à ce modèle
let tMoule =[]; // Tableau des valeurs associés à un moule

let tImages=[]; // Tableau des fichiers images
let tVignettes=[]; // Tableau des fichiers vignettes

// Réservation de moules
    var idmouleglobal=0;
    var idmodeleglobal=0;
    var modeledescription='';
    var idmoule=0;
    var tidmoules=[];   // Selection de ID de moules
    var tdescription=[]; // infos sur les moules attachées à un courriel
    
// User mail
    // Objets DOM
    var nom = null;               
    var courriel = null;    
    var phone = null;   
    var address = null;  
    var comment = null;     
    // String
    var Nom = '';               
    var Courriel = '';    
    var Telephone = '';   
    var Adresse = '';  
    var Commentaire = '';
          
// Admin
    let adminpage = false; // pour distinguer la page admin.html de la page index.html
    let admin = '';
    let adminpassword = '';
    let okadmin = false;     

// User    
    let iduser=0;
    let nomuser='';
    let courrieluser='';
    let roleuser='';
    
    /*  $appel='';  // Page appelante
$userid=0;
$usernom='';
$userlogin='';
$statut=0;
$pass='';
$telephone='';
$club='';
*/
    var usernom = null;               
    var userlogin = null;    
    var userphone = null;   
    var userpass = null;  
    var userstatut = null;
    var userclub = null;     
    // String
    var Editeur = '';   // NOM + Prénom               
    var Login = '';    // Courriel
    var Pass = '';  // crypté MD5 dans la base
    var Contact = '';   // Telephone
    var Club = '';      // Club + ville
    var Statut = 0;     // 0:visiteur, 1:admin, 2:auteur, 3:lecteur
     
    var iduserglobal=0;   // l'utilisateur courant  

/************************
 * Cookies
 * **********************/
// ---------------------------------- 
function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  let expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; SameSite=Strict; " + expires + ";path=/";
}

// supprime un cookie
// ---------------------------------
function dellCookie(cname) {
    document.cookie = cname + "=; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
}

// --------------------------------- 
// retourne la valeur du cookie spécifié
function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

// verifie les cookies utiles
// -------------------------------
function checkCookies() {
    let sidmodele = getCookie("sidmodele");
    if (sidmodele!="" && sidmodele!=null) {
        idmodeleglobal=parseInt(sidmodele);    
        if (!isNaN(idmodeleglobal) && (idmodeleglobal<=0)){
            idmodeleglobal=1;
        }    
    }
    
    // Compte utilisateur permettant l'accès à la gestion des données
    // Admin
    let sadmin = getCookie("sadmin");
    let sadminpass = getCookie("sadminpass");
    okadmin=false;
    if ((sadmin!=="" && sadmin!==null) && (sadminpass!=="" && sadminpass!==null)) {
        // Verifier si c'est un admin autorisé
        // console.debug("Vérification des droits attachés à un utilisateur");
        okadmin=false;
        if (verifLogin(sadmin, sadminpass) === 1){ // OK
            okadmin=true;
            admin=sadmin;
            adminpassword=sadminpass;
        }
    }

    // Utilisateur pour lequel on veut créer / modifier le compte d'accès
    let siduser = getCookie("siduser");
    if (siduser!=="" && siduser!==null) {
        if (!isNaN(iduser=parseInt(siduser,10))){
            console.debug("Cookie siduser valide");
            console.debug("iduser: "+iduser);
            iduserglobal=parseInt(siduser);
        }                              
    } 
    
    
    // Données des personnes voulant réserver un moule
    // Ces données ne sont pas stockées dans la base de données
    // User
    let snom = getCookie("snom");
    if (snom!="" && snom!=null) {
        Nom=snom;
    }
    let sadresse = getCookie("sadresse");
    if (sadresse!="" && sadresse!=null) {
        Adresse=sadresse;
    }
    let scourriel = getCookie("scourriel");
    if (scourriel!="" && scourriel!=null) {
        Courriel=scourriel;
    }
    let stelephone = getCookie("stelephone");
    if (stelephone!="" && stelephone!=null) {
        Telephone=stelephone;
    }
    let scommentaire = getCookie("scommentaire");
    if (scommentaire!="" && scommentaire!=null) {
        Commentaire=scommentaire;
    }
}
  
// positionne les cookies utiles
// ---------------------------------
function setCookies(){     
    if (idmodele>0) {
        setCookie("sidmodele", idmodeleglobal, 30); // 30 jours
    }   
    // User
    if (Commentaire.length>0) {
        setCookie("scommentaire", Commentaire, 30); // 30 jours
    }   
    if (Telephone.length>0) {
        setCookie("stelephone", Telephone, 30); // 30 jours
    }                   
    if (Courriel.length>0) {
        setCookie("scourriel", Courriel, 30); // 30 jours
    }   
    if (Adresse.length>0) {
        setCookie("sadresse", Adresse, 30); // 30 jours
    }     
    if (Nom.length>0) {
        setCookie("snom", Nom, 30); // 30 jours
    } 
} 

/********************************************
 * 
 * INITIALISATION DES APPELS AJAX
 * 
 * 
 * *****************************************/


// Requête par GET
// ---------------------------------
let myInitGet = {
    method: "GET",
    // headers: {"Content-Type": "application/json;charset=UTF-8"},
    headers: {"Content-Type": "application/json;charset=UTF-8",  "Access-Control-Allow-Origin" : "*"},
    referrer: "about:client", //ou "" (pas de réferant) ou une url de l'origine
    referrerPolicy: "no-referrer-when-downgrade", //ou no-referrer, origin, same-origin...
    //mode: "cors", //ou same-origin, no-cors
    mode: "same-origin", //ou same-origin, no-cors
    credentials: "include", //same-origin, ou omit, ou include
    cache: "default", //ou no-store, reload, no-cache, force-cache, ou only-if-cached
    redirect: "follow", //ou manual ou error
    integrity: "", //ou un hash comme "sha256-abcdef1234567890"
    keepalive: false, //ou true pour que la requête survive à la page
    signal: undefined //ou AbortController pour annuler la requête            
};
    

// Envois de formulaires par POST
// Pour des raisons de sécurité qui m'échappent Firefox ne semble pas accepter certains envois par POST
// et retourne une erreur réseau assez cryptique
// Alors que Google Chrome les accepte
// Pour contourner cette difficulté je n'utilise plus d'appel AJAX POST 
// Mes formulaires basiques POST fournissent une page de redirection aux scripts PHP gérant des appels POST
// Voir le script ./php/adddmoulebypost.php

// ---------------------------------
let myInitPost = {
    method: 'POST',
    headers: {'Content-Type': 'application/json;charset=UTF-8',  'Access-Control-Allow-Origin' : '*'},
    body:"",
    referrer: "about:client", //ou "" (pas de réferanr) ou une url de l'origine
    referrerPolicy: "no-referrer-when-downgrade", //ou no-referrer, origin, same-origin...
    mode: "cors", //ou same-origin, no-cors
    credentials: "include", //ou same-origin ou omit, include
    cache: "default", //ou no-store, reload, no-cache, force-cache, ou only-if-cached
    redirect: "follow", //ou manual ou error
    integrity: "", //ou un hash comme "sha256-abcdef1234567890"
    keepalive: false, //ou true pour que la requête survive à la page
    signal: undefined //ou AbortController pour annuler la requête            
};

// ----------------------- 
function ajax_post(url, mystrjson){    
    if ((url !== undefined) && (url.length>0) && (mystrjson !== undefined) && (mystrjson.length>0)){        
        // POST avec fetch()
        // myInitPost.body: JSON.stringify(myjson), // turn the JS object literal into a JSON string
        myInitPost.body= mystrjson; // mystrjson est déjà une chaîne
        fetch(url, myInitPost)
        .then(response => response.json())  // Le retour est aussi une chaîne
        .then(response => {
                console.debug(response);
                if (response.ok==1){    // ça s'est ma cuisine interne                    
                    document.getElementById("consigne").innerHTML="Transfert vers le serveur <span class=\"surligne\"><i>"+url_serveur+"</i></span> effectué. ";
                }
            })
        .catch(error => console.debug("Erreur : "+error));
    }
}
    

