// JavaScript Document
// ajax.js inclus dans index.html, administrer.html
// Appels Ajax sur la BD 
// Pas mal de fonctions supprimées par rapport à la version initiales

    

/**********************************************
 * 
 * MODELES - Ce BLOC est utilisé pour les fonctions de recherche
 * 
 *********************************************/
 
// Récupère les modèles disponibles
// ------------------------
function getModelesSearch() {    
        //console.debug("Chargement des modeles");
        var url= url_serveur+'getmodeles.php';
        var mydata="";    
        ajax_GetModelesSearch(url, mydata);         
}

// Lance l'appel Ajax et transmet les données reçues à setModeles
// Initialise le tableau tModeles
// -----------------------
function ajax_GetModelesSearch(url){ 
    if ((url !== undefined) && (url.length>0)){        
        // GET avec fetch()
        fetch(url, myInitGet)
        .then(response => response.text())  // Le retour est aussi une chaîne
        .then(response => {
            setModelesSearch(response);         
                    })  // tout le boulot se fait ici  dans le script  setModeles.js              
        .catch(error => console.debug("Erreur : "+error));
    }
}

// Rempli le tableau tModeles
// ----------------------- 
function setModelesSearch(response) {
    //console.debug("Affichage des modeles\n"+ response);
    // Traitement de la réponse 
     //  `bdm_modele` (`id`, `nom`, `descriptif`, `dimension`, `categorie`, `timestamp`) VALUES
    // (3, 'Asw 15', 'Asw 15 3m.\r\nMoule fuseau', '? x 300 x ?', 'planeur', '2024-01-19'),

    const objModele = JSON.parse(response);   
    tModelesSearch = []; 

    for(let i in objModele ) { 
        let tAux=[];
        tAux.push(objModele[i].id, objModele[i].nom, objModele[i].descriptif, objModele[i].categorie);
        tModelesSearch.push(tAux); 
    }; 
    AffFormSearchModeles();
}

// ----------------------- 
function AffFormSearchModeles(){
    if ((tModelesSearch !== undefined) && (tModelesSearch !== null) && (tModelesSearch.length>0)){        
        let str='<h4>Sélectionner un modèle</h4>';
        str+='<form name="SearchFormModeles">';
        str+='<select name="selectnom" id="selectnom" onchange="setIdModeleGlobal();">';
        str+='<option value="">--Sélectionnez au moins un nom--</option>';
        if ((idmodeleglobal !== undefined) && (idmodeleglobal > 0)){
            //console.debug("Modèle global Id:"+idmodeleglobal);
            for(let i in tModelesSearch){
                //console.debug(tModelesSearch[i]);
                if (tModelesSearch[i][0] == idmodeleglobal){
                    str+='<option value="'+tModelesSearch[i][0]+'" selected>'+tModelesSearch[i][1]+'</option>';        
                }
                else{
                    str+='<option value="'+tModelesSearch[i][0]+'">'+tModelesSearch[i][1]+'</option>'; 
                }
            }
        }
        else{
            //console.debug(tModelesSearch[i]);
            for(let i in tModelesSearch){
                str+='<option value="'+tModelesSearch[i][0]+'">'+tModelesSearch[i][1]+'</option>';        
            }       
        }    
        str+='</select>';               
        str+='</form>';
        document.getElementById("infomodelessearch").innerHTML = str;
    } 
}


// --------------------------------------------
function setIdModeleGlobal(){
    let modeleid = document.forms["SearchFormModeles"]["selectnom"];    
    //console.debug("Modèle sélectionné \n"+ document.forms["SearchFormModeles"]["selectnom"].value);           
    if ((modeleid !== undefined) && (modeleid !== null) && (modeleid.value !== '')  && (parseInt(modeleid.value) > 0 )){
        idmodeleglobal = parseInt(modeleid.value);          
        if (idmodeleglobal>0){
            setCookie("sidmodele", idmodeleglobal, 30); // 30 jours
            // Affiche le moule sélectionné 
            getModeleMoulesImages(idmodeleglobal); 
            reserverModeleMoules(idmodeleglobal);
        }          
    }        
}


// -----------------------------------
// Propage le choix du modèle
function setModeleSearch(idmodele){
    if ((idmodele !== undefined) && (idmodele>0)){
        idmodeleglobal=idmodele;
        setCookie("sidmodele", idmodeleglobal, 30); // 30 jours
        getModelesSearch();
    }     
}


