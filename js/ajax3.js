// JavaScript Document
// ajax3.js inclus dans administrer.html
// Gestion des comptes utilisateur de la BD

let unom = '';   
let ulogin = '';
let upass = '';
let uoldpass = '';
let ustatut = 0;
let utelephone = '';
let uclub = '';

/** 
 * 
 *  Authentification des admin
 *  A remplacer par un appel à la BD et une session
 * 
 */


/**************************************** 
 *                                      *
 * Administration de la BD              *
 *                                      *
 * Ajout des utilisateurs               *
 *                                      *
 ****************************************/

 
// Récupère et affiche tous les comptes utilisateurs
// ------------------------
function getUsersAdmin() {    
    console.debug("Chargement des utilisateurs");
    if ((admin!==undefined) && (admin!==null) && (admin.length>0)) {
            //var url= url_serveur+'getmodelesmoulesadmin.php';
            var url= url_serveur+'getusers.php';
            var mydata="";    
            ajax_GetUsers(url, mydata);         
    }
}

// Lance l'appel Ajax et transmet les données reçues à setModelesMoules
// Initialise le tableau tModelesMoules
// -----------------------
function ajax_GetUsers(url){ 
    if ((url !== undefined) && (url.length>0)){        
        // GET avec fetch()
        fetch(url, myInitGet)
        .then(response => response.text())  // Le retour est aussi une chaîne
        .then(response => {
                //console.debug("Affichage des utilisateurs enregistrés\n");
                //console.debug(response.users);                
                selectUsersAdmin(response);         
            })                
        .catch(error => console.debug("Erreur : "+error));
    }
}


// -----------------------
function selectUsersAdmin(response){
// Affiche une table d'utilisateurs et leur statut
// Un boutons de sélection
    //console.debug("Sélection d'un utilisateur\n"); 
    const objUsers = JSON.parse(response); 
    //console.debug(objUsers);
      
    let tUsers = []; 
    let tAux = [];
    for(let i in objUsers ) { 
        tAux = [];
        tAux.push(objUsers[i].userid, objUsers[i].usernom, objUsers[i].userlogin, objUsers[i].statut, objUsers[i].pass, objUsers[i].telephone, objUsers[i].club);       
        tUsers.push(tAux); 
    }; 
        
    //console.debug(tUsers);
    let str='';
    str+='<p><b>Utilisateurs</b> &nbsp; &nbsp;';
    str+='<button id="btnadduser">Ajouter un utilisateur</button> &nbsp; (<a target="_blank" href="help.html#Rôles">?</a>)</p>';    
    str+='<table>';
    str+='<tr><th>ID User</th><th>Nom</th><th>Login</th><th>Statut</th><th>Mot de passe crypté</th><th>Téléphone</th><th>Club</th></tr>';
    if ((tUsers!== null) && (tUsers.length>0)){ 
        for (let i in tUsers) { 
            if (i % 6 == 0){
            str+='<tr><th colspan="7">Sélectionner le l\'utilisateur à éditer</th></tr>';
            }
            str+='<tr>';               
            str+='<td><button name="user'+tUsers[i][0]+'" onclick="editerThatUser('+tUsers[i][0]+');">'+tUsers[i][0]+'</button></td>';                    
            str+='<td>'+tUsers[i][1]+'</td><td>'+tUsers[i][2]+'</td><td>';
             // statut
            if ((tUsers[i][3] !== null) && (parseInt(tUsers[i][3])>=0)){
                switch (parseInt(tUsers[i][3])){
                    case 1 : str+='<b>Administrateur</b>';
                                break;
                   case 2 : str+='Auteur';
                                break;
                   case 3 : str+='Lecteur';
                                break;
                   default : str+='Visiteur';
                }    
            }            
            else{
                str+='&nbsp;';
            }                     
    
            str+='<td>'+tUsers[i][4]+'</td><td>'+tUsers[i][5]+'</td><td>'+tUsers[i][6]+'</td>';
            str+='</tr>';
        }
    }  
    str+='</table>';
    document.getElementById("myListModeles").innerHTML = str;
    
    // Nouvel user
    const btnadduser = document.querySelector('#btnadduser');       
    btnadduser.addEventListener('click', (event) => {
        newUser();
    });   
   
}

