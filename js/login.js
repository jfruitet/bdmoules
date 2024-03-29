// JavaScript Document

/** 
 * 
 *  Authentification des utilisateurs 
 *  fait un appel à checklogine.php
 * 
 */


// --------------------------------
function formlogout(){
    //console.debug("Bouton Logout");
    let str='';
    str+='<p>&nbsp; <button class="button" id="btnlogout" onclick="return logout('+adminpage+');">Déconnexion</button></p>';
    document.getElementById("logout").innerHTML = str;
}
 

// --------------------------------
function logout(adminpage){
    console.debug("Logout confirmé");
    dellCookie("sadmin");
    dellCookie("role");
    dellCookie("usermail");
    
    if (admin==Courriel) {
        dellCookie("scourriel")
    }; 
    
    admin='';
    role=0;
    okvisiteur=true;
    okadmin=false;
    okauteur=false;
    oklecteur=false;
                        
    document.getElementById("logout").innerHTML = '&nbsp;';
    document.getElementById("login").innerHTML = '<span class="surligne">Accès réservé.</span>';
    boutonLogin(adminpage);
    document.getElementById("logout").innerHTML = '&nbsp; &nbsp;';
    if (adminpage==2){
        document.getElementById("scrollleft").style.display = "none";
        document.getElementById("scrollright").style.display = "none";    
    }            
    return true;   
}

 
/********************************************
 * Version obsloète n'utilisant pas la table bdm_user
 * 
 * Inconvénient : peu sûr
 * 
 * *****************************************/

/***********************
// --------------------------------
// Obsolète

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


// Obsolète
// --------------------------------
function getUserAutorisation(adminpage=0){
// Le courriel fourni par le cookie est-il reconnu ?
    //console.debug("Login : vérification Courriel: "+Courriel);
    admin='';
    adminpassword='';
    okadmin=false;
    if ((Courriel !== undefined) && (Courriel !== null) && (Courriel.length>0)){
        //console.debug("Vérification des droits attachés à un utilisateur");
        if (verifLogin(Courriel, '') === 0){ // Demander le mot de passe
            return saisieLogin(Courriel,adminpage); 
        }
    }     
    return false;  
} 
 
// Obsolète
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
 
 
 **********************/
 
 
/********************************************
 * Version utilisant un formulaire Post
 * 
 * Avantage : mise à jour la page appelante
 * 
 * *****************************************/
 
  // --------------------------------
 function boutonProfil(mail, adminpage){
    //console.debug("Saisie du profil");
    let str='';
    str+='<button class="button" id="btnprofil" onclick="return saisieProfil();">'+mail+'</button>';
    document.getElementById("login").innerHTML = str;
 }
  
// -------------------------------
function saisieProfil(){
    //console.debug("Saisie du profil");    
    //console.debug("Courriel: ",admin);
    if ((admin !== undefined) && (admin !== null) && (admin.length > 0)){
        getInfoUserByMail(admin);    
    }
}


// --------------------------------
function boutonLogin(adminpage){
    //console.debug("Saisie du Login");
    let str='';
    str+='<button class="button" id="btnlogin" onclick="return saisieLogin(adminpage);">Connexion</button>';
    document.getElementById("login").innerHTML = str;
}
  
// --------------------------------
function saisieLogin(adminpage=0){
// Saisie d'une adresse mail 

    //console.debug("Saisie du Login");
    switch(adminpage){
        case 1 : pageretour=pageadmin; break;
        case 2 : pageretour=pageuser; break;     
        default : pageretour=pageindex; break;      
    }
    
    okadmin=false;
    admin=''; // toute saisie annule les autorisations antérieures
    let str='';
    
    let url_check=url_serveur+'checklogin.php';
    str+='<p>Saisissez votre identifiant d\'utilisateur (votre <i>courriel</i>).</p>';
        
    str+='<form name="formLogin" action="'+url_check+'" method="post">';
    str+='<label for="usermail">Courriel</label> <input type="text" id="usermail" name="usermail" value="" />';
    str+='&nbsp; &nbsp; <label for="userpass">Mot de passe</label> <input type="password" id="userpass" name="userpass" size="10" value="" />';
    str+='<input type="hidden" name="appel" id="appel" value="'+pageretour+'"';
    str+='<div class="button">&nbsp; &nbsp; <input type="submit" name "Envoyer" value="Envoyer" onclick="return verifLogin();" /> &nbsp; &nbsp; <input type="reset" value="Réinitialiser"  />';
    str+='&nbsp; &nbsp; <input type="submit" name="NewPass" value="Mot de passe oublié" onclick="return verifMail();" />'; //<a href="'+url+'">Mot de passe oublié</a>
    str+='</div>';        
    str+='</form>';
    
    document.getElementById("loginform").innerHTML = str;
}