/**********************************************
 * 
 * MOULES - Ce BLOC n'est pas utilisé
 * 
 *********************************************
 
// Récupère les moules disponibles
// ------------------------
function getMoules() {    
        //console.debug("Chargement des moules");
        var url= url_serveur+'getmoules.php';
        var mydata="";    
        ajax_GetMoules(url, mydata);         
}

// Lance l'appel Ajax et transmet les données reçues à setMoules
// Initialise le tableau tMoules
// -----------------------
function ajax_GetMoules(url){ 
    if ((url !== undefined) && (url.length>0)){        
        // GET avec fetch()
        fetch(url, myInitGet)
        .then(response => response.text())  // Le retour est aussi une chaîne
        .then(response => {
            setMoules(response);         
                    })  // tout le boulot se fait ici  dans le script  setMoules.js              
        .catch(error => console.debug("Erreur : "+error));
    }
}

// Rempli le tableau tMoules
// ----------------------- 
function setMoules(response) {
//console.debug("Affichage des moules\n"+ response);
// Traitement de la réponse 
//`bdm_moule` (`idmoule`, `ref_modele`, `numero_inventaire`, `mdescription`, `mlieu`, `matiere`, `etat`, `longueur`, `poids`, `commentaire`) VALUES
//(1, 20, 9, 'Moule capot moteur, composite', 'La Minais', '', 'Excellent', NULL, NULL, ''),

    const objMoule = JSON.parse(response);   
    tMoules = []; 

    for(let i in objMoule ) { 
        tMoules.push(i, objMoule[i].idmoule, objMoule[i].ref_modele, objMoule[i].mdescription, objMoule[i].mlieu, objMoule[i].matiere, objMoule[i].etat, objMoule[i].longueur, objMoule[i].poids, objMoule[i].commentaire); 
    }; 
    document.getElementById("infomoules").innerHTML = tMoules; 
}

*****************************************/

/**********************************************
 * 
 * Les MODELES ET LEURS MOULES - Affichages et sélections
 * 
 *********************************************/
 


// Récupère et affiche tous les modèles et leurs moules associés avec les boutons de réservation
// si ce n'est pas un visiteur
// ------------------------
function getModelesMoules() {    
        //console.debug("Chargement des modeles et de leurs moules");
        var url= url_serveur+'getmodelesmoules.php';
        var mydata="";    
        ajax_GetModelesMoules(url, mydata);         
}

// Lance l'appel Ajax et transmet les données reçues à setModelesMoules
// Initialise le tableau tModelesMoules
// -----------------------
function ajax_GetModelesMoules(url){ 
    if ((url !== undefined) && (url.length>0)){        
        // GET avec fetch()
        fetch(url, myInitGet)
        .then(response => response.text())  // Le retour est aussi une chaîne
        .then(response => {
            setModelesMoules(response);         
                    })  // tout le boulot se fait ici  dans le script  setModelesMoules.js              
        .catch(error => console.debug("Erreur : "+error));
    }
}

// Remplit le tableau tModelesMoules
// Appelé par ajax_GetModelesMoules();
// Appelle selectModelesModules(); 
// ----------------------- 
function setModelesMoules(response) {
    // console.debug("Affichage des modeles et des moules associés\n"+ response);
    // Traitement de la réponse 
    //  bdm_modele.id, bdm_modele.nom, bdm_modele.descriptif, bdm_modele.categorie, 
    //        bdm_moule.idmoule, bdm_moule.numero_inventaire, bdm_moule.mdescription, bdm_moule.mlieu, bdm_moule.matiere, bdm_moule.etat, bdm_moule.longueur, bdm_moule.poids, bdm_moule.commentaire  
 
    const objModeleMoule = JSON.parse(response);   
    tModelesMoules = []; 
    tAux = [];
    for(let i in objModeleMoule ) { 
        //tModelesMoules.push(i, objModeleMoule[i].id, objModeleMoule[i].nom, objModeleMoule[i].descriptif, objModeleMoule[i].dimension, objModeleMoule[i].categorie, objModeleMoule[i].idmoule, objModeleMoule[i].numero_inventaire, objModeleMoule[i].mdescription, objModeleMoule[i].mlieu, objModeleMoule[i].matiere, objModeleMoule[i].etat, objModeleMoule[i].longueur, objModeleMoule[i].poids, objModeleMoule[i].commentaire);
        tAux = [];
        tAux.push(objModeleMoule[i].id, objModeleMoule[i].nom, objModeleMoule[i].descriptif, objModeleMoule[i].dimension, objModeleMoule[i].categorie, objModeleMoule[i].idmoule, objModeleMoule[i].numero_inventaire, objModeleMoule[i].mdescription, objModeleMoule[i].mlieu, objModeleMoule[i].matiere, objModeleMoule[i].etat, objModeleMoule[i].longueur, objModeleMoule[i].poids, objModeleMoule[i].commentaire);       
        tModelesMoules.push(tAux); 
    }; 
        
    document.getElementById("myListModeles").innerHTML = selectModelesMoules();
}