// -----------------------------------
function newUser(){
    console.debug ("Nouvel utilisateur ");
   // console.debug("Affichage des infos associées\n"+ response);
    // Traitement de la réponse 
     
        let url= url_serveur+'adduser.php';
        let str='';
        
        str+='<h4>Utilisateur</h4>';
         // Creer un formulaire de réservation
        str+='<p>Complétez ce formulaire d\'édition</p>';
        // Formulaire de création
        str+='<form name="AddFormUser" action="'+url+'" method="post">';
        str+='<div class="button"> <input type="submit" value="Ajouter" name="Ajouter" onclick="return verifSaisieUser(true);" /> <input type="reset" value="Réinitialiser" name="Reset" /> <input type="submit" name="Abandonner" value="Abandonner" /></div>';        
        // idmoule, numero_inventaire, mdescription, mlieu, matiere, etat, longueur, poids, commentaire
        str+='<div><label for="unom"><b>NOM Prénom</b>: </label><br /><input type="text" id="unom" size="50" name="unom" value="" autocomplete="on" />';
        str+='<br /><label for="ulogin"><b>Courriel</b>: </label> <input type="text" id="ulogin" size="20" name="ulogin" value="" autocomplete="on" /> (<i>Ce sera aussi le login</i>)';
        str+='<br /><label for="ustatut"><b>Rôle</b>: </label> ';
        str+='<select name="ustatut" id="ustatut">';
        str+='<option value="">--Sélectionnez au moins un statut--</option>';
            str+='<option value="0">Visiteur</option>';
            str+='<option value="3">Lecteur</option>';
            str+='<option value="2">Auteur</option>';
            str+='<option value="1">Administrateur</option>';
        str+='</select>';        
        str+='<br /><label for="upass"><b>Mot de passe</b>: </label> <input type="text" id="upass" size="20" name="upass" value="" />';
        str+='<br /><label for="utelephone"><b>Téléphone</b>: </label> <input type="text" id="utelephone" size="20" name="utelephone" value="" autocomplete="on" />';
        str+='<br /><label for="uclub"><b>Club</b>: </label>'; 
        str+='<br /><textarea cols="50" id="uclub" rows="3" name="uclub"></textarea>';                
        str+='</div>';       
        str+='<input type="hidden" id="userid" name="userid" value="" />';                
        str+='<input type="hidden" id="appel" name="appel" value="'+pageuser+'" />';
        str+='</form>'; 
        document.getElementById("scrollleft").style.display = "inline";     
        document.getElementById("myImage").innerHTML = str;


}

// -----------------------------------
// Edite un utilisateur particulier
function editerThatUser(iduser){
    console.debug ("Editer cet User: "+iduser);
    //console.debug("Chargement des moules");
    var url= url_serveur+'getusers.php?iduser='+iduser;
    var mydata="";    
    ajax_GetThatUser(url);              
}

// Lance l'appel Ajax et transmet les données reçues à saisieThatUser
// -----------------------
function ajax_GetThatUser(url){ 
    if ((url !== undefined) && (url.length>0)){        
        // GET avec fetch()
        fetch(url, myInitGet)
        .then(response => response.text())  // Le retour est aussi une chaîne
        .then(response => {
                saisieThatUser(response);                     
        })  // Formulaire checkbox             
        .catch(error => console.debug("Erreur : "+error));
    }
}


