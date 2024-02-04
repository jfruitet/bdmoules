// JavaScript Document
// ajax.js inclus dans index.html, administrer.html
// Appels Ajax sur la BD 
// Pas mal de fonctions supprimées par rapport à la version initiales

/********************************************
 * 
 * INITIALISATION DES APPELS AJAX
 * 
 * 
 * *****************************************/

/****************
// Requête par GET
// ---------------------------------
let myInitGet = {
    method: "GET",
    headers: {"Content-Type": "application/json;charset=UTF-8"},
 
    referrer: "about:client", //ou "" (pas de réferant) ou une url de l'origine
    referrerPolicy: "no-referrer-when-downgrade", //ou no-referrer, origin, same-origin...
    mode: "cors", //ou same-origin, no-cors
    credentials: "include", //same-origin, ou omit, ou include
    cache: "default", //ou no-store, reload, no-cache, force-cache, ou only-if-cached
    redirect: "follow", //ou manual ou error
    integrity: "", //ou un hash comme "sha256-abcdef1234567890"
    keepalive: false, //ou true pour que la requête survive à la page
    signal: undefined //ou AbortController pour annuler la requête            
};
************/

// Requête par GET
// ---------------------------------
let myInitGet = {
    method: "GET",
    // headers: {"Content-Type": "application/json;charset=UTF-8"},
    headers: {"Content-Type": "application/json;charset=UTF-8",  "Access-Control-Allow-Origin" : "*"},
    referrer: "about:client", //ou "" (pas de réferant) ou une url de l'origine
    referrerPolicy: "no-referrer-when-downgrade", //ou no-referrer, origin, same-origin...
    mode: "cors", //ou same-origin, no-cors
    credentials: "include", //same-origin, ou omit, ou include
    cache: "default", //ou no-store, reload, no-cache, force-cache, ou only-if-cached
    redirect: "follow", //ou manual ou error
    integrity: "", //ou un hash comme "sha256-abcdef1234567890"
    keepalive: false, //ou true pour que la requête survive à la page
    signal: undefined //ou AbortController pour annuler la requête            
};
    

