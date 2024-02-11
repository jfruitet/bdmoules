// JavaScript Document
// ajax2.js inclus dans administrer.html
// Gestion des accès et modification de la BD

let mdescription = '';   
let mlieu = '';
let matiere = '';
let metat = '';
let mlongueur = '';
let mpoids = '';
let mcommentaire = '';
let refmodele = 0;

/** 
 * 
 *  Authentification des admin
 *  A remplacer par un appel à la BD et une session
 * 
 */

// --------------------------------
function oklogin(){
    // A améliorer car ceci n'est absolument pas sûr.
    if ((Courriel !== undefined) && (Courriel !== null) && (Courriel.length>0)){    // Cookie User
        if (getUserAutorisation()){
            okadmin=true;
            admin=Courriel;
            setCookie("sadmin", admin, 1); // 1 jour
            document.getElementById("login").innerHTML = '<span class="surligne">'+admin+'</span>';
            document.getElementById("msg").innerHTML = 'Complétez chaque enregistrement par une photo et un numéro d\'inventaire unique.';
            document.getElementById("loginform").innerHTML = '';    
            getModelesMoulesAdmin();
            if ((idmodeleglobal!==undefined) && (idmodeleglobal!==null) && (idmodeleglobal>0)){
                // Affiche le moule sélectionné 
                getModeleMoulesImages(idmodeleglobal); 
                editerThatModeleMoules(idmodeleglobal);
            }             
            return true;
        }   
    }        
    // On lui demande de se loger 
    if (saisieLogin()){
        okadmin=true;
        admin=Courriel;
        setCookie("sadmin", admin, 1); // 1 jour
        document.getElementById("login").innerHTML = '<span class="surligne">'+admin+'</span>';
        return true;
    }
    return false;
}


// --------------------------------
function formlogout(){
    console.debug("Logout");
    let str='';
    str+='<p>&nbsp; <button id="btnlogout" onclick="return logout();">Déconnexion</button></p>';
    document.getElementById("logout").innerHTML = str;
}
 
// --------------------------------
function logout(){
            console.debug("Logout confirmé");
            dellCookie("sadmin");
            if (admin==Courriel) {dellCookie("scourriel")}; 
            admin='';
            okadmin=false;            
            document.getElementById("logout").innerHTML = '&nbsp;';
            document.getElementById("login").innerHTML = '<span class="surligne">Accès réservé.</span>';
            document.getElementById("msg").innerHTML = 'Pour administrer la base de données identifiez-vous avec votre compte administrateur.';
            saisieLogin();
    return true;   
}

// --------------------------------
function getUserAutorisation(){
// Le courriel fourni par le cookie est-il reconnu ?
    console.debug("Login : vérification Courriel: "+Courriel);
    admin=null;
    if ((Courriel !== undefined) && (Courriel !== null) && (Courriel.length>0)){
        console.debug("Vérification des droits attachés à un utilisateur");
        for (let i in admins){
            if (Courriel==admins[i]){// A remplacer par le MD5 ? Voir https://github.com/blueimp/JavaScript-MD5
                console.debug("Utilisateur dans la liste des Admins");
                return true;
            }
        }            
    }     
    return false;  
} 
 