// ---------------------------------
function  verifMail(){
    fusermail=document.forms["formLogin"]["usermail"];               
    if ((fusermail === undefined) || (fusermail.value == ""))                                  
    { 
        alert("Complétez le courriel."); 
        fusermail.focus(); 
        return false; 
    }  
    return true;
}


// Valuer de retour : vrai ou faux
 // -------------------------------
 function verifLogin(){
    fusermail=document.forms["formLogin"]["usermail"];               
    fuserpass=document.forms["formLogin"]["userpass"];               
          
    if (fusermail.value == "")                                  
    { 
        alert("Complétez le courriel."); 
        fusermail.focus(); 
        return false; 
    }  
    
    if (fuserpass.value == "")                               
    { 
        alert("Complétez le mot de passe"); 
        fuserpass.focus(); 
        return false; 
    }   
        
    return true;                     
 }
 
// --------------------------------
function saisieNewPass(usermail){
// Saisie d'un nouveau mot de passe
    //console.debug("Saisie du Login");
    let str='';
    
    let url=url_serveur+'newpass.php';
    if ((usermal !== undefined) && (usermail.length>0)){
        str+='<p>Saisissez deux fois votre nouveau mot de passe.</p>';
        
        str+='<form name="formPass" action="'+url+'" method="post">';
        str+='&nbsp; &nbsp; <label for="pass">Nouveau mot de passe</label> <input type="password" id="pass" name="pass" size="10" value="" />';
        str+='&nbsp; &nbsp; <label for="pass2">Ressaisir S.V.P.</label> <input type="password" id="pass2" name="pass2" size="10" value="" />';    
        str+='<input type="hidden" name="appel" id="appel" value="../index.html"';
        str+='<input type="hidden" id="usermail" name="usermail" value="'+usermail+'" />';    
        str+='<div class="button">&nbsp; &nbsp; <input type="submit" name "Envoyer" value="Envoyer" onclick="return verifPass();" /> &nbsp; &nbsp; <input type="reset" value="Réinitialiser"  />';
        str+='</div>';        
        str+='</form>';
    
        document.getElementById("loginform").innerHTML = str;
    }        
}


// Valuer de retour : vrai ou faux
 // -------------------------------
 function verifPass(){
    let fusermail=document.forms["formPass"]["usermail"];               
    let fuserpass=document.forms["formPass"]["pass"];
    let fuserpass2=document.forms["formPass"]["pass2"];                
          
    if (fusermail.value == "")                                  
    { 
        alert("Courriel non renseigné."); 
        return false; 
    } 
    
    if (fuserpass.value == ""){ 
        alert("Complétez le mot de passe"); 
        fuserpass.focus(); 
        return false; 
    }  
    else {         
        if (fuserpass2.value == "") { 
            alert("Ressaisir ce mot de passe"); 
            fuserpass2.focus(); 
            return false; 
        }  
        else if (fuserpass1.value !== fuserpass2.value) {
            alert("Mots de passes différents"); 
            fuserpass2.focus(); 
            return false;         
        }
    }        
    return true;                     
 }


/********************************************
 * Version utilisant un appel Ajax Post
 * 
 * Inconvenient : plus difficile de mettre à jour la page appelante
 * 
 * *****************************************/

