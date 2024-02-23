// JavaScript Document

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
            return true;
        }   
    }        
    // On lui demande de se loger 
    return saisieLogin();
}


// --------------------------------
function formlogout(){
    console.debug("Bouton Logout");
    let str='';
    str+='<p>&nbsp; <button id="btnlogout" onclick="return logout();">Déconnexion</button></p>';
    document.getElementById("logout").innerHTML = str;
}
 
// --------------------------------
function logout(){
            console.debug("Logout confirmé");
            dellCookie("sadmin");
            if (admin==Courriel) {
                dellCookie("scourriel")
            }; 
            dellCookie("sadminpass");
            if (admin==Courriel) {
                dellCookie("scourriel")
            }; 

            admin='';
            adminpassword='';
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
    admin='';
    adminpassword='';
    okadmin=false;
    if ((Courriel !== undefined) && (Courriel !== null) && (Courriel.length>0)){
        console.debug("Vérification des droits attachés à un utilisateur");
        if (veriflogin(Courriel, '') === 0){ // Demander le mot de passe
            return saisieLogin(Courriel); 
        }
    }     
    return false;  
} 
 
 // Valuer de retour : -1 : non logé; 0 : verifier password ; 1: OK
 // -------------------------------
 function verifLogin(adminmail, adminpass=''){
    if ((adminmail !== undefined) && (adminmail !== null) && (adminmail !== '') && (admins !== undefined) && (admins !== null) && (admins.length > 0)){
        for (let i in admins){
            if (adminmail==admins[i]){
                // pass ?
                if ((adminpass !== undefined) && (adminpass !== null) && (adminpass !== '')){                
                    if ((adminspass[i] !== undefined) && (adminspass[i] !== null) && (adminspass[i] !=='')){
                        if (adminpass==adminspass[i]){   
                            okadmin=true;
                            admin=adminmail;
                            adminpassword=adminpass;
                            return 1;
                        }
                    }                    
                }
                return 0;
            } 
        }            
    }  
    return -1;                     
 }
 
 
// --------------------------------
function saisieLogin(mail=''){
// Saisie d'une adresse mail 

    console.debug("Saisie du Login");
    okadmin=false;
    admin=''; // toute saisie annule les autorisations antérieures
    let str='';
    str+='<p>Saisissez votre identifiant d\'administrateur.</p>';
    str+='<label for "adminmail">Courriel</label> <input type="text" id="adminmail" name="adminmail" value="'+mail+'" />';
    str+='&nbsp; &nbsp; <label for "adminpass">Mot de passe</label> <input type="password" id="adminpass" name="adminpass" size="10" value="" />';
    str+='<input type="hidden" id="idmodele" name="idmodele" value="'+idmodeleglobal+'">';
    str+='&nbsp; &nbsp; <button id="btnlogin">Valider</button></p>';

    document.getElementById("loginform").innerHTML = str;
 
    // Collecte des ID des moules sélectionnés
    const btnlogin = document.querySelector('#btnlogin');
        
    btnlogin.addEventListener('click', (event) => {
        let adminmail = document.querySelector('input[name="adminmail"]');
        let adminpass = document.querySelector('input[name="adminpass"]');
        if ((adminmail !== undefined) && (adminmail !== null) && (adminmail.value !== '')
            && (adminpass !== undefined) && (adminpass !== null) && (adminpass.value !== '')){
            if (verifLogin(adminmail.value, adminpass.value) === 1){
                afficheAdminEnv();
                return true;
            }
        } 
        return false;
    });    
}

// ------------------------------
function afficheAdminEnv(){
    if ((admin !== undefined) && (admin !== null) && (admin.length > 0)
        && (adminpassword !== undefined) && (adminpassword !== null) && (adminpassword.length > 0)
        && (okadmin !== undefined) && (okadmin !== null) && (okadmin === true)){
        //console.debug("Admin reconnu: "+admin);
        setCookie("sadmin", admin, 1); // 1 jour
        setCookie("sadminpass", adminpassword, 1); // 1 jour  
        document.getElementById("login").innerHTML = '<span class="surligne">'+admin+'</span>';
        document.getElementById("msg").innerHTML = 'Complétez chaque enregistrement par une photo et un numéro d\'inventaire unique.';
        document.getElementById("loginform").innerHTML = '';    
        formlogout();
        getModelesMoulesAdmin();
        if ((idmodeleglobal!==undefined) && (idmodeleglobal!==null) && (idmodeleglobal>0)){
            // Affiche le bouton d'ajout d'une image pour ce modèle 
            document.getElementById("myButton").innerHTML = '<button id="btnaddphoto">Ajouter une photo pour ce modèle</button>';        
            // Affiche le moule sélectionné 
            getModeleMoulesImages(idmodeleglobal); 
            editerThatModeleMoules(idmodeleglobal);
        }
    }
}                                                