// --------------------------------
function saisieLogin(){
// Saisie d'une adresse mail 

    console.debug("Saisie du Login");
    
    admin=''; // toute saisie annule les autorisations antérieures
    let str='';
    str+='<p>Saisissez votre identifiant d\'administrateur. &nbsp;';
    str+='<input type="text" id="adminmail" name="adminmail" value="" />';
    str+='<input type="hidden" id="idmodele" name="idmodele" value="'+idmodeleglobal+'">';
    str+=' &nbsp; <button id="btnlogin">Valider</button></p>';

    document.getElementById("loginform").innerHTML = str;
 
    // Collecte des ID des moules sélectionnés
    const btnlogin = document.querySelector('#btnlogin');
        
    btnlogin.addEventListener('click', (event) => {
        let adminmail = document.querySelector('input[name="adminmail"]');
        if ((adminmail !== undefined) && (adminmail !== null) && (adminmail.value !== '')){
            for (let i in admins){
                if (adminmail.value==admins[i]){
                    okadmin=true;
                    admin=adminmail.value;
                    //console.debug("Admin reconnu: "+admin);
                    setCookie("sadmin", admin, 1); // 1 jour 
                    document.getElementById("login").innerHTML = '<span class="surligne">'+admin+'</span>';
                    document.getElementById("msg").innerHTML = 'Complétez chaque enregistrement par une photo et un numéro d\'inventaire unique.';
                    document.getElementById("loginform").innerHTML = '';    
                    getModelesMoulesAdmin();
                    if ((idmodeleglobal!==undefined) && (idmodeleglobal!==null) && (idmodeleglobal>0)){
                        // Affiche le moule sélectionné 
                        getModeleMoulesImages(idmodeleglobal); 
                        editerThatModeleMoules(idmodeleglobal);
                    }                                    
                    return true;
                }
            }            
        } 
        else{
            return false;
        }
    });    
      
}

/**************************************** 
 *                                      *
 * Administration de la BD              *
 *                                      *
 * Ajout de moules                      *
 * Edition de moules                    *
 * Ajout de modèles                     *
 * Edition de modèles                   *
 *                                      *
 ****************************************/

 
// Récupère et affiche tous les modèles et leurs moules associés
// ------------------------
function getModelesMoulesAdmin() {    
    //console.debug("Chargement des modeles et de leurs moules");
    if ((admin!==undefined) && (admin!==null) && (admin.length>0)) {
            //var url= url_serveur+'getmodelesmoulesadmin.php';
            var url= url_serveur+'getmodelesmoules.php';
            var mydata="";    
            ajax_GetModelesMoulesAdmin(url, mydata);         
    }
}

// Lance l'appel Ajax et transmet les données reçues à setModelesMoules
// Initialise le tableau tModelesMoules
// -----------------------
function ajax_GetModelesMoulesAdmin(url){ 
    if ((url !== undefined) && (url.length>0)){        
        // GET avec fetch()
        fetch(url, myInitGet)
        .then(response => response.text())  // Le retour est aussi une chaîne
        .then(response => {
            setModelesMoulesAdmin(response);         
                    })  // tout le boulot se fait ici  dans le script  setModelesMoules.js              
        .catch(error => console.debug("Erreur : "+error));
    }
}

// Remplit le tableau tModelesMoules
// Appelé par ajax_GetModelesMoules();
// Appelle selectModelesModules(); 
// ----------------------- 
function setModelesMoulesAdmin(response) {
    // console.debug("Affichage des modeles et des moules associés\n"+ response);
    // Traitement de la réponse 
    //  bdm_modele.id, bdm_modele.nom, bdm_modele.descriptif, bdm_modele.categorie, 
    //        bdm_moule.idmoule, bdm_moule.numero_inventaire, bdm_moule.mdescription, bdm_moule.mlieu, bdm_moule.matiere, bdm_moule.etat, bdm_moule.longueur, bdm_moule.poids, bdm_moule.commentaire  
 
    const objModeleMoule = JSON.parse(response);   
    tModeles=[]; // global;
    tMoules=[];  // global
    let tModelesMoules = []; 
    let tAux1 = [];
    let tAux2 = [];
    let tAux = [];
    
    for(let i in objModeleMoule ) { 
        //tModelesMoules.push(objModeleMoule[i].id, objModeleMoule[i].nom, objModeleMoule[i].descriptif, objModeleMoule[i].dimension, objModeleMoule[i].categorie, objModeleMoule[i].idmoule, objModeleMoule[i].numero_inventaire, objModeleMoule[i].mdescription, objModeleMoule[i].mlieu, objModeleMoule[i].matiere, objModeleMoule[i].etat, objModeleMoule[i].longueur, objModeleMoule[i].poids, objModeleMoule[i].commentaire);
        tAux = [];
        tAux.push(objModeleMoule[i].id, objModeleMoule[i].nom, objModeleMoule[i].descriptif, objModeleMoule[i].dimension, objModeleMoule[i].categorie, objModeleMoule[i].idmoule, objModeleMoule[i].numero_inventaire, objModeleMoule[i].mdescription, objModeleMoule[i].mlieu, objModeleMoule[i].matiere, objModeleMoule[i].etat, objModeleMoule[i].longueur, objModeleMoule[i].poids, objModeleMoule[i].commentaire);       
        tModelesMoules.push(tAux); 

        // Table des modèles
        if ((i==0) || (i>0) && (objModeleMoule[i].id!=objModeleMoule[i-1].id)){
            tAux1 = [];
            tAux1.push(objModeleMoule[i].id, objModeleMoule[i].nom, objModeleMoule[i].descriptif, objModeleMoule[i].dimension, objModeleMoule[i].categorie);
            tModeles.push(tAux1); 
        }
        // Tables des moules
        //  tAux2 = [];
        //  tAux2.push(objModeleMoule[i].id, objModeleMoule[i].idmoule, objModeleMoule[i].numero_inventaire, objModeleMoule[i].mdescription, objModeleMoule[i].mlieu, objModeleMoule[i].matiere, objModeleMoule[i].etat, objModeleMoule[i].longueur, objModeleMoule[i].poids, objModeleMoule[i].commentaire);       
        //  tMoules.push(tAux2); 
    }; 
        
    selectModelesMoulesAdmin(tModelesMoules);
}


