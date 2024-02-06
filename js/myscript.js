// JavaScript Document

var fichieracharger='';

let tModele = []; // Tableau du modele sélectionné
let tMoules = []; // Tableau des moules associés à ce modèle

let tImages=[]; // Tableau des fichiers images
let tVignettes=[]; // Tableau des fichiers vignettes

// Réservation de moules
  
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
    let admin = '';
    let okadmin = false;     
    

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
    
    // Admin
    let sadmin = getCookie("sadmin");
    if (sadmin!="" && sadmin!=null) {
        // Verifier si c'est un admin autorisé
        //console.debug("Vérification des droits attachés à un utilisateur");
        okadmin=false;
        for (let i in admins){
            if (sadmin==admins[i]){// A remplacer par le MD5 ? Voir https://github.com/blueimp/JavaScript-MD5
                console.debug("Cookie sadmin valide");
                console.debug("Admin: "+sadmin);
                okadmin=true;
                admin=sadmin;
                break;
            }
        }                   
    }
    else{
        okadmin=false;     
    }
     
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


