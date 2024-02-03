// JavaScript Document

// Appels Ajax sur la BD 
// Pas mal de fonctions à supprimer quand l'interface sera stabilisée

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


/**********************************************
 * 
 * MODELES - Ce BLOC n'est pas utilisé
 * 
 *********************************************/
 
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


/**********************************************
 * 
 * MOULES - Ce BLOC n'est pas utilisé
 * 
 *********************************************/
 
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


/**********************************************
 * 
 * Les MODELES ET LEURS MOULES - Affichages et sélections
 * 
 *********************************************/
 
// Récupère et affiche les modeles et les moules associés
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
// Appelé par ajax_GetModelesLoules();
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
    
    //document.getElementById("infomodulesmoules").innerHTML = tModelesMoules;
    // document.getElementById("tablemodulesmoules").innerHTML = affModelesModules();
    // Liste avec sélection d'un modele ou d'un moule
    //document.getElementById("myListModeles").innerHTML = affModelesMoules();      
    document.getElementById("myListModeles").innerHTML = selectModelesMoules();
}

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


// -----------------------
function selectModelesMoules(){
// Affiche une table de modèles et de leur moules
// Deux boutons de sélection
// Les images associées
    //console.debug("Sélection d'un modèle et des moules associés\n"); 
    let str='';
    str='<table><tr><th colspan="6">Modèle</th><th colspan="8">Moule</th></tr><tr><th>&nbsp;</th><th>ID Modèle</th><th>Nom</th><th>Descriptif</th><th>Dimensions</th><th>Catégorie</th><th>ID Moule</th><th>N°</th><th>Description</th><th>Lieu stockage</th><th>Matière</th><th>Etat</th><th>Longueur</th><th>Poids</th><th>Commentaire</th></tr>';
    if ((tModelesMoules !== undefined) && (tModelesMoules.length>0)){ 
        for (let i in tModelesMoules) { 
            str+='<tr>';
            for (let j in tModelesMoules[i]) {  
                //console.debug(tModelesMoules[i]+"\n");
                var idmodele=tModelesMoules[i][1];
                var idmoule=tModelesMoules[i][6];
                if (j==1) { // idmodele
                    str+='<td><button name="modele'+tModelesMoules[i][j]+'" onclick="getModeleMoulesImages('+idmodele+');">'+idmodele+'</button></td>';                    
                }
                else if (j==6) { // idmoule
                    str+='<td><button name="moule'+idmoule+'" onclick="getThatMoule('+idmoule+'); getModeleMoulesImages('+idmodele+');">'+idmoule+'</button></td>';
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
        tAux.push(i, objMoule[i].idmoule, objMoule[i].numero_inventaire, objMoule[i].mdescription, objMoule[i].mlieu, objMoule[i].matiere, objMoule[i].etat, objMoule[i].longueur, objMoule[i].poids, objMoule[i].commentaire);        
        tMoule.push(tAux); 
    }; 
    
    // Tableau 
    document.getElementById("infomoules").innerHTML = affThatMoule(tMoule);  
}


// -----------------------
// Appelé par setThatMoule()
function affThatMoule(tMoule){
    //console.debug("Affichage du moule sélectionné\n");
    let str='';
    //str='<table><tr><th>N°</th><th>ID Modèle</th><th>Nom</th><th>Descriptif</th><th>Dimensions</th><th>Catégorie</th><th>ID Moule</th><th>Inventaire</th><th>Description</th><th>Lieu stockage</th><th>Matière</th><th>Etat</th><th>Longueur</th><th>Poids</th><th>Commentaire</th></tr>';
    str='<table><tr><th>&nbsp;</th><th>ID Moule</th><th>Inventaire</th><th>Description</th><th>Lieu stockage</th><th>Matière</th><th>Etat</th><th>Longueur</th><th>Poids</th><th>Commentaire</th></tr>';
    
    if ((tMoule !== undefined) && (tMoule.length>0)){ 
        for (let i in tMoule) {
            // str+='<tr><td colspan="14">'+tModelesMoules[i]+'</td></tr>'; 
            str+='<tr>';
            for (let j in tMoule[i]) {  
                //console.debug(tMoule[i]+"\n");
                if (j==0) { // checkbox
                    str+='<td>A Checker '+tMoule[i][j]+'</a></td>';
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
    console.debug("GetMouleImage: "+idmoule);
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
    console.debug("GetModeleMouleImage: "+idmodele);
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
            document.getElementById("myImage").innerHTML = "Aucune image pour ce modèle";
        }
    }                                
}