// -----------------------
function selectModelesMoulesAdmin(tModelesMoules){
// Affiche une table de modèles et de leurs moules
// Deux boutons de sélection
// Les images associées
    //console.debug("Sélection d'un modèle et des moules associés\n"); 
    let str='<p><b>Modèles</b> &nbsp; &nbsp;';
    str+='<button id="btnaddmodele">Ajouter un modèle</button></p>';

    str+='<table>';
    if ((tModelesMoules !== undefined) && (tModelesMoules.length>0)){ 

        for (let i in tModelesMoules) { 
            if (i % 6 == 0){
                str+='<tr><th>#ID Modèle</th><th colspan="2">&nbsp;</th></th><th>Nom</th><th width="30%">Descriptif</th><th>Dimensions</th><th>Catégorie</th><th>ID Moule</th><th>N°</th><th>Description</th><th>Lieu stockage</th><th>Matière</th><th>Etat</th><th>Longueur</th><th>Poids</th><th>Commentaire</th></tr>';
                str+='<tr><th>&nbsp;</th><th colspan="6">Sélectionner le modèle à éditer</th><th colspan="9">Sélectionner le moule à afficher</th></tr>';
            }
            str+='<tr>';
            for (let j in tModelesMoules[i]) {  
                //console.debug(tModelesMoules[i]+"\n");
                var idmodele=tModelesMoules[i][0];
                var idmoule=tModelesMoules[i][5];
                // Modele
                if (j<5){
                    if ((i==0) || (i>0) && (tModelesMoules[i][0]!=tModelesMoules[i-1][0])){                             
                        if (j==0) { // idmodele
                            str+='<td><button name="modele'+idmodele+'" onclick="getModeleMoulesImages('+idmodele+'); editerThatModeleMoules('+idmodele+')">'+idmodele+'</button></td>';   
                            str+='<td><button onclick="editModele('+idmodele+')">Edit</button></td><td><button onclick="deleteModele('+idmodele+')">Supp</button></td>';                       
                        }
                        else {
                            str+='<td>';
                            if (tModelesMoules[i][j] != null){
                                str+=tModelesMoules[i][j]+'</td>';
                            }
                            else{
                                str+='<td>&nbsp;</td>';
                            }                
                        }
                    }
                    else{
                        if (j==0) { // idmodele
                        str+='<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>';
                        }
                        else{
                            str+='<td>&nbsp;</td>';
                        }
                    }
                }
                if (j>=5){
                    // Moule
                    if (j==5) { // idmoule
                        str+='<td><button name="moule'+idmoule+'" onclick="getThatMoule('+idmoule+');">'+idmoule+'</button></td>';
                    }
                    else if (tModelesMoules[i][j] != null){
                        str+='<td>'+tModelesMoules[i][j]+'</td>';
                    }
                    else{
                        str+='<td>&nbsp;</td>';
                    }                
                }
            }     
            str+='</tr>';
        }
    }  
    str+='</table>';     
    
    document.getElementById("myListModeles").innerHTML = str;
    
    // Nouveau modele
    const btnaddmodele = document.querySelector('#btnaddmodele');       
    btnaddmodele.addEventListener('click', (event) => {
        newModele();
    });    
      
}