// --------------------------------
function saisieLoginAjax(mail='',adminpage=0){
// Saisie d'une adresse mail 

    //console.debug("Saisie du Login");
    okadmin=false;
    admin=''; // toute saisie annule les autorisations antérieures
    let str='';
    str+='<p><i>Votre identifiant est votre adresse courriel.</i></p>';
    str+='<label for="usermail">Courriel</label> <input type="text" id="usermail" name="usermail" value="'+mail+'" />';
    str+='&nbsp; &nbsp; <label for="userpass">Mot de passe</label> <input type="password" id="userpass" name="userpass" size="10" value="" />';
    str+='<input type="hidden" name="appel" id="appel" value="'+adminpage+'"';
    str+='&nbsp; &nbsp; <button id="btnlogin">Valider</button></p>';
    document.getElementById("loginform").innerHTML = str;
 
    // Collecte des ID des moules sélectionnés
    const btnlogin = document.querySelector('#btnlogin');
        
    btnlogin.addEventListener('click', (event) => {
        let usermail = document.querySelector('input[name="usermail"]');
        let userpass = document.querySelector('input[name="userpass"]');
        if ((usermail !== undefined) && (usermail !== null) && (usermail.value.length>0)
            && (userpass !== undefined) && (userpass !== null) && (userpass.value.length>0)){
            verifLoginAjax(usermail.value, userpass.value, adminpage);
            return true;
        } 
        return false;
    });    
}

  // Valuer de retour : -1 : non logé; 0 : verifier password ; 1: OK
 // -------------------------------
 function verifLoginAjax(usermail, userpass, adminpage=0){
    //console.debug("UserMail: "+usermail+", UsePass: "+userpass+" AdminPage:"+adminpage);
    if ((usermail !== undefined) && (usermail !== '') && (userpass !== undefined) && (userpass !== '')){
        let url=url_serveur+'checklogin.php'; 

        myInitPost.body = '{"usermail":"'+usermail+'", "userpass":"'+userpass+'"}';
        fetch(url, myInitPost)
        .then(response => response.text())  // Le retour est aussi une chaîne
        .then(response => {
                //console.debug(response);
                response = JSON.parse(response);
                if (response.ok==1){    // ça s'est ma cuisine interne                    
                    document.getElementById("consigne").innerHTML='Connexion effectuée <span class="surligne">&lt;'+usermail+'&gt; Rôle: <i>'+response.role+'</i></span> effectué.';
                    role=parseInt(response.role);
                    afficheAdminEnv(usermail, role, adminpage);
                }
            })
        .catch(error => console.debug("Erreur : "+error));
    }         
}

// ------------------------------
function afficheAdminEnv(usermail, role, adminpage){
    //console.debug("AfficheAdminEnv() Mail: "+usermail+" Rôle: "+role+" Adminpage: "+adminpage);
    if ((role > 0) && (role < 4))
    {
        // Statut de connexion à 1 pour lecteur, 2 pour auteur, 3 pour admin sinon 0: visiteur
        switch (role) {
            case 3 : okadmin=true; break;
            case 2 : okauteur=true; break;
            default : oklecteur=true; break;  
        }                   
        

        document.getElementById("login").innerHTML = '<span class="surligne">'+usermail+'</span>';
        document.getElementById("msg").innerHTML = 'Utilisateur connecté.';
        document.getElementById("loginform").innerHTML = '';    
        formlogout();
        if (adminpage==1){
            // administrer.html
            getModelesMoulesAdmin();
            if ((idmodeleglobal!==undefined) && (idmodeleglobal!==null) && (idmodeleglobal>0)){
                // Affiche le bouton d'ajout d'une image pour ce modèle 
                document.getElementById("myButton").innerHTML = '<button id="btnaddphoto">Ajouter une photo pour ce modèle</button>';        
                // Affiche le moule sélectionné 
                getModeleMoulesImages(idmodeleglobal); 
                editerThatModeleMoules(idmodeleglobal);
            }
        }
        else if (adminpage==2){
            // user.html
            document.getElementById("login").innerHTML = '<span class="surligne">'+admin+'</span>';
            formlogout();
            document.getElementById("msg").innerHTML = '';
            
            //console.debug("Admin reconnu. Afficher les utilisateurs");
            document.getElementById("scrollleft").style.display = "none";
            document.getElementById("scrollright").style.display = "block";
            getUsersAdmin();
        }
    }
}                                                