// -----------------------
function selectModelesMoules(){
// Affiche une table de modèles et de leurs moules
// Deux boutons de sélection
// Les images associées
    //console.debug("Sélection d'un modèle et des moules associés\n"); 
    let compteurmodele=0;
    let str='<p><b>Modèles</b> &nbsp; &nbsp;';
    str+='<table>';
    if ((tModelesMoules !== undefined) && (tModelesMoules.length>0)){ 
        for (let i in tModelesMoules) { 
            if (i % 6 == 0){
                str+='<tr><th colspan="5">Choisir un Modèle</th><th colspan="9">Réserver un Moule</th></tr>';
                str+='<tr><th>ID Modèle</th><th>Nom</th><th width="30%">Descriptif</th><th>Dimensions</th><th>Catégorie</th><th>ID Moule</th><th>N°</th><th>Description</th><th>Lieu stockage</th><th>Matière</th><th>Etat</th><th>Longueur</th><th>Poids</th><th>Commentaire</th></tr>';
            }
            str+='<tr>';
            for (let j in tModelesMoules[i]) {  
                //console.debug(tModelesMoules[i]+"\n");
                var idmodele=tModelesMoules[i][0];
                var idmoule=0;
                if ((tModelesMoules[i][5] !== undefined) && (tModelesMoules[i][5] !== null)){
                    idmoule = tModelesMoules[i][5]; 
                } 
                // Modèle                
                if (j<5) { // idmodele
                    if ((i==0) || (i>0) && (tModelesMoules[i][0] !== tModelesMoules[i-1][0])){
                        // Nouvelle ligne de modèle                             
                        if (j==0) { // idmodele
                            str+='<td><button name="modele'+idmodele+'" onclick="getModeleMoulesImages('+idmodele+'); reserverModeleMoules('+idmodele+'); setModeleSearch('+idmodele+');">'+idmodele+'</button></td>';
                            compteurmodele++;  
                        }
                        else {
                            str+='<td>';
                            if (tModelesMoules[i][j] !== null){
                                str+=tModelesMoules[i][j]+'</td>';
                            }
                            else{
                                str+='<td>&nbsp;</td>';
                            }                
                        }
                    }
                    else{
                        str+='<td>&nbsp;</td>';
                    }                    
                }
                else { // Moule
                    if ((j==5) && (idmoule>0)) { // idmoule
                        str+='<td><button name="moule'+idmoule+'" onclick="getThatMoule('+idmoule+');">'+idmoule+'</button></td>';
                    }
                    else{
                        if (tModelesMoules[i][j] != null){
                            str+='<td>'+tModelesMoules[i][j]+'</td>';
                        }
                        else{
                            str+='<td>&nbsp;</td>';
                        }  
                    }
                }              
            }     
            str+='</tr>';
        }
    }  
    str+='</table>';      
    return str;        
}


/**********************************************
 * 
 * RECUPERE UN MOULE par son id
 * 
 *********************************************/
 
// Récupère le moule 
// ------------------------
function getThatMoule(idmoule) {    
    //console.debug("GetThatMoule: "+idmoule);
    if (idmoule!==undefined){
        idmoule=parseInt(idmoule); 
                      
        if (idmoule>0){
            setCookie("sidmoule", idmoule, 30); // 30 jours
            var url= url_serveur+'getthatmoule.php';
            var mydata="?idmoule="+idmoule; 
            //console.debug("URL: "+url);
            //console.debug("MyData: "+mydata);   
            ajax_GetThatMoule(url, mydata);
        }       
    }      
}

// Lance l'appel Ajax et transmet les données reçues à setModelesMoules
// Appelle setThatMoule
// -----------------------
function ajax_GetThatMoule(url, mydata){ 
    if ((url !== undefined) && (url.length>0) && (mydata !== undefined) && (mydata.length>0)){
        // GET avec fetch()
        fetch(url+mydata, myInitGet)
        .then(response => response.text())  // Le retour est aussi une chaîne
        .then(response => {
            //console.debug ("\n"+response+"\n");
            setThatMoule(response);  
                    })  // as usual...              
        .catch(error => console.debug("Erreur : "+error));
    }
}

// ----------------------- 
// Remplit le tableau tMoule
// Appelle affThatMoule(); 
function setThatMoule(response) {
    //console.debug("Affichage du moule\n");
    //console.debug(response);
    // Traitement de la réponse  
    //        bdm_moule.idmoule, bdm_moule.numero_inventaire, bdm_moule.mdescription, bdm_moule.mlieu, bdm_moule.matiere, bdm_moule.etat, bdm_moule.longueur, bdm_moule.poids, bdm_moule.commentaire  
 
    const objMoule = JSON.parse(response);   
    tMoule = []; 
 
    for(let i in objMoule ) { 
        //console.debug(i+', '+objMoule[i].idmoule+', '+objMoule[i].numero_inventaire+', '+objMoule[i].mdescription+', '+objMoule[i].mlieu+', '+objMoule[i].matiere+', '+objMoule[i].etat+', '+objMoule[i].longueur+', '+objMoule[i].poids+', '+objMoule[i].commentaire);        
        tAux = [];
        tAux.push(objMoule[i].ref_modele, objMoule[i].idmoule, objMoule[i].numero_inventaire, objMoule[i].mdescription, objMoule[i].mlieu, objMoule[i].matiere, objMoule[i].etat, objMoule[i].longueur, objMoule[i].poids, objMoule[i].commentaire);        
        tMoule.push(tAux); 
        getMouleImages(objMoule[i].idmoule); // Images associées à ce moule
    }; 
    
    // Tableau 
    if ((document.getElementById("infomoules")!==undefined) && (document.getElementById("infomoules").length>0)) {
        document.getElementById("infomoules").innerHTML = affThatMoule(tMoule);
    } 
}