//  ----------------------------------
function newModele(){

}


// -----------------------------------
// Edite le modele associé à un modèle particulier
function editerThatModele(idmodele){
    console.debug ("Editer ce moule: "+idmoule);
    console.debug ("A TERMINER");        
}

// -----------------------------------
// Edite les moules associés à un modèle particulier
function editerThatModeleMoules(idmodele){
    // console.debug ("Editer ce modèle: "+idmodele);
    //console.debug("Chargement des moules");
    var url= url_serveur+'getmodelemoules.php?idmodele='+idmodele;
    var mydata="";    
    ajax_GetThatModeleMoulesAdmin(url, idmodele);              
}

// Lance l'appel Ajax et transmet les données reçues à setThatModeleMoules
// -----------------------
function ajax_GetThatModeleMoulesAdmin(url, idmodele){ 
    if ((url !== undefined) && (url.length>0)){        
        // GET avec fetch()
        fetch(url, myInitGet)
//        .then(response => response.text())  // Le retour est aussi une chaîne
        .then(response => response.json())
        .then(response => {
            selectThatModeleMoulesAdmin(response, idmodele);         
                    })  // Formulaire checkbox             
        .catch(error => console.debug("Erreur : "+error));
    }
}


// Appelé par ajax_GetThatModeleMoulesAdmin();
// Modifie idmodeleglobal
// Positionne tMoules[] global
// Appelle editeMoule() et deleteMoule()
// ----------------------- 
function selectThatModeleMoulesAdmin(response, idmodele) {
    // console.debug("Affichage des modeles et des moules associés\n"+ response);
    // Traitement de la réponse 
    //INSERT INTO `bdm_moule` (`idmoule`, `ref_modele`, `numero_inventaire`, `mdescription`, `mlieu`, `matiere`, `etat`, `longueur`, `poids`, `commentaire`) VALUES    
    idmodeleglobal=idmodele; // Un peu indirect mais ça fera l'affaire

    const objModeleMoule = response.moules;
    let tThatModeleMoules = [];     
    for(let i in objModeleMoule ) { 
        let tAux = [];
        tAux.push(objModeleMoule[i].ref_modele, objModeleMoule[i].idmoule, objModeleMoule[i].numero_inventaire, objModeleMoule[i].mdescription, objModeleMoule[i].mlieu, objModeleMoule[i].matiere, objModeleMoule[i].etat, objModeleMoule[i].longueur, objModeleMoule[i].poids, objModeleMoule[i].commentaire);         
        tThatModeleMoules.push(tAux);  
    }; 
    
    let str='';
    str+='<p><b>Moules</b> &nbsp; &nbsp;';
    str+='<button id="btnaddmoule">Ajouter un moule pour ce modèle</button></p>';
    str+='<table><tr><th colspan="2">Choisir</th><th>ID Moule</th><th>Num. inventaire</th><th>Description</th><th>Lieu stockage</th><th>Matière</th><th>Etat</th><th>Longueur</th><th>Poids</th><th>Commentaire</th></tr>';
    
    if ((tThatModeleMoules !== undefined) && (tThatModeleMoules.length>0)){ 
        tMoules=[]; // global
        for (let i in tThatModeleMoules){
            tMoules.push(tThatModeleMoules[i]);
            str+='<tr>';
            for (let j in tThatModeleMoules[i]) {             
                var idmodele=tThatModeleMoules[i][0];
                var idmoule=tThatModeleMoules[i][1];
                if (j==0) { // checkbox
                    str+='<td><button onclick="editMoule('+idmodele+','+idmoule+','+i+')">Edit</button></td><td><button onclick="deleteMoule('+idmodele+','+idmoule+')">Supp</button></td>';
                }
                else
                if (tThatModeleMoules[i][j] != null){
                    str+='<td>'+tThatModeleMoules[i][j]+'</td>';
                }
                else{
                    str+='<td>&nbsp;</td>';
                }    
            }     
            str+='</tr>';
        }
    }  
    str+='</table>';  
    str+='<input type="hidden" id="idmodele" name="idmodele" value="'+idmodele+'">';  
         
    document.getElementById("infomoules").innerHTML = str;
    document.getElementById("consigne").innerHTML = 'Modèle sélectionné: '+idmodeleglobal+'. Sélectionnez les moules à éditer';

    // Nouveau moule
    const btnaddmoule = document.querySelector('#btnaddmoule');       
    btnaddmoule.addEventListener('click', (event) => {
        newMoule(idmodele);
    });    
} 
 