// Envois de formulaires par POST
// ----------------------- 
function ajax_post(url, mystrjson){    
    if ((url !== undefined) && (url.length>0) && (mystrjson !== undefined) && (mystrjson.length>0)){        
        // POST avec fetch()
        fetch(url, { // let url_serveur = 'http://localhost/bdmoules/php/script.php';
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=UTF-8'},
            //body: JSON.stringify(myjson), // turn the JS object literal into a JSON string
            body: mystrjson, // mystrjson est déjà une chaîne
            referrer: "about:client", //ou "" (pas de réferanr) ou une url de l'origine
            referrerPolicy: "no-referrer-when-downgrade", //ou no-referrer, origin, same-origin...
            mode: "cors", //ou same-origin, no-cors
            credentials: "include", //ou same-origin ou omit, include
            cache: "default", //ou no-store, reload, no-cache, force-cache, ou only-if-cached
            redirect: "follow", //ou manual ou error
            integrity: "", //ou un hash comme "sha256-abcdef1234567890"
            keepalive: false, //ou true pour que la requête survive à la page
            signal: undefined //ou AbortController pour annuler la requête            
        })
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
    
    

/**********************************************
 * 
 * MODELES - Ce BLOC n'est pas utilisé
 * 
 *********************************************
 
// Récupère les modèles disponibles
// ------------------------
function getModeles() {    
        //console.debug("Chargement des modeles");
        var url= url_serveur+'getmodeles.php';
        var mydata="";    
        ajax_GetModeles(url, mydata);         
}

// Lance l'appel Ajax et transmet les données reçues à setModeles
// Initialise le tableau tModeles
// -----------------------
function ajax_GetModeles(url){ 
    if ((url !== undefined) && (url.length>0)){        
        // GET avec fetch()
        fetch(url, myInitGet)
        .then(response => response.text())  // Le retour est aussi une chaîne
        .then(response => {
            setModeles(response);         
                    })  // tout le boulot se fait ici  dans le script  setModeles.js              
        .catch(error => console.debug("Erreur : "+error));
    }
}

// Rempli le tableau tModeles
// ----------------------- 
function setModeles(response) {
    //console.debug("Affichage des modeles\n"+ response);
    // Traitement de la réponse 
     // INSERT INTO `bdm_modele` (`id`, `nom`, `descriptif`, `dimension`, `categorie`, `timestamp`) VALUES
    // (3, 'Asw 15', 'Asw 15 3m.\r\nMoule fuseau', '? x 300 x ?', 'planeur', '2024-01-19'),

    const objModele = JSON.parse(response);   
    tModeles = []; 

    for(let i in objModele ) { 
        tModeles.push(i, objModele[i].id, objModele[i].nom, objModele[i].descriptif, objModele[i].dimension, objModele[i].categorie, objModele[i].timestamp); 
    }; 
    document.getElementById("infomodeles").innerHTML = tModeles; 
}


**********************************************
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
 
// Récupère et affiche tous les modèles et leurs moules associés
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
        tAux.push(i, objModeleMoule[i].id, objModeleMoule[i].nom, objModeleMoule[i].descriptif, objModeleMoule[i].dimension, objModeleMoule[i].categorie, objModeleMoule[i].idmoule, objModeleMoule[i].numero_inventaire, objModeleMoule[i].mdescription, objModeleMoule[i].mlieu, objModeleMoule[i].matiere, objModeleMoule[i].etat, objModeleMoule[i].longueur, objModeleMoule[i].poids, objModeleMoule[i].commentaire);       
        tModelesMoules.push(tAux); 
    }; 
        
    document.getElementById("myListModeles").innerHTML = selectModelesMoules();
}

/*
// N'est pas utilisée
// -----------------------
function affModelesMoules(){
    //console.debug("Affichage des modèles et des moules associés\n");
    let str='';
    str='<table><tr><th>&nbsp;</th><th>ID Modèle</th><th>Nom</th><th>Descriptif</th><th>Dimensions</th><th>Catégorie</th><th>ID Moule</th><th>N°</th><th>Description</th><th>Lieu stockage</th><th>Matière</th><th>Etat</th><th>Longueur</th><th>Poids</th><th>Commentaire</th></tr>';
    if ((tModelesMoules !== undefined) && (tModelesMoules.length>0)){ 
        for (let i in tModelesMoules) {
            // str+='<tr><td colspan="14">'+tModelesMoules[i]+'</td></tr>'; 
            str+='<tr>';
            for (let j in tModelesMoules[i]) {  
                //console.debug(tModelesMoules[i]+"\n");
                if (j==6) { // idmoule
                    str+='<td><a href="reservation.html?idmoule='+tModelesMoules[i][j]+'">'+tModelesMoules[i][j]+'</a></td>';
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
*/


// -----------------------
function selectModelesMoules(){
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
            str+='<tr><th colspan="6">Choisir un Modèle</th><th colspan="9">Réserver un Moule</th></tr>';
            }
            str+='<tr>';
            for (let j in tModelesMoules[i]) {  
                //console.debug(tModelesMoules[i]+"\n");
                var idmodele=tModelesMoules[i][1];
                var idmoule=tModelesMoules[i][6];
                if (j==1) { // idmodele
                    str+='<td><button name="modele'+tModelesMoules[i][j]+'" onclick="getModeleMoulesImages('+idmodele+'); reserverModeleMoules('+idmodele+');">'+idmodele+'</button></td>';                    
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
                    str+='<td><button name="moule'+idmoule+'" onclick="getThatMoule('+idmoule+');">'+idmoule+'</button></td>';
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
                    str+='<td><button name="reservationmoule'+idmoule+'" onclick="reserverMoule('+idmodele+','+idmoule+');">Réserver</button></td>';
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
// Appelle reserverThatMoules();
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
    str+='<button id="btn">Réserver</button>';
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
    str+='<input type="hidden" id="idmodele" name="idmodele" value="'+idmodeleglobal+'">';  
         

    document.getElementById("infomoules").innerHTML = str;
    document.getElementById("consigne").innerHTML = 'Sélectionnez les moules';
 
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
        reserverThatMoules();
    });    
} 
 
//-----------------------------------------
// Affiche un formulaire de réservation
function reserverThatMoules(){
    console.debug("reserverThatMoule()");
    console.debug("idmodele: "+idmodeleglobal);
    console.debug("modeledescription: "+modeledescription);
    console.debug("tidmoules: "+tidmoules);
    console.debug("tdescription: "+tdescription);
    
    if ((idmodeleglobal !== undefined) && (idmodeleglobal>0) && (tidmoules!==undefined) && (tidmoules.length>0)){ // idmodele=37; tidmoules=[46,47];
        let str='';
        // Creer un formulaire de réservation
        str+='<h4>Complétez ce formulaire de réservation</h4>';
        str+='<form name="RegForm" action="" onsubmit="return validationReservationMultiple()" method="post">';
        str+='<div><label for="Nom">NOM Prénom:</label><br /><input type="text" id="Nom" size="50" name="Nom" value="'+Nom+'" autocomplete="on" />';
        str+='<br /><label for="Adresse">Adresse:</label><br /><input type="text" id="Adresse" size="50" name="Adresse" value="'+Adresse+'" autocomplete="on" />';
        str+='<br /><label for="Email">Adresse électronique:</label><br /><input type="text" id="Email" size="50" name="Email" value="'+Email+'" autocomplete="on" />';
        str+='<br /><label for="Telephone">Téléphone: </label><br /><input type="text" id="Telephone" size="50" name="Telephone" value="'+Telephone+'" autocomplete="on" />';
        str+='<br /><label for="Commentaire">Commentaires: (<i><span class="small">Motivez votre demande...</span></i>) </label><textarea cols="50" id="Commentaire" rows="3" name="Commentaire" autocomplete="on">'+Commentaire+'</textarea>';
        str+='</div><div class="button"><input type="submit" value="Envoyer" name="Envoyer" /><input type="reset" value="Réinitialiser" name="Reset" /></div>';        
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
function validationReservationMultiple(){
// Verifie que les champs du formualaire sont remplis
    nom = document.forms["RegForm"]["Nom"];               
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

/***********************************************
 *
 * IMAGES et PHOTOS
 * 
 ********************************************** */
 
// Non utilisé 
// ---------------------
function affImage(nomfichier, legende, isvignette=false){
// Affiche une image dans la fenêtre d'image
// Avec un lien vers l'original ou vers la vignette en fonction de isvignette
    if (nomfichier !== undefined && nomfichier.length>0){
        if (isvignette){
            document.getElementById("myImage").innerHTML = '<a href="images/'+nomfichier+'"><img src="images/vignettes/'+nomfichier+'" alt="'+legende+'" title="'+legende+'"></a>';
        }
        else{
            document.getElementById("myImage").innerHTML = '<a href="images/vignettes/'+nomfichier+'"><img src="images/'+nomfichier+'" alt="'+legende+'" title="'+legende+'"></a>';
        }
    }
}


// ---------------------
function getMouleImages(idmoule){
// Récupère et affiche le fichier image associé à un modèle
    //console.debug("GetMouleImage: "+idmoule);
    if (idmoule!==undefined){
        idmoule=parseInt(idmoule); 
                      
        if (idmoule>0){
            var url= url_serveur+'getimagemoule.php';
            var mydata="?idmoule="+idmoule;  
            ajax_GetImage(url, mydata);
        }       
    }      
}

// ---------------------
function getModeleMoulesImages(idmodele){
// Récupère et affiche les photos associées à un modèle et à ses moules
    //console.debug("GetModeleImage: "+idmodele);
    if (idmodele!==undefined){
        idmodele=parseInt(idmodele); 
                      
        if (idmodele>0){
            setCookie("sidmodele", idmodele, 30); // 30 jours
            var url= url_serveur+'getimagemodelemoules.php';
            var mydata="?idmodele="+idmodele;  
            ajax_GetImage(url, mydata);
        }       
    }      
}


// Lance l'appel Ajax et appelle affImage(nomfichier, legende, isvignette=false)
// `bdm_photo` (`photoid`, `legende`, `copyrigth`, `fichier`, `refmodele`, `refmoule`) 
// -----------------------
function ajax_GetImage(url, mydata){ 
    if ((url !== undefined) && (url.length>0) && (mydata !== undefined) && (mydata.length>0)){
        // GET avec fetch()
        fetch(url+mydata, myInitGet)
        .then(response => response.text())  // Le retour est aussi une chaîne
        .then(response => {
            //console.debug ("\n"+response+"\n");
            affFichersImages(response); 
                    })  // as usual...              
        .catch(error => console.debug("Erreur : "+error));
    }
}


// ------------------------
function affFichersImages(response){
    const objImage = JSON.parse(response);   
    tImages = []; 
    if ((objImage!==undefined) && (objImage!==null)){
        for(let i in objImage ) { 
            tAux = [];
            tAux.push(objImage[i].photoid, objImage[i].legende, objImage[i].copyrigth, objImage[i].fichier, objImage[i].refmodele, objImage[i].refmoule);        
            tImages.push(tAux); 
        }
        
        //console.debug ("\n"+tImages+"\n");
            
        if ((tImages !== null) && (tImages.length>0)){
            let str = '';
            for(let i in tImages) { 
                str += '<a href="images/'+tImages[i][3]+'"><img src="images/vignettes/'+tImages[i][3]+'" alt="'+tImages[i][1]+' '+tImages[i][2]+'" title="'+tImages[i][1]+' '+tImages[i][2]+'"></a><br />';                   
            }
            // console.debug("\nSTR: "+str+"\n");
            // Afficher
            document.getElementById("myImage").innerHTML = str;
        }
        else{
            document.getElementById("myImage").innerHTML = '<span class="surligne">Aucune photo de ce modèle</span>';
        }                                       
    } 
  }


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
    var email = document.forms["RegForm"]["Email"];    
    var phone = document.forms["RegForm"]["Telephone"];   
    var address = document.forms["RegForm"]["Adresse"];  
    var comment = document.forms["RegForm"]["Commentaire"];  

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
    var email = document.forms["RegForm"]["Email"].value;    
    var phone = document.forms["RegForm"]["Telephone"].value;   
    var address = document.forms["RegForm"]["Adresse"].value;  
    var comment = document.forms["RegForm"]["Commentaire"].value; 
    var idmodele = document.forms["RegForm"]["idmodele"].value;               
    var idmoule = document.forms["RegForm"]["idmoule"].value;               

    mystrjson+='{"idmodele":"'+idmodele+'", "idmoule":"'+idmoule+'", Nom":"'+nom+'", "Email":"'+email+'", "Telephone":"'+phone+'", "Adresse":"'+address+'", "Commentaire":"'+comment+'"}';
    console.debug("JSON:"+mystrjson+"\n");
        
    var url= url_serveur+'reservation.php';
    console.debug("URL: "+ url);
    ajax_post(url, mystrjson);
    
 }
 

//-----------------------------------------
function reserverMoule(idmodele, idmoule){
    if ((idmoule !== undefined) && (idmoule>0)){
        let str='';
        // Creer un formulaire de réservation
        str+='<h4>Complétez ce formulaire de réservation</h4>';
        str+='<form name="RegForm" onsubmit="return validationReservation()" method="post" class="w3docs">';
        str+='<div><label for="Nom">Nom:</label><input type="text" id="Nom" size="50" name="Nom" /></div>';
        str+='<br /><div><label for="adresse">Adresse:</label><input type="text" id="adresse" size="50" name="Adresse" /></div>';
        str+='<br /><div><label for="E-mail" l>Adresse électronique:</label><input type="text" id="E-mail" size="50" name="Email" /></div>';
        str+='<br /><div><label for="Téléphone">Téléphone: </label><input type="text" id="Telephone" size="50" name="Telephone" /></div>';
        str+='<br /><div><label for="commentaire">Commentaires: (<i><span class="small">Motivez votre demande...</span></i>) </label><textarea cols="50" id="commentaire" rows="5" name="Commentaire"></textarea></div>';
        str+='<div class="buttons"><input type="submit" value="Envoyer" name="Envoyer" /><input type="reset" value="Réinitialiser" name="Reset" /></div>';
        str+='<input type="hidden" id="idmodele" name="idmodele" value="'+idmodele+'">';
        str+='<input type="hidden" id="idmoule" name="idmoule" value="'+idmoule+'">';
        str+='</form>';
        
        document.getElementById("myImage").innerHTML = str;
    }
}




//--------------------------------
function validationReservation()  {                                  

    nom = document.forms["RegForm"]["Nom"];               
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
        if ((response.Ok==1) && (respnse.data!==undefined) && (response.data.length>0)){
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
        str+='<br /><div><label for="Email" l>Adresse électronique:</label><input type="text" id="Email" size="50" name="Email" autocomplete="on" /></div>';
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
    
    let body='%0A%0ANom: '+nom.value+'%0A%0AEmail: '+email.value+'%0A%0ATéléphone: '+phone.value+'%0A%0AAdresse: '+address.value+'%0A%0ACommentaire '+comment.value;
    body+='%0A%0A'+JSON.stringify(response);
    
    console.debug("body\n");
    document.getElementById("consigne").innerHTML = '<a href="mailto:bureau-arbl@laposte.net?cc=jean.fruitet@free.fr&subject=Réservation moules&body='+body+'>Envoyer Email</a>';
      
}      

******************************************/