// -----------------------
// Appelé par setThatMoule()
function affThatMoule(tMoule){
    //console.debug("Affichage du moule sélectionné\n");
    let str='';
    //str+='<table><tr><th>N°</th><th>ID Modèle</th><th>Nom</th><th>Descriptif</th><th>Dimensions</th><th>Catégorie</th><th>ID Moule</th><th>Inventaire</th><th>Description</th><th>Lieu stockage</th><th>Matière</th><th>Etat</th><th>Longueur</th><th>Poids</th><th>Commentaire</th></tr>';
    str+='<table><tr><th>&nbsp;</th><th>ID Moule</th><th>Num. inventaire</th><th>Description</th><th>Lieu stockage</th><th>Matière</th><th>Etat</th><th>Longueur</th><th>Poids</th><th>Commentaire</th></tr>';
    
    if ((tMoule !== undefined) && (tMoule.length>0)){ 
        for (let i in tMoule) {
            // str+='<tr><td colspan="14">'+tModelesMoules[i]+'</td></tr>'; 
            str+='<tr>';
            for (let j in tMoule[i]) {  
                //console.debug(tMoule[i]+"\n");
                var idmoule=tMoule[i][1];
                var idmodele=tMoule[i][0];
                if (j==0) { // checkbox
                    if (!okvisiteur){
                        str+='<td><button name="reservationmoule'+idmoule+'" onclick="reserverMoule('+idmodele+','+idmoule+');">Réserver</button></td>';
                    }
                    else{
                        str+='<td>&nbsp;</td>';
                    }              
                }
                
                else
                if (tMoule[i][j] != null){
                    str+='<td>'+tMoule[i][j]+'</td>';
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


// Appelé par selectModelesMoules()
// Affiche la liste de moules avec une checkbox de sélection
// ----------------------------------
function reserverModeleMoules(idmodele){
// Récupère la liste des moules associés à ce modèle
    if ((idmodele !== undefined) && (idmodele>0)){
        getThatModeleMoules(idmodele);
    }     
}


/********************************************
 * 
 * RESERVATION DES MOULES ASSOCIES A UN MODELE
 * 
 *  N'utilise pas de serveur SMTP
 *  
 * 
 * ******************************************/
 
 
// Récupère et affiche tous les moules associés à un modèle donné
// ------------------------
function getThatModeleMoules(idmodele) {    
        //console.debug("Chargement des moules");
        var url= url_serveur+'getmodelemoules.php?idmodele='+idmodele;
        var mydata="";    
        ajax_GetThatModeleMoules(url);         
}

// Lance l'appel Ajax et transmet les données reçues à setThatModeleMoules
// -----------------------
function ajax_GetThatModeleMoules(url){ 
    if ((url !== undefined) && (url.length>0)){        
        // GET avec fetch()
        fetch(url, myInitGet)
//        .then(response => response.text())  // Le retour est aussi une chaîne
        .then(response => response.json())
        .then(response => {
            selectThatModeleMoules(response);         
                    })  // Formulaire checkbox             
        .catch(error => console.debug("Erreur : "+error));
    }
}


// Appelé par ajax_GetThatModeleMoules();
// Modifie idmodeleglobal
// Modifie modeledescription
// Remplit le tableau tidmoules
// Remplit le tableau tdescription
// Appelle getInfoUser(admin,setUserReserverMoule)
// puis indirectement reserverThatMoules() avec un Ajax et un CallBack setUserReserverMoule() 

// ----------------------- 
function selectThatModeleMoules(response) {
    // console.debug("Affichage des modeles et des moules associés\n"+ response);
    // Traitement de la réponse 
    const objModele = response.modele;
    if (objModele != undefined && objModele!==null){
        idmodeleglobal=objModele.id; 
        modeledescription='Modèle N°'+objModele.id+', '+objModele.nom+', '+objModele.descriptif;
    } 
       
    //        bdm_moule.idmoule, bdm_moule.numero_inventaire, bdm_moule.mdescription, bdm_moule.mlieu, bdm_moule.matiere, bdm_moule.etat, bdm_moule.longueur, bdm_moule.poids, bdm_moule.commentaire        
    const objModeleMoule = response.moules;
    let tThatModeleMoules = [];     
    for(let i in objModeleMoule ) { 
        let tAux = [];
        tAux.push(objModeleMoule[i].ref_modele, objModeleMoule[i].idmoule, objModeleMoule[i].numero_inventaire, objModeleMoule[i].mdescription, objModeleMoule[i].mlieu, objModeleMoule[i].matiere, objModeleMoule[i].etat, objModeleMoule[i].longueur, objModeleMoule[i].poids, objModeleMoule[i].commentaire);         
        tThatModeleMoules.push(tAux);  
        // idmodeleglobal=objModeleMoule.ref_modele;    
    }; 
    
    let str='';
    //str+='<p>Sélectionnez les moules à réserver</p>';
    if (!okvisiteur){
        str+='<p><button id="btn">Réserver</button>  &nbsp; (<a target="_blank" href="help.html#Prêt">?</a>)</p>';
    }
    else{
        str+='<p><b>Moules</b> <a href="login.html">Identifiez-vous</a> pour accéder au <a target="_blank" href="help.html#Prêt">prêt</a></p>';    
    }
    str+='<table><tr><th>Choisir</th><th>ID Moule</th><th>Num. inventaire</th><th>Description</th><th>Lieu stockage</th><th>Matière</th><th>Etat</th><th>Longueur</th><th>Poids</th><th>Commentaire</th></tr>';
    
    if ((tThatModeleMoules !== undefined) && (tThatModeleMoules.length>0)){ 
        for (let i in tThatModeleMoules){
            str+='<tr>';
            for (let j in tThatModeleMoules[i]) {  
                //console.debug(tThatModeleMoules[i]+"\n");
                var idmodele=tThatModeleMoules[i][0];
                var idmoule=tThatModeleMoules[i][1];
                if (j==0) { // checkbox
                    if (!okvisiteur){
                        str+='<td><input type="checkbox" id="idmoule'+idmoule+'" name="idmoule" value="'+idmoule+'" checked /></td>';
                    }
                    else{
                        str+='<td>(<a target="_blank" href="help.html#Prêt">?</a>)</td>';
                    }
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
    str+='<input type="hidden" id="idmodele" name="idmodele" value="'+idmodeleglobal+'">';  
         

    document.getElementById("infomoules").innerHTML = str;
    document.getElementById("consigne").innerHTML = 'Modèle sélectionné: <b>'+idmodeleglobal+'</b>. Sélectionnez les moules à réserver';
    
    if (!okvisiteur){
        // Collecte des ID des moules sélectionnés
        const btn = document.querySelector('#btn');
        
        btn.addEventListener('click', (event) => {
            let checkboxes = document.querySelectorAll('input[name="idmoule"]:checked');
            tidmoules = [];        
            checkboxes.forEach((checkbox) => {
                tidmoules.push(checkbox.value);
            });
            //console.debug("idmoules\n"+idmoulesvalues);
        
            // Collecte des descriptions de moules sélectionnés
            tdescription = [];
            if (tidmoules.length>0){
                for (let j in tidmoules){
                    for (let i in tThatModeleMoules){    
                        if (tidmoules[j]==tThatModeleMoules[i][1]){                       
                            //idmouleglobal=tidmoules[j];
                            tAux= [];
                            tAux.push(tThatModeleMoules[i][1],tThatModeleMoules[i][2],tThatModeleMoules[i][3],tThatModeleMoules[i][4]);
                            tdescription.push(tAux);
                        }           
                    }
                }        
            }    
            // Charger les informations sur l'utilisateur connecté
            if ((admin !==undefined) && (admin.length>0)){
                getInfoUser(admin);
            }
            // reserverThatMoules(); // Déplacé dans ajax3.js 
        });
    }                
} 
 
//-----------------------------------------
// Affiche un formulaire de réservation
function reserverThatMoules(){
    //console.debug("reserverThatMoule()");
    //console.debug("idmodele: "+idmodeleglobal);
    //console.debug("modeledescription: "+modeledescription);
    //console.debug("tidmoules: "+tidmoules);
    //console.debug("tdescription: "+tdescription);
    
    if ((idmodeleglobal !== undefined) && (idmodeleglobal>0) && (tidmoules!==undefined) && (tidmoules.length>0)){ // idmodele=37; tidmoules=[46,47];
        document.getElementById("myFile").innerHTML = ''; // A n'utiliser que si des recommandations sont nécessaires
        
        let str='';
        // Creer un formulaire de réservation
        str+='<h4>Complétez ce formulaire de réservation</h4>';
        str+='<form name="RegForm" action="">';
        str+='<div class="button"><button onclick="return validationReservationMultiple();">Réserver</button>'; 
        str+='&nbsp; &nbsp; <button onclick="return resetForm();">Annuler</button></div>';        
                      
        str+='<div><label for="Nom">NOM Prénom: </label><br /><input type="text" id="Nom" size="50" name="Nom" value="'+Nom+'" autocomplete="on" />';
        str+='<br /><label for="Adresse">Adresse: </label><br /><input type="text" id="Adresse" size="50" name="Adresse" value="'+Adresse+'" autocomplete="on" />';
        str+='<br /><label for="Courriel">Adresse électronique:</label><br /><input type="text" id="Courriel" size="50" name="Courriel" value="'+Courriel+'" autocomplete="on" />';
        str+='<br /><label for="Telephone">Téléphone: </label><br /><input type="text" id="Telephone" size="50" name="Telephone" value="'+Telephone+'" autocomplete="on" />';
        str+='<br /><label for="Commentaire">Commentaires: </label><br />(<i><span class="small">Motivez votre demande...</span></i>)<textarea cols="50" id="Commentaire" rows="3" name="Commentaire" autocomplete="on">'+Commentaire+'</textarea>';
        str+='</div>';
        str+='<input type="hidden" id="userid" name="userid" value="'+userid+'">';
        str+='<input type="hidden" id="idmodele" name="idmodele" value="'+idmodeleglobal+'">';
        /*
        for (let i=0; i<tidmoules.length; i++){
            str+='<type="hidden" id="idmoule'+tidmoules[i]+' name="idmoule'+tidmoules[i]+'" value="'+tidmoules[i]+'">';
        }
        for (let i=0; i<tdescription.length; i++){
            str+='<type="hidden" id="description'+tdescription[i]+' name="description'+tdescription[i]+'" value="'+tdescription[i]+'">';
        }
        */  
        str+='</form>';
        
        str+='<p><b>Moules réservés</b></p><ul>';
        str+='<li>'+modeledescription+'<ol>';
        for (let i=0; i<tdescription.length; i++){
            str+='<li>ID:'+tdescription[i][0]+', Inventaire: '+tdescription[i][1]+', Description: '+tdescription[i][2]+', '+tdescription[i][3]+'</li>';
        }
        str+='</li></ol></ul>';        
        document.getElementById("myImage").innerHTML = str;
    }

}

// ----------------------------------
function resetForm(){
// Verifie que les champs du formualaire sont remplis
    document.forms["RegForm"]["Nom"];               
    email = document.forms["RegForm"]["Courriel"];    
    phone = document.forms["RegForm"]["Telephone"];   
    adresse = document.forms["RegForm"]["Adresse"];  
    comment = document.forms["RegForm"]["Commentaire"];      

    if (nom.value != "")                                  
    { 
        nom.value="";         
    }    
    if (adresse.value != "")                               
    { 
        adresse.value = "";
    }        
    if (email.value != "")                                   
    { 
        email.value = "";
    }    
    if (phone.value != "")                           
    { 
        phone.value = "";
    }    
    if (comment.value != "")                  
    { 
        comment.value = "";
    } 
    // Variables globales et Cookies
    Nom = '';               
    Courriel = '';    
    Telephone = '';   
    Adresse = '';  
    Commentaire = '';
    setCookies();        
    nom.focus();
    return true; 
}

// ----------------------------------
function validationReservationMultiple(){
// Verifie que les champs du formualaire sont remplis

    // Variables globales
    nom = document.forms["RegForm"]["Nom"];               
    email = document.forms["RegForm"]["Courriel"];    
    phone = document.forms["RegForm"]["Telephone"];   
    adresse = document.forms["RegForm"]["Adresse"];  
    comment = document.forms["RegForm"]["Commentaire"];      

    if (nom.value == "")                                  
    { 
        alert("Mettez votre nom."); 
        nom.focus(); 
        return false; 
    }    
    if (adresse.value == "")                               
    { 
        alert("Mettez votre adresse."); 
        adresse.focus(); 
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
    Courriel = document.forms["RegForm"]["Courriel"].value;    
    Telephone = document.forms["RegForm"]["Telephone"].value;   
    Adresse = document.forms["RegForm"]["Adresse"].value;  
    Commentaire = document.forms["RegForm"]["Commentaire"].value;
    setCookies();
    // Mise à jour de la BD   
    if ((document.forms["RegForm"]["userid"] !== undefined) && (document.forms["RegForm"]["userid"].value>0)){
        let userid = document.forms["RegForm"]["userid"].value;
        let majUser = '{"userid":'+userid+', "usernom":"'+Nom+'", "userlogin":"'+Courriel+'", "telephone":"'+Telephone+'", "adresse":"'+Adresse+'"}';
        ajax_MajUser(majUser);  // Mise à jour de la table bdm_user
    }
    redigeReservationMultiple();
    return true; 
}

// ----------------------------------
function redigeReservationMultiple(){
// Redige un courriel envoyé par <a href="mailto: etc.
    //console.debug("redigeReservationMultiple()");
    //console.debug("idmodele: "+idmodeleglobal);
    //console.debug("modeledescription: "+modeledescription);
    //console.debug("tidmoules: "+tidmoules);
    //console.debug("tdescription: "+tdescription);

    if ((tdescription!==undefined) && (tdescription.length>0)){        
        let str='';
        let strmsg='';
        //console.debug("Rédaction du courriel de réservation");        
        str+='<p><b>Modèle concerné</b><br />'+modeledescription+'</p><p><ol>Moules';
        strmsg+='Modèle concerné: '+"\n"+modeledescription+"\nMoules:\n";
        for (let i=0; i<tdescription.length; i++){
            str+='<li>Moule ID:'+tdescription[i][0]+' Inventaire: '+tdescription[i][1]+' Description: '+tdescription[i][2]+', '+tdescription[i][3]+'</li>';
            strmsg+='Moule ID:'+tdescription[i][0]+' Inventaire: '+tdescription[i][1]+' Description: '+tdescription[i][2]+', '+tdescription[i][3]+"\n";
        }
        str+='</ol><br />';
        
        //console.debug(str);        
        //let thatbody= 'Nom: '+Nom+'%0A%0ACourriel: '+Courriel+'%0A%0ATéléphone: '+Telephone+'%0A%0AAdresse: '+Adresse+'%0A%0ACommentaire '+Commentaire+'%0A%0A'+strmsg;
        let thatbody= encodeURIComponent("Demande de réservation de moules effectuée par \nNom: "+Nom+"\nCourriel: "+Courriel+"\nTéléphone: "+Telephone+"\nAdresse: "+Adresse+"\nCommentaire: "+Commentaire+"\n\n"+strmsg);
        //console.debug("Message body\n"+thatbody);
        document.getElementById("myImage").innerHTML = '<h4>Cliquez sur le lien pour envoyer cette demande de réservation</h4><p>'+str;
        //document.getElementById("myImage").innerHTML +='<br /><span class="surligne"><a href="mailto:'+courriel_reservation+'?cc='+courriel_webmaster+'&subject='+encodeURIComponent("Réservation Moules")+'&body='+thatbody+'">Envoyer</a></surligne></p>';                      
        document.getElementById("myImage").innerHTML +='<br /><a class "button" href="mailto:'+courriel_reservation+'?cc='+courriel_webmaster+'&subject='+encodeURIComponent("Réservation Moules")+'&body='+thatbody+'">Envoyer</a></p>';                      
    }           
}


// ----------------------- 
function ajax_MajUser(mystrjson){ 
let url='./php/setuser.php';    
    if ((url !== undefined) && (url.length>0) && (mystrjson !== undefined) && (mystrjson.length>0)){        
        // POST avec fetch()
        // myInitPost.body: JSON.stringify(mystrjson), // turn the JS object literal into a JSON string
        myInitPost.body= mystrjson; // mystrjson est déjà une chaîne
        fetch(url, myInitPost)
        .then(response => response.text())  // Le retour est aussi une chaîne
        .then(response => {
                console.debug("Mise à jour table bdm_user");
                console.debug(response);
                response=JSON.parse(response);
                if (response.ok==1){    // ça s'est ma cuisine interne                    
                    document.getElementById("consigne").innerHTML=" <span class=\"surligne\">Mise à jour de la table utilisateur effectuée (Utilisateur ID <i>"+response.userid+"</i>).</span>  ";
                }
            })
        .catch(error => console.debug("Erreur : "+error));
    }
}
    


/**********************************************
 * 
 * VERSION Avec Appel Get ou Post en erreur
 * 
 * ********************************************/



/*
// -----------------------
// Non utilisé
// Utilise la variable globale tMoules
function affThatMoules(){
    //console.debug("Affichage des moules sélectionnés\n");
    let str='';
    //str='<table><tr><th>N°</th><th>ID Modèle</th><th>Nom</th><th>Descriptif</th><th>Dimensions</th><th>Catégorie</th><th>ID Moule</th><th>Inventaire</th><th>Description</th><th>Lieu stockage</th><th>Matière</th><th>Etat</th><th>Longueur</th><th>Poids</th><th>Commentaire</th></tr>';
    str='<table><tr><th>&nbsp;</th><th>ID Moule</th><th>Inventaire</th><th>Description</th><th>Lieu stockage</th><th>Matière</th><th>Etat</th><th>Longueur</th><th>Poids</th><th>Commentaire</th></tr>';
    
    if ((tMoules !== undefined) && (tMoules.length>0)){ 
        for (let i in tMoules) {
            // str+='<tr><td colspan="14">'+tMoules[i]+'</td></tr>'; 
            str+='<tr>';
            for (let j in tMoules[i]) {  
                //console.debug(tMoules[i]+"\n");
                if (j==0) { // checkbox
                    str+='<td>A Checker '+tMoules[i][j]+'</a></td>';
                }
                else
                if (tMoules[i][j] != null){
                    str+='<td>'+tMoules[i][j]+'</td>';
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
*/

/*************************************************
 * 
 * RESERVATION
 * 
 *************************************************/
 
 /**************************************************************
 * 
 * VALIDATION DE FORMULAIRE
 * 
 * ************************************************************/

/**************************** Version 1 avec post
function validationReservation()  {                                  

    var nom = document.forms["RegForm"]["Nom"];               
    var email = document.forms["RegForm"]["Courriel"];    
    var phone = document.forms["RegForm"]["Telephone"];   
    var adresse = document.forms["RegForm"]["Adresse"];  
    var comment = document.forms["RegForm"]["Commentaire"];  

    if (nom.value == "")                                  
    { 
        alert("Mettez votre nom."); 
        nom.focus(); 
        return false; 
    }    
    if (adresse.value == "")                               
    { 
        alert("Mettez votre adresse."); 
        adresse.focus(); 
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
    
   // Et hop c'est parti...
    envoiReservation();
    return true; 
}

// ----------------------- 
function envoiReservation(){
// envoie le contneu JSON de la demande de réservation au serveur
    console.debug("envoiReservation()");
    
    var mystrjson='';

    var nom = document.forms["RegForm"]["Nom"].value;               
    var email = document.forms["RegForm"]["Courriel"].value;    
    var phone = document.forms["RegForm"]["Telephone"].value;   
    var adresse = document.forms["RegForm"]["Adresse"].value;  
    var comment = document.forms["RegForm"]["Commentaire"].value; 
    var idmodele = document.forms["RegForm"]["idmodele"].value;               
    var idmoule = document.forms["RegForm"]["idmoule"].value;               

    mystrjson+='{"idmodele":"'+idmodele+'", "idmoule":"'+idmoule+'", Nom":"'+nom+'", "Courriel":"'+email+'", "Telephone":"'+phone+'", "Adresse":"'+adresse+'", "Commentaire":"'+comment+'"}';
    console.debug("JSON:"+mystrjson+"\n");
        
    var url= url_serveur+'reservation.php';
    console.debug("URL: "+ url);
    ajax_post(url, mystrjson);
    
 }
 




//--------------------------------
function validationReservation()  {                                  

    nom = document.forms["RegForm"]["Nom"];               
    email = document.forms["RegForm"]["Courriel"];    
    phone = document.forms["RegForm"]["Telephone"];   
    adresse = document.forms["RegForm"]["Adresse"];  
    comment = document.forms["RegForm"]["Commentaire"];  
    
    if (nom.value == "")                                  
    { 
        alert("Mettez votre nom."); 
        nom.focus(); 
        return false; 
    }    
    if (adresse.value == "")                               
    { 
        alert("Mettez votre adresse."); 
        adresse.focus(); 
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
    getInfosMoulesModele();
    //envoiReservationMailto();
    return true; 
}

// -----------------------
function  getInfosMoulesModele(){
    let url= '';
    if ((idmodele!==undefined) && (idmodele>0)){
        if ((tidmoules!==undefined) && (tidmoules.length>0)){
            let sidmoules= tidmoules.join();   
            url= url_serveur+'infomodelemoules.php?idmodele='+idmodele+'&sidmoules='+sidmoules;
        }
        else{
            url= url_serveur+'infomodelemoules.php?idmodele='+idmodele;        
        }
        console.debug("URL: "+ url);
        ajax_GetInfoModeleMoules(url);

        // Récupère quelques infos concerant le modèle et les mooules sélectionnés
         
    }
}

// Requête par GET
// Lance l'appel Ajax et transmet les données reçues à setModeles
// Initialise le tableau tModeles
// -----------------------
function ajax_GetInfoModeleMoules(url){ 
    if ((url !== undefined) && (url.length>0)){        
        // GET avec fetch()
        fetch(url, myInitGet)
        .then(response => response.text())  // Le retour est aussi une chaîne
        .then(response => {
        JSON.parse(response);
        if ((response.Ok==1) && (response.data!==undefined) && (response.data.length>0)){
            redigeReservation(response);
        }         
                    })  // tout le boulot se fait ici  dans le script  setModeles.js              
        .catch(error => console.debug("Erreur : "+error));
    }
}



//-----------------------------------------
function reserverMoule(idmodele, tidmoule){
    if ((idmodele !== undefined) && (idmodele>0) && (tidmoules!==undefined) && (tidmoules.length>0)){ // idmodele=37; tidmoules=[46,47];
        let str='';
        // Creer un formulaire de réservation
        str+='<h4>Complétez ce formulaire de réservation</h4>';
        str+='<form name="RegForm" action="" onsubmit="return validationReservation()" method="post" class="w3docs">';
        str+='<div><label for="Nom">NOM Prénom:</label><input type="text" id="Nom" size="50" name="Nom" autocomplete="on" /></div>';
        str+='<br /><div><label for="Adresse">Adresse:</label><input type="text" id="Adresse" size="50" name="Adresse" autocomplete="on" /></div>';
        str+='<br /><div><label for="Courriel" l>Adresse électronique:</label><input type="text" id="Courriel" size="50" name="Courriel" autocomplete="on" /></div>';
        str+='<br /><div><label for="Telephone">Téléphone: </label><input type="text" id="Telephone" size="50" name="Telephone" autocomplete="on" /></div>';
        str+='<br /><div><label for="Commentaire">Commentaires: (<i><span class="small">Motivez votre demande...</span></i>) </label><textarea cols="50" id="Commentaire" rows="5" name="Commentaire" autocomplete="on"></textarea></div>';
        str+='<b>Cochez les moules à réserver</b>';
        for (let i=0; i<tidmoules.length; i++){
            str+='<label for="idmoule'+tidmoules[i]+'">Moule ID'+tidmoules[i]+'</label> ';
            str+='<input type="checkbox" id="idmoule'+tidmoules[i]+'" name="idmoule'+tidmoules[i]+'" value="'+tidmoules[i]+'" checked />';
        }
        str+='<div class="buttons"><input type="submit" value="Envoyer" name="Envoyer" /><input type="reset" value="Réinitialiser" name="Reset" /></div>';
        str+='<input type="hidden" id="idmodele" name="idmodele" value="'+idmodele+'">';
        
        str+='</form>';
        
        document.getElementById("myImage").innerHTML = str;
    }

}


// ----------------------- 
function redigeReservation(){
// 
    console.debug("redigeReservation()");
    
    let body='%0A%0ANom: '+nom.value+'%0A%0ACourriel: '+email.value+'%0A%0ATéléphone: '+phone.value+'%0A%0AAdresse: '+adresse.value+'%0A%0ACommentaire '+comment.value;
    body+='%0A%0A'+JSON.stringify(response);
    
    console.debug("body\n");
    document.getElementById("consigne").innerHTML = '<a href="mailto:bureau-arbl@laposte.net?cc=jean.fruitet@free.fr&subject=Réservation moules&body='+body+'>Envoyer Courriel</a>';
      
}      

******************************************/