//-----------------------------------------
// Affiche un formulaire d'édition
function editMoule(idmodele, idmoule, index){
    console.debug("ediMoule()");
    console.debug("idmodele: "+idmodele);
    console.debug("idmoule: "+idmoule);
    console.debug("tMmoule: "+tMoules[index]);
    
    if ((idmodele !== undefined) && (idmodele>0) && (idmoule !== undefined) && (idmoule>0) 
        && (tMoules[index] !== undefined) && (tMoules[index] !== null) && (tMoules[index].length>0)){

        let str='';
        let url= url_serveur+'editmoulebypost.php';
        // Formulaire de création
        str+='<h4>Complétez ce formulaire</h4>';

        str+='<form name="EditForm" action="'+url+'" method="post">';
        str+='<div class="button"><input type="submit" value="Envoyer" onclick="return verifSaisieEdit();" /> <input type="reset" value="Réinitialiser"  /></div>';        

        // idmoule, numero_inventaire, mdescription, mlieu, matiere, etat, longueur, poids, commentaire
        str+='<div><label for="mdescription">Description: </label><br /><input type="text" id="mdescription" size="50" name="mdescription" value="'+tMoules[index][3]+'" autocomplete="on" />';
        str+='<br /><label for="mlieu">Lieu de dépôt: </label> <input type="text" id="mlieu" size="20" name="mlieu" value="'+tMoules[index][4]+'" autocomplete="on" />';
        str+='<br /><label for="matiere">Matière: </label> <input type="text" id="matiere" size="20" name="matiere" value="'+tMoules[index][5]+'" autocomplete="on" />';
        str+='<br /><label for="etatmoule">Etat: </label> <input type="text" id="etatmoule" size="20" name="etatmoule" value="'+tMoules[index][6]+'" autocomplete="on" />';
        str+='<br /><label for="longueur">Longueur: </label> <input type="text" id="longueur" size="10" name="longueur" value="'+tMoules[index][7]+'" autocomplete="on" />';
        str+='<br /><label for="poids">Poids: </label> <input type="text" id="poids" size="10" name="poids" value="'+tMoules[index][8]+'" autocomplete="on" />';
        str+='<br /><label for="mcommentaire">Remarques: </label><br />(<i><span class="small">Indiquez la disponibilité, les conditions de prêt, etc.</span></i>)';
        if ((tMoules[index][9] !== undefined) && (tMoules[index][9].length>0) ) {
            str+='<br /><textarea cols="50" id="mcommentaire" rows="3" name="mcommentaire" autocomplete="on">'+tMoules[index][9]+'</textarea>';
        }
        else{
            str+='<br /><textarea cols="50" id="mcommentaire" rows="3" name="mcommentaire" autocomplete="on">A compléter...</textarea>';                
        }            
        str+='</div>';        

        str+='<input type="hidden" id="refmodele" name="refmodele" value="'+idmodele+'" />';
        str+='<input type="hidden" id="idmoule" name="idmoule" value="'+idmoule+'" />';
        str+='<input type="hidden" id="numinventaire" name="numinventaire" value="'+tMoules[index][2]+'" />';
        str+='<input type="hidden" id="appel" name="appel" value="'+pageadmin+'" />';
        str+='</form>';
           
        document.getElementById("myImage").innerHTML = str;
    }

}

