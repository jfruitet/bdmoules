// JavaScript Document

// Gestion des accès et modification de la BD

/** 
 * 
 *  Authentification des admin
 *  A remplacer par un appel à la BD et une session
 * 
 */

// --------------------------------
function oklogin(){
    // A améliorer car ceci n'est absolument pas sûr.
    if ((Email !== undefined) && (Email !== null) && (Email.length>0)){    // Cookie User
        if (getUserAutorisation()){
            okadmin=true;
            admin=Email;
            setCookie("sadmin", admin, 1); // 1 jour
            return true;
        }   
        else{   // L'user n'est pas logé comme admin. On lui demande de s'identifier
            if (saisieLogin()){
                okadmin=true;
                admin=Email;
                setCookie("sadmin", admin, 1); // 1 jour
                return true;
            } 
            else{
                return false;
            }
        }
    }        
    else{   // Pas de cookies
        // On lui demande de se loger 
        if (saisieLogin()){
            okadmin=true;
            admin=Email;
            setCookie("sadmin", admin, 1); // 1 jour
            return true;
        } 
        else{
            return false;
        }        
    }
}

// --------------------------------
function getUserAutorisation(){
// Le courriel fourni par le cookie est-il reconnu ?
    console.debug("Login : vérification Email: "+Email);
    admin=null;
    if ((Email !== undefined) && (Email !== null) && (Email.length>0)){
        console.debug("Vérification des droits attachés à un utilisateur");
        for (let i in admins){
            if (Email==admins[i]){// A remplacer par le MD5 ? Voir https://github.com/blueimp/JavaScript-MD5
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
    str+='<p>Saisissez votre courriel d\'administrateur.</p>';
    str+='<input type="text" id="adminmail" name="adminmail" value="" />';
    str+='<input type="hidden" id="idmodele" name="idmodele" value="'+idmodeleglobal+'">';
    str+='<button id="btnlogin">Valider</button>';

    document.getElementById("consigne").innerHTML = str;
 
    // Collecte des ID des moules sélectionnés
    const btnlogin = document.querySelector('#btnlogin');
        
    btnlogin.addEventListener('click', (event) => {
        let adminmail = document.querySelector('input[name="adminmail"]');
        if ((adminmail !== undefined) && (adminmail !== null)){
            for (let i in admins){
                if (adminmail.value==admins[i]){
                    okadmin=true;
                    admin=adminmail.value;
                    console.debug("Admin reconnu: "+admin);
                    setCookie("sadmin", admin, 1); // 1 jour                    
                    return true;
                }
            }            
        } 
        else{
            return false;
        }
    });    
      
}

/** **********************************
 * 
 * Administration de la BD
 * 
 * 
 * 
 ** **********************************/

 
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
    let tModelesMoules = []; 
    tAux = [];
    for(let i in objModeleMoule ) { 
        //tModelesMoules.push(i, objModeleMoule[i].id, objModeleMoule[i].nom, objModeleMoule[i].descriptif, objModeleMoule[i].dimension, objModeleMoule[i].categorie, objModeleMoule[i].idmoule, objModeleMoule[i].numero_inventaire, objModeleMoule[i].mdescription, objModeleMoule[i].mlieu, objModeleMoule[i].matiere, objModeleMoule[i].etat, objModeleMoule[i].longueur, objModeleMoule[i].poids, objModeleMoule[i].commentaire);
        tAux = [];
        tAux.push(i, objModeleMoule[i].id, objModeleMoule[i].nom, objModeleMoule[i].descriptif, objModeleMoule[i].dimension, objModeleMoule[i].categorie, objModeleMoule[i].idmoule, objModeleMoule[i].numero_inventaire, objModeleMoule[i].mdescription, objModeleMoule[i].mlieu, objModeleMoule[i].matiere, objModeleMoule[i].etat, objModeleMoule[i].longueur, objModeleMoule[i].poids, objModeleMoule[i].commentaire);       
        tModelesMoules.push(tAux); 
    }; 
        
    document.getElementById("myListModeles").innerHTML = selectModelesMoulesAdmin(tModelesMoules);
}


// -----------------------
function selectModelesMoulesAdmin(tModelesMoules){
// Affiche une table de modèles et de leurs moules
// Deux boutons de sélection
// Les images associées
    //console.debug("Sélection d'un modèle et des moules associés\n"); 
    let str='';
    str='<table>';
    str+='<tr><th>&nbsp;</th><th>ID Modèle</th><th>Nom</th><th width="30%">Descriptif</th><th>Dimensions</th><th>Catégorie</th><th>ID Moule</th><th>N°</th><th>Description</th><th>Lieu stockage</th><th>Matière</th><th>Etat</th><th>Longueur</th><th>Poids</th><th>Commentaire</th></tr>';
    if ((tModelesMoules !== undefined) && (tModelesMoules.length>0)){ 
        for (let i in tModelesMoules) { 
            if (i % 6 == 0){
            str+='<tr><th colspan="6">Sélectionner le modèle à éditer</th><th colspan="9">Sélectionner le moules à éditer</th></tr>';
            }
            str+='<tr>';
            for (let j in tModelesMoules[i]) {  
                //console.debug(tModelesMoules[i]+"\n");
                var idmodele=tModelesMoules[i][1];
                var idmoule=tModelesMoules[i][6];
                if (j==1) { // idmodele
                    str+='<td><button name="modele'+tModelesMoules[i][j]+'" onclick="getModeleMoulesImages('+idmodele+'); editerThatModele('+idmodele+');">'+idmodele+'</button></td>';                    
                }
                else if (j==4) { // descriptif
                    str+='<td>';
                    if (tModelesMoules[i][j] != null){
                        str+=tModelesMoules[i][j]+'</td>';
                    }
                    else{
                        str+='<td>&nbsp;</td>';
                    }                
                }
                else if (j==6) { // idmoule
                    str+='<td><button name="moule'+idmoule+'" onclick="editerThatMoule('+idmodele+','+idmoule+');">'+idmoule+'</button></td>';
                }
                else
                if (tModelesMoules[i][j] != null){
                    str+='<td>'+tModelesMoules[i][j]+'</td>';
                }
                else{
                    str+='<td>&nbsp;</td>';
                }                
            }     
            str+='</tr>';
        }
    }  
    str+='</table>';      
    return str;        
}


// -----------------------------------
function editerThatMoule(idmodele, idmoule){
    console.debug ("Editer ce moule: "+idmoule);
    console.debug ("A TERMINER");   
     
}

// -----------------------------------
function editerThatModele(idmodele){
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
// Modifie modeledescription
// Remplit le tableau tidmoules
// Remplit le tableau tdescription
// Appelle editerThatMoulesAdmin();
// ----------------------- 
function selectThatModeleMoulesAdmin(response, idmodele) {
    // console.debug("Affichage des modeles et des moules associés\n"+ response);
    // Traitement de la réponse 
    //INSERT INTO `bdm_moule` (`idmoule`, `ref_modele`, `numero_inventaire`, `mdescription`, `mlieu`, `matiere`, `etat`, `longueur`, `poids`, `commentaire`) VALUES
//(1, 20, 24, 'Moule capot moteur, composite', 'La Minais', 'Composite', 'Excellent', NULL, NULL, 'Moule d\'avion inconnu'),
//(2, 13, 27, 'Ka6 4m, Moule bulle, Mpx 3 Axes', 'Chez Ludovic B.', 'Composite', 'Excellent', NULL, NULL, 'Chez Ludovic.');
    
    idmodeleglobal=idmodele; // Un peu indirect mais ça fera l'affaire

    const objModeleMoule = response.moules;
    let tThatModeleMoules = [];     
    for(let i in objModeleMoule ) { 
        let tAux = [];
        tAux.push(objModeleMoule[i].ref_modele, objModeleMoule[i].idmoule, objModeleMoule[i].numero_inventaire, objModeleMoule[i].mdescription, objModeleMoule[i].mlieu, objModeleMoule[i].matiere, objModeleMoule[i].etat, objModeleMoule[i].longueur, objModeleMoule[i].poids, objModeleMoule[i].commentaire);         
        tThatModeleMoules.push(tAux);  
    }; 
    
    let str='';
    //str+='<p>Sélectionnez les moules à réserver</p>';
    str+='<button id="btnedit">Editer</button>';
    str+='<table><tr><th>Choisir</th><th>ID Moule</th><th>Num. inventaire</th><th>Description</th><th>Lieu stockage</th><th>Matière</th><th>Etat</th><th>Longueur</th><th>Poids</th><th>Commentaire</th></tr>';
    
    if ((tThatModeleMoules !== undefined) && (tThatModeleMoules.length>0)){ 
        for (let i in tThatModeleMoules){
            str+='<tr>';
            for (let j in tThatModeleMoules[i]) {  
                //console.debug(tThatModeleMoules[i]+"\n");
                var idmodele=tThatModeleMoules[i][0];
                var idmoule=tThatModeleMoules[i][1];
                if (j==0) { // checkbox
                    str+='<td><label for '+idmoule+'><input type="checkbox" id="'+idmoule+'" name="idmoule" value="'+idmoule+'" checked />'+idmoule+'</label></td>';
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
    document.getElementById("consigne").innerHTML = 'Sélectionnez les moules à éditer';
 
    // Collecte des ID des moules sélectionnés
    const btnedit = document.querySelector('#btnedit');
        
    btnedit.addEventListener('click', (event) => {
        let checkboxes = document.querySelectorAll('input[name="idmoule"]:checked');
        let tidmoules = [];        
        checkboxes.forEach((checkbox) => {
                tidmoules.push(checkbox.value);
        });
        //console.debug("idmoules\n"+idmoulesvalues);
        
        // Collecte des descriptions de moules sélectionnés
        let tEditionMoules = [];
        if (tidmoules.length>0){
            for (let j in tidmoules){
                for (let i in tThatModeleMoules){    
                    if (tidmoules[j]==tThatModeleMoules[i][1]){                       
                        //idmouleglobal=tidmoules[j];
                        tEditionMoules.push(tThatModeleMoules[i]);
                    }           
                }
            }        
        }    
        editerThatMoules(tEditionMoules, idmodele);
    });    
} 
 
//-----------------------------------------
// Affiche un formulaire d'édition
function editerThatMoules(tEditionMoules, idmodele){
    console.debug("editerThatMoules()");
    console.debug("idmodele: "+idmodeleglobal);
    console.debug("modeledescription: "+modeledescription);
    console.debug("tidmoules: "+tidmoules);
    console.debug("tEditionMoules: "+tEditionMoules);
    
    if ((idmodele !== undefined) && (idmodele>0) && (tEditionMoules!==undefined) && (tEditionMoules.length>0)){ // idmodele=37; tidmoules=[46,47];
        let str='';
        // Creer un formulaire de réservation
        str+='<h4>Complétez ce formulaire d\'édition</h4>';
        str+='<form name="EditForm" action="" onsubmit="return saisieEditionMultiple()" method="post">';

        str+='</div><div class="button"><input type="submit" value="Envoyer" name="Envoyer" /><input type="reset" value="Réinitialiser" name="Reset" /></div>';        
        str+='<input type="hidden" id="idmodele" name="idmodele" value="'+idmodele+'">';
        
        for (let i=0; i<tEditionMoules.length; i++){
            str+='<type="hidden" id="idmoule'+tidmoules[i]+' name="idmoule'+tidmoules[i]+'" value="'+tidmoules[i]+'">';
        }     
        // Pour tester
        let thatdata= tEditionMoules.join();
        str+='<br /><label for="Commentaire">Data: (<i><span class="small">A modifier...</span></i>)</label><textarea cols="50" id="editdata" rows="3" name="editdata" autocomplete="on">'+thatdata+'</textarea>';
        
        str+='</form>';      
        document.getElementById("myImage").innerHTML = str;
    }

}

// ----------------------------------
function saisieEditionMultiple(){
// Affiche le formulaire de mise à jour de plusieurs moules
console.debug("saisieEditionMultiple: A TERMINER...");
}

/********************************
    nom = document.forms["Form"]["Nom"];               
    email = document.forms["RegForm"]["Email"];    
    phone = document.forms["RegForm"]["Telephone"];   
    address = document.forms["RegForm"]["Adresse"];  
    comment = document.forms["RegForm"]["Commentaire"];      

    if (nom.value == "")                                  
    { 
        alert("Mettez votre nom."); 
        nom.focus(); 
        return false; 
    }    
    if (address.value == "")                               
    { 
        alert("Mettez votre adresse."); 
        address.focus(); 
        return false; 
    }        
    if (email.value == "")                                   
    { 
        alert("Mettez une adresse email valide."); 
        email.focus(); 
        return false; 
    }    
    if (email.value.indexOf("@", 0) < 0)                 
    { 
        alert("Mettez une adresse email valide."); 
        email.focus(); 
        return false; 
    }    
    if (email.value.indexOf(".", 0) < 0)                 
    { 
        alert("Mettez une adresse email valide."); 
        email.focus(); 
        return false; 
    }    
    if (phone.value == "")                           
    { 
        alert("Mettez votre numéro de téléphone."); 
        phone.focus(); 
        return false; 
    }    
    if (comment.value == "")                  
    { 
        alert("Complétez le commentaire en précisant l'objet de votre réservation."); 
        comment.focus(); 
        return false; 
    } 
    // Variables globales et Cookies
    Nom = document.forms["RegForm"]["Nom"].value;               
    Email = document.forms["RegForm"]["Email"].value;    
    Telephone = document.forms["RegForm"]["Telephone"].value;   
    Adresse = document.forms["RegForm"]["Adresse"].value;  
    Commentaire = document.forms["RegForm"]["Commentaire"].value;
    setCookies();      
    
    redigeReservationMultiple();
    return true; 
}

// ----------------------------------
function redigeReservationMultiple(){
// Redige un courriel envoyé par <a href="mailto: etc.
    console.debug("redigeReservationMultiple()");
    console.debug("idmodele: "+idmodeleglobal);
    console.debug("modeledescription: "+modeledescription);
    console.debug("tidmoules: "+tidmoules);
    console.debug("tdescription: "+tdescription);

    if ((tdescription!==undefined) && (tdescription.length>0)){        
        let str='';
        let strmsg='';
        console.debug("Rédaction du courriel de réservation");        
        str+='<b>Moules réservés</b><ul><li>'+modeledescription+'<ol>';
        strmsg+='Moules réservés'+"\n"+modeledescription+"\n";
        for (let i=0; i<tdescription.length; i++){
            str+='<li>Moule ID:'+tdescription[i][0]+' Inventaire: '+tdescription[i][1]+' Description: '+tdescription[i][2]+', '+tdescription[i][3]+'</li>';
            strmsg+='Moule ID:'+tdescription[i][0]+' Inventaire: '+tdescription[i][1]+' Description: '+tdescription[i][2]+', '+tdescription[i][3]+"\n";
        }
        str+='</ol></li></ul>';
        
        console.debug(str);        
        //let thatbody= 'Nom: '+Nom+'%0A%0AEmail: '+Email+'%0A%0ATéléphone: '+Telephone+'%0A%0AAdresse: '+Adresse+'%0A%0ACommentaire '+Commentaire+'%0A%0A'+strmsg;
        let thatbody= encodeURIComponent("Demande de réservation effectuée par \n\nNom: "+Nom+"\nEmail: "+Email+"\nTéléphone: "+Telephone+"\nAdresse: "+Adresse+"\nCommentaire: "+Commentaire+"\n\n"+strmsg);
        console.debug("Message body\n"+thatbody);
        document.getElementById("myImage").innerHTML = '<h4>Cliquez sur le lien pour envoyer cette demande de réservation</h4><p>'+str;
        // Version opérationnelle
        // document.getElementById("myImage").innerHTML +='<br /><a href="mailto:bureau-arbl@laposte.net?cc=jean.fruitet@free.fr&subject=RéservationMoules&body='+thatbody+'">Envoyer</a></p>';
        // Version de test
        document.getElementById("myImage").innerHTML +='<br /><a href="mailto:jean.fruitet@laposte.net?cc=jean.fruitet@free.fr&subject='+encodeURIComponent("Réservation Moules")+'&body='+thatbody+'">Envoyer</a></p>';                      
    }           
}

*/