// Appelé par ajax_GetThatUser();
// Appelle saisieThatUser();
// ----------------------- 
function saisieThatUser(response) {
    // console.debug("Affichage des infos associées\n"+ response);
    // Traitement de la réponse 
    const thatuser = JSON.parse(response); 
    if ((thatuser !== undefined) && (thatuser !== null) ){    
        iduser=thatuser.userid;
        nomuser=thatuser.usernom;
        courrieluser=thatuser.userlogin;
        roleuser=thatuser.statut;    
        
        let str='';             
        // Edition   
        let url= url_serveur+'adduser.php';               
        str+='<h4>Utilisateur</h4>';
        str+='<div class="button"><button class="button_alerte" id="btndeluser" name="btndeluser" onclick="confimerDeleteUser();">Supprimer</button></div>';
        
        // Creer un formulaire d'édition
        str+='<h5>Edition</h5>';
        str+='<p>Complétez ce formulaire d\'édition</p>';
        // Formulaire de création
        str+='<form name="AddFormUser" action="'+url+'" method="post">';
        str+='<div class="button"><input type="submit" value="Editer" name="Editer" onclick="return verifSaisieUser(false);" />';
        str+=' <input type="reset" value="Réinitialiser" name="Reset" />';
        str+=' &nbsp; &nbsp; <input type="submit" name="Abandonner" value="Abandonner" /></div>';        

        // idmoule, numero_inventaire, mdescription, mlieu, matiere, etat, longueur, poids, commentaire
        str+='<div><label for="unom"><b>NOM Prénom</b>: </label><br /><input type="text" id="unom" size="50" name="unom" value="'+thatuser.usernom+'" autocomplete="on" />';
        str+='<br /><label for="ulogin"><b>Courriel</b>: </label> <input type="text" id="ulogin" size="20" name="ulogin" value="'+thatuser.userlogin+'" autocomplete="on" /> (<i>Ce sera aussi le login</i>)';
        str+='<br /><label for="ustatut"><b>Rôle</b>: </label>';
        str+='<select name="ustatut" id="ustatut">';
        str+='<option value="">--Sélectionnez au moins un statut--</option>';
        if ((thatuser.statut!==undefined) && (thatuser.statut.length>0)){
            if (thatuser.statut=='0') {str+='<option value="0" selected>Visiteur</option>';} else { str+='<option value="0">Visiteur</option>';}
            if (thatuser.statut=='3') {str+='<option value="3" selected>Lecteur</option>';} else {str+='<option value="3">Lecteur</option>';}
            if (thatuser.statut=='2') {str+='<option value="2" selected>Auteur</option>';} else {str+='<option value="2">Auteur</option>';}
            if (thatuser.statut=='1') {str+='<option value="1" selected>Administrateur</option>';} else {str+='<option value="1">Administrateur</option>';}        
        }
        else{
            str+='<option value="0">Visiteur</option>';
            str+='<option value="3">Lecteur</option>';
            str+='<option value="2">Auteur</option>';
            str+='<option value="1">Administrateur</option>';
        }
        str+='</select>';        
        str+='</div>';        
        if ((thatuser.pass !== undefined) && (thatuser.pass !== null) && (thatuser.pass.length > 0 )){
            str+='<br /><span class="surligne">Mot de passe non modifiable</span> (<a target="_blank" href="help.html#Password">?</a>)';
            str+='<input type="hidden" id="uoldpass" name="uoldpass" value="'+thatuser.pass+'" />';
        }
        else{
            str+='<br /><label for="upass"><b>Mot de passe</b>: </label> <input type="password" id="upass" size="20" name="upass" value="" />';
            str+='<input type="hidden" id="uoldpass" name="uoldpass" value="" />';
        }
        str+='<br /><label for="utelephone"><b>Téléphone</b>: </label> <input type="text" id="utelephone" size="20" name="utelephone" value="'+thatuser.telephone+'" autocomplete="on" />';
        str+='<br /><label for="uclub"><b>Club</b>: </label>'; 
        str+='<br /><textarea cols="50" id="uclub" rows="3" name="uclub">'+thatuser.club+'</textarea>'; 
        str+='</div>';       
        if ((thatuser.userid !== undefined) && (thatuser.userid !== null)){  
            str+='<input type="hidden" id="userid" name="userid" value="'+thatuser.userid+'" />';
        }
        else{
            str+='<input type="hidden" id="userid" name="userid" value="" />';                
        }
        str+='<input type="hidden" id="appel" name="appel" value="'+pageuser+'" />';
        str+='<input type="hidden" id="action" name="action" value="1" />'; // Edition
        str+='</form>';      
        document.getElementById("scrollleft").style.display = "inline";
        document.getElementById("myImage").innerHTML = str;
    }        
}