// -----------------------------------------
// Vérification des données
function verifSaisieEdit(){
    mdescription = document.forms["EditForm"]["mdescription"];               
    mlieu = document.forms["EditForm"]["mlieu"];    
    matiere = document.forms["EditForm"]["matiere"];   
    metat = document.forms["EditForm"]["etatmoule"];  
    mlongueur = document.forms["EditForm"]["longueur"];      
    mpoids = document.forms["EditForm"]["poids"];      
    mcommentaire = document.forms["EditForm"]["mcommentaire"];      
    refmodele = document.forms["EditForm"]["refmodele"];
          
    if (mdescription.value == "")                                  
    { 
        alert("Complétez la description."); 
        mdescription.focus(); 
        return false; 
    }    
    if (mlieu.value == "")                               
    { 
        alert("Complétez l'adresse du dépôt"); 
        mlieu.focus(); 
        return false; 
    }        
    if (mcommentaire.value == "")                  
    { 
        alert("Complétez le commentaire en précisant les conditions de prêt."); 
        mcommentaire.focus(); 
        return false; 
    }     

    return true;
}

// ----------------------------------
function deleteMoule(idmodele, idmoule){
    console.debug("deleteMoule()");
    console.debug("idmodele: "+idmodele);
    console.debug("idmoule: "+idmoule);
    
    if ((idmoule !== undefined) && (idmoule>0) 
        && (tMoule !== undefined) && (tMoule !== null) && (tMoule.length>0)){

        let str='';
        let url= url_serveur+'deletemoulebypost.php';
        // Formulaire de création
        str+='<h4>Confirmez la suppression de ce moule</h4>';

        str+='<form name="DelForm" action="'+url+'" method="post">';
        str+='<div class="button"><input type="submit" name="delete" value="Confirmer" /> <input type="submit" name="delete" value="Annuler" /></div>';        

        // idmoule, numero_inventaire, mdescription, mlieu, matiere, etat, longueur, poids, commentaire
        str+='<div><b>Description:</b> '+tMoule[3];
        str+='<br /><b>Lieu de dépôt:</b> '+tMoule[4];
        str+='<br /><b>Matière:</b> '+tMoule[5];
        str+='<br /><b>Etat:</b> '+tMoule[6];
        str+='<br /><b>Remarques:</b><br />'+tMoule[9];
        str+='</div>';        
        str+='<input type="hidden" id="idmoule" name="idmoule" value="'+idmoule+'" />';
        str+='<input type="hidden" id="appel" name="appel" value="'+pageadmin+'" />';
        str+='</form>';
           
        document.getElementById("myImage").innerHTML = str;
    }
}    
    
/**********************************************
 * 
 * AJOUT DE MOULES A LA BD
 * 
 * ********************************************/
 
