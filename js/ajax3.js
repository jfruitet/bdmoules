// JavaScript Document
// ajax3.js inclus dans administrer.html
// Gestion des comptes utilisateur de la BD
// N'est pas encore implanté
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
    //console.debug("Chargement des utilisateurs");
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
            if (response.ok==1){                
                setUsersAdmin(response.users);         
            }
                    })                
        .catch(error => console.debug("Erreur : "+error));
    }
}

// Remplit le tableau tUsers
// Appelé par ajax_GetUsers);
// Appelle selectUsers(); 
// ----------------------- 
function setModelesMoulesAdmin(response) {
    console.debug("Affichage des utilisateurs enregistrés\n"+ response);
    // Traitement de la réponse 
// userid 	usernom 	userlogin 	statut [1: admin, 2:auteur, 3: lecteur] 	pass [pass crypté MD5] 	telephone 	club 	 
    const objUsers = JSON.parse(response);   
    let tUsers = []; 
    tAux = [];
    for(let i in objUsers ) { 
        tAux = [];
        tAux.push(i, objUsers[i].userid, objUsers[i].usernom, objUsers[i].userlogin, objUsers[i].statut, objUsers[i].pass, objUsers[i].telephone, objUsers[i].club);       
        tUsers.push(tAux); 
    }; 
        
    document.getElementById("myListModeles").innerHTML = selectUsersAdmin(tUsers);
}


// -----------------------
function selectUsersAdmin(tUsers){
// Affiche une table d'utilisateurs et leur statut
// Un boutons de sélection
    console.debug("Sélection d'un utilisateur\n"); 
    let str='';
    str='<table>';
    str+='<tr><th>&nbsp;</th><th>ID User</th><th>Nom</th><th>Login</th><th>Statut</th><th>Mot de passe crypté</th><th>Téléphone</th><th>Club</th></tr>';
    if ((tUsers !== undefined) && (tUsers.length>0)){ 
        for (let i in tUsers) { 
            if (i % 6 == 0){
            str+='<tr><th colspan="8">Sélectionner le l\'utilisateur à éditer</th></tr>';
            }
            str+='<tr>';
            for (let j in tUsers[i]) {  
                console.debug(tUsers[i]+"\n");               
                if (j==0) { // userid
                    str+='<td><button name="user'+tUsers[i][j]+'" onclick="editerThatUser('+tUsers[i][j]+');">'+tUsers[i][j]+'</button></td>';                    
                }
                else if (j==3) { // statut
                    str+='<td>';
                    if (tUsers[i][j] != null){
                        switch(tUsers[i][j]){
                            case 1 : str+='Administrateur';
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
                    str+='</td>';
                }
                else{
                    if (tUsers[i][j] != null){
                        str+='<td>'+tUsers[i][j]+'</td>';
                    }
                    else {
                        str+='<td>&nbsp;</td>';
                    }
                }                
            }     
            str+='</tr>';
        }
    }  
    str+='</table>';      
    return str;        
}



// -----------------------------------
// Edite un utilisateur particulier
function editerThatUser(iduser){
    console.debug ("Editer ce modèle: "+iduser);
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
//        .then(response => response.text())  // Le retour est aussi une chaîne
        .then(response => response.json())
        .then(response => {
            if (response.ok==1){
                saisieThatUser(response.user);         
                    })  // Formulaire checkbox             
        .catch(error => console.debug("Erreur : "+error));
    }
}


// Appelé par ajax_GetThatUser();
// Appelle saisieThatUser();
// ----------------------- 
function saisieThatUser(thatuser) {
    // console.debug("Affichage des modeles et des moules associés\n"+ response);
    // Traitement de la réponse 

    if ((thatuser !== undefined) && (thatuser !== null) ){       
        let url= url_serveur+'adduser.php';
        let str='';
        
        str+='<h4>Utilisateur</h4>';
         // Creer un formulaire de réservation
        str+='<p>Complétez ce formulaire d\'édition</p>';
        // Formulaire de création
        str+='<form name="AddFormUser" action="'+url+'" method="post">';
        str+='<div class="button"><input type="submit" value="Editer" name="Editer" onclick="return verifSaisieUser(false);" /> <input type="submit" value="Ajouter" name="Ajouter" onclick="return verifSaisieUser(true);" /> <input type="reset" value="Réinitialiser" name="Reset" /></div>';        

        // idmoule, numero_inventaire, mdescription, mlieu, matiere, etat, longueur, poids, commentaire
        str+='<div><label for="unom">Nom prénom: </label><br /><input type="text" id="unom" size="50" name="unom" value="'.thatuser.usernom.'" autocomplete="on" />';
        str+='<br /><label for="ulogin">Login: </label> <input type="text" id="ulogin" size="20" name="ulogin" value="'+thatuser.userlogin+'" autocomplete="on" />';
        str+='<br /><label for="ustatut">Statut: </label> <input type="text" id="ustatut" size="20" name="ustatut" value="'+thatuser.statut+'" autocomplete="on" />';
        if ((thatuser.pass !== undefined) && (thatuser.pass !== null) && (thatuser.pass.length > 0 )){
            str+='<span class="surligné">Mot de passe non modifiable</span>';
            str+='<input type="hidden" id="uoldpass" name="uoldpass" value="'+thatuser.pass+'" />';
        }
        else{
            str+='<br /><label for="upass">Mot de passe: </label> <input type="text" id="upass" size="20" name="upass" value="" />';
            str+='<input type="hidden" id="uoldpass" name="uoldpass" value="" />';
        }
        str+='<br /><label for="utelephone">Téléphone: </label> <input type="text" id="utelephone" size="20" name="utelephone" value="'+thatuser.telephone+'" autocomplete="on" />';
        str+='<br /><label for="uclub">Club: </label> <input type="text" id="uclub" size="50" name="uclub" value="'+thatuser.club+'" autocomplete="on" />';
        str+='</div>';       
        if ((thatuser.userid !== undefined) && (thatuser.userid !== null)){  
            str+='<input type="hidden" id="userid" name="userid" value="'+thatuser.userid+'" />';
        }
        else{
            str+='<input type="hidden" id="userid" name="userid" value="" />';                
        }
        str+='<input type="hidden" id="appel" name="appel" value="'+pageadmin+'" />';
        str+='</form>';      
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
    if (utelephone.value == "")                  
    { 
        alert("Complétez le téléphone."); 
        utelephone.focus(); 
        return false; 
    }     
    if (!add){
        if ((upass.value==0) && (uoldpass.length==0)) {
            alert("Complétez le mot de passe."); 
            upass.focus(); 
            return false;     
        }
    }
    else{
        if (upass.value==0) {
            alert("Complétez le mot de passe."); 
            upass.focus(); 
            return false;     
        }    
    }
    return true;
}