// -----------------------------------------
// Vérification des données
function verifSaisieUser(add=false){
    unom = document.forms["AddFormUser"]["unom"];               
    ulogin = document.forms["AddFormUser"]["ulogin"];    
    ustatut = document.forms["AddFormUser"]["ustatut"];   
    upass = document.forms["AddFormUser"]["upass"];
    uoldpass = document.forms["AddFormUser"]["uoldpass"];   
    utelephone = document.forms["AddFormUser"]["utelephone"];      
    uclub = document.forms["AddFormUser"]["uclub"];      
     
    let userid = document.forms["AddFormUser"]["userid"].value;
          
    if (unom.value == "")                                  
    { 
        alert("Complétez le NOM Prénom."); 
        unom.focus(); 
        return false; 
    }    
    if (ulogin.value == "")                               
    { 
        alert("Complétez le login"); 
        ulogin.focus(); 
        return false; 
    }        
    if (ustatut.value == "")                  
    { 
        alert("Sélectionnez un rôle."); 
        ustatut.focus(); 
        return false; 
    } 
    if (utelephone.value == "")                  
    { 
        alert("Complétez le téléphone."); 
        utelephone.focus(); 
        return false; 
    }     
    if (!add){
        if ((upass.value=="") && (uoldpass.length==0)) {
            alert("Complétez le mot de passe."); 
            upass.focus(); 
            return false;     
        }
    }
    else{
        if (upass.value=="") {
            alert("Complétez le mot de passe."); 
            upass.focus(); 
            return false;     
        }    
    }
    return true;
}

// -----------------------------------------
// Vérification des données
function confimerDeleteUser(){
console.debug("Suppression demandée");           
    if ((courrieluser !== undefined) && (courrieluser.length > 0) && (iduser !== undefined) &&  (parseInt(iduser) > 0))                                  
    { 
        console.debug("Suppression demandée: "+courrieluser);
        let str='';
        let url= url_serveur+'deleteuser.php';
        // Formulaire de confirmation
        str+='<h4>Confirmez la suppression de cet utilisateur</h4>';
        str+='<p>Toutes les informations de connexion le concernant seront supprimées...</p>';
        str+='<form name="DelUserForm" action="'+url+'" method="post">';
        str+='<div><b>NOM Prénom:</b> '+nomuser;
        str+='<br /><b>Courriel:</b> '+courrieluser;
        
        str+='<br /><b>Rôle:</b> ';
        if ((roleuser!==undefined) && (roleuser.length>0)){
            if (roleuser=='3') {str+='Lecteur';} 
            else if (roleuser=='2') {str+='Auteur';}
            else if (roleuser=='1') {str+='<b>Administrateur</b>';} 
            else {str+='Visiteur';}        
        }
        else {str+='Visiteur';}
        str+='</div>';        
        str+='<input type="hidden" id="iduser" name="iduser" value="'+iduser+'" />';
        str+='<input type="hidden" id="appel" name="appel" value="'+pageuser+'" />';
        str+='<div class="button"><input type="submit" name="delete" value="Confirmer" /> &nbsp; &nbsp; <input type="submit" name="delete" value="Annuler" /></div>';                
        str+='</form>';
           
        document.getElementById("myImage").innerHTML = str;         
    }   
    return true;
}