// ---------------------------------------
// Formulaire de création d'un moule rattaché à ce modèle
// Envoi du formulaire vers serveur PHP sans appel Ajax
// Compatible Firefox
function newMoule(idmodele){
    console.debug("newMoule()");
    console.debug("idmodele: "+idmodele);
    
    if ((idmodele !== undefined) && (idmodele>0)){
        let str='';
        let url= url_serveur+'addmoulebypost.php';
        // Formulaire de création
        str+='<h4>Complétez ce formulaire</h4>';
        str+='<form name="AddForm" action="'+url+'" method="post">';
        str+='<div class="button"><input type="submit" value="Envoyer" name="Envoyer" onclick="return verifSaisieAdd();" /> <input type="reset" value="Réinitialiser" name="Reset" /></div>';        

        // idmoule, numero_inventaire, mdescription, mlieu, matiere, etat, longueur, poids, commentaire
        str+='<div><label for="mdescription">Description: </label><br /><input type="text" id="mdescription" size="50" name="mdescription" value="" autocomplete="on" />';
        str+='<br /><label for="mlieu">Lieu de dépôt: </label> <input type="text" id="mlieu" size="20" name="mlieu" value="La Minais" autocomplete="on" />';
        str+='<br /><label for="matiere">Matière: </label> <input type="text" id="matiere" size="20" name="matiere" value="Composite" autocomplete="on" />';
        str+='<br /><label for="etatmoule">Etat: </label> <input type="text" id="etatmoule" size="20" name="etatmoule" value="?" autocomplete="on" />';
        str+='<br /><label for="longueur">Longueur: </label> <input type="text" id="longueur" size="10" name="longueur" value="" autocomplete="on" />';
        str+='<br /><label for="poids">Poids: </label> <input type="text" id="poids" size="10" name="poids" value="" autocomplete="on" />';
        str+='<br /><label for="mcommentaire">Remarques: </label><br />(<i><span class="small">Indiquez la disponibilité, les conditions de prêt, etc.</span></i>)';
        str+='<br /><textarea cols="50" id="mcommentaire" rows="3" name="mcommentaire" autocomplete="on"></textarea>';
        str+='</div>';        
        str+='<input type="hidden" id="refmodele" name="refmodele" value="'+idmodele+'" />';
        str+='<input type="hidden" id="appel" name="appel" value="'+pageadmin+'" />';
        str+='</form>';      
        document.getElementById("myImage").innerHTML = str;
    }
}

// -----------------------------------------
// Vérification des données
function verifSaisieAdd(){
    mdescription = document.forms["AddForm"]["mdescription"];               
    mlieu = document.forms["AddForm"]["mlieu"];    
    matiere = document.forms["AddForm"]["matiere"];   
    metat = document.forms["AddForm"]["etatmoule"];  
    mlongueur = document.forms["AddForm"]["longueur"];      
    mpoids = document.forms["AddForm"]["poids"];      
    mcommentaire = document.forms["AddForm"]["mcommentaire"];      
    refmodele = document.forms["AddForm"]["refmodele"];
          
    if (mdescription.value == "")                                  
    { 
        alert("Complétez la description."); 
        mdescription.focus(); 
        return false; 
    }    
    if (mlieu.value == "")                               
    { 
        alert("Complétez l'adresse du dépôt"); 
        mlieu.focus(); 
        return false; 
    }        
    if (mcommentaire.value == "")                  
    { 
        alert("Complétez le commentaire en précisant les conditions de prêt."); 
        mcommentaire.focus(); 
        return false; 
    }     

    return true;
}

/*******************************************************************************************************************
// Version avec appel Ajax Get
// Sur Firefox
// Provoque un message "Bloqué par les outils de développement" et une erreur TypeError: NetworkError when attempting to fetch resource.
// Sur Google Chrome aucune erreur !
 
// ---------------------------------------
// création d'un moule rattaché à ce modèle
function newMouleAjax(idmodele){
    console.debug("newMouleAjax()");
    console.debug("idmodele: "+idmodele);
    
    if ((idmodele !== undefined) && (idmodele>0)){
        let str='';
        // Creer un formulaire de création
        str+='<h4>Complétez ce formulaire</h4>';
        str+='<form name="AddForm" action="" method="get" onsubmit="return addMouleAjax();">';
        str+='<div class="button"><input type="submit" value="Envoyer" name="Envoyer" /> <input type="reset" value="Réinitialiser" name="Reset" /></div>';        

        // idmoule, numero_inventaire, mdescription, mlieu, matiere, etat, longueur, poids, commentaire
        str+='<div><label for="mdescription">Description: </label><br /><input type="text" id="mdescription" size="50" name="mdescription" value="" autocomplete="on" />';
        str+='<br /><label for="mlieu">Lieu de dépôt: </label> <input type="text" id="mlieu" size="20" name="mlieu" value="La Minais" autocomplete="on" />';
        str+='<br /><label for="matiere">Matière: </label> <input type="text" id="matiere" size="20" name="matiere" value="Composite" autocomplete="on" />';
        str+='<br /><label for="etatmoule">Etat: </label> <input type="text" id="etatmoule" size="20" name="etatmoule" value="?" autocomplete="on" />';
        str+='<br /><label for="longueur">Longueur: </label> <input type="text" id="longueur" size="10" name="longueur" value="" autocomplete="on" />';
        str+='<br /><label for="poids">Poids: </label> <input type="text" id="poids" size="10" name="poids" value="" autocomplete="on" />';
        str+='<br /><label for="mcommentaire">Remarques: </label><br />(<i><span class="small">Indiquez la disponibilité, les conditions de prêt, etc.</span></i>)';
        str+='<br /><textarea cols="50" id="mcommentaire" rows="3" name="mcommentaire" autocomplete="on"></textarea>';
        str+='</div>';        
        str+='<input type="hidden" id="refmodele" name="refmodele" value="'+idmodele+'">';
        str+='</form>';      
        document.getElementById("myImage").innerHTML = str;
    }
}


// ----------------------------------
function addMouleAjax(){
    mdescription = document.forms["AddForm"]["mdescription"];               
    mlieu = document.forms["AddForm"]["mlieu"];    
    matiere = document.forms["AddForm"]["matiere"];   
    metat = document.forms["AddForm"]["etatmoule"];  
    mlongueur = document.forms["AddForm"]["longueur"];      
    mpoids = document.forms["AddForm"]["poids"];      
    mcommentaire = document.forms["AddForm"]["mcommentaire"];      
    refmodele = document.forms["AddForm"]["refmodele"];
          
    if (mdescription.value == "")                                  
    { 
        alert("Complétez la description."); 
        mdescription.focus(); 
        return false; 
    }    
    if (mlieu.value == "")                               
    { 
        alert("Complétez l'adresse du dépôt"); 
        mlieu.focus(); 
        return false; 
    }        
    if (mcommentaire.value == "")                  
    { 
        alert("Complétez le commentaire en précisant les conditions de prêt."); 
        mcommentaire.focus(); 
        return false; 
    }     
    console.debug("Envoi du formulaire.") 
    setNewMouleAjax(refmodele.value);
    
    return true;
}

// ----------------------------------
function setNewMouleAjax(refmodele){
// Mise à jour de la BD
    console.debug("setNewMoule()");
    console.debug("refmodele: "+refmodele);

    let mydata='';
    let strmsg='';
    // INSERT INTO `bdm_moule` (`idmoule`, `ref_modele`, `numero_inventaire`, `mdescription`, `mlieu`, `matiere`, `etat`, `longueur`, `poids`, `commentaire`)
    mydata+='?refmodele='+refmodele+'&mdescription='+mdescription.value+'&mlieu='+mlieu.value+'&matiere='+matiere.value+'&etat='+metat.value+'&longueur='+mlongueur.value+'&poids='+mpoids.value+'&commentaire='+mcommentaire.value+'&appel='+pageadmin;
    strmsg+='Nouveau moule pour le modèle '+refmodele+"\n";
    strmsg+=mydata;
    console.debug(strmsg);
    if (okadmin && (admin!==undefined) && (admin!==null) && (admin.length>0)) {
        var url= url_serveur+'addmoule.php';  
        ajax_SetNewMoule(url, mydata);         
    }
}

// Lance l'appel Ajax et transmet les données reçues à setThatModeleMoules
// -----------------------
function ajax_SetNewMoule(url, mydata){ 
    if ((url !== undefined) && (url.length>0) && (mydata !==undefined) && (mydata.length>0)){        
        // GET avec fetch()
        fetch(url+mydata, myInitGet)
//        .then(response => response.text())  // Le retour est aussi une chaîne
        .then(response => response.json())
        .then(response => {
            console.debug(response);         
                    })  // Formulaire checkbox             
        .catch(error => console.debug("Erreur : "+error));
    }
}

*********************************************************************************************************/
