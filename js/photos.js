// JavaScript Document
// Gestion des photos de moules

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
            document.getElementById("myImage").innerHTML = '<a href="images/'+nomfichier+'"><img src="images/vignettes/'+nomfichier+'" alt="'+legende.replaceAll('"','``')+'" title="'+legende.replaceAll('"','``')+'"></a>';
        }
        else{
            document.getElementById("myImage").innerHTML = '<a href="images/vignettes/'+nomfichier+'"><img src="images/'+nomfichier+'" alt="'+legende.replaceAll('"','``')+'" title="'+legende.replaceAll('"','``')+'"></a>';
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
    //console.debug("GetPhotoImage: "+idmodele);
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
// `bdm_photo` (`idphoto`, `legende`, `copyright`, `fichier`, `refmodele`, `refmoule`) 
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
    //console.debug("affFichiersIages()");
    const objImage = JSON.parse(response);   
    tImages = []; 
    let titre = ''; 
    
    if ((objImage!==undefined) && (objImage!==null)){
        for(let i in objImage ) { 
            tAux = [];
            tAux.push(objImage[i].idphoto, objImage[i].auteur, objImage[i].legende, objImage[i].copyright, objImage[i].fichier, objImage[i].refmodele, objImage[i].refmoule);        
            //console.debug ("\n"+tAux+"\n");
            tImages.push(tAux); 
        }
        
        //console.debug ("\n"+tImages+"\n");
        /********    
        if ((tImages !== null) && (tImages.length>0)){
            let str = '';
            for(let i in tImages) { 
                if ((tImages[i][1] !== undefined) && (tImages[i][1] !== null)){
                    titre = tImages[i][2].replaceAll('"',' ')+' - '+tImages[i][1]+' ('+tImages[i][3]+')';
                    str += '<div><a href="images/'+tImages[i][4]+'"><img src="images/vignettes/'+tImages[i][4]+'" alt="'+titre+'" title="'+titre+'"></a></div>';                   
                    str += '<div><p>'+tImages[i][2]+' - '+tImages[i][1]+' - (<i>'+tImages[i][3]+'</i>)<br />';
                    if ((okadmin !== undefined) && okadmin){
                        str += '<button id="photo'+tImages[i][0]+'" onclick="editPhoto('+tImages[i][0]+');">Editer</button> &nbsp; <button id="photodel'+tImages[i][0]+'" onclick="assignePhoto('+tImages[i][0]+');">Ré-assigner</button> &nbsp; <button id="photodel'+tImages[i][0]+'" onclick="deletePhoto('+tImages[i][0]+');">Supprimer</button>';  
                    }
                    str+='</p></div><br />';
                }
                else{
                    titre = tImages[i][2].replaceAll('"',' ')+' - ('+tImages[i][3]+')';
                    str += '<div><a href="images/'+tImages[i][3]+'"><img src="images/vignettes/'+tImages[i][3]+'" alt="'+titre+'" title="'+titre+'"></a></div>';                               
                    str += '<div><p>'+tImages[i][2]+' - (<i>'+tImages[i][3]+')</i><br />';
                    if ((okadmin !== undefined) && okadmin){
                        str += '<button id="photo'+tImages[i][0]+'" onclick="editPhoto('+tImages[i][0]+');">Editer</button> &nbsp; <button id="photodel'+tImages[i][0]+'" onclick="assignePhoto('+tImages[i][0]+');">Ré-assigner</button> &nbsp; <button id="photodel'+tImages[i][0]+'" onclick="deletePhoto('+tImages[i][0]+';)">Supprimer</button>'; 
                    }
                    str+='</p></div><br />';                    
                }                
            }    
            // console.debug("\nSTR: "+str+"\n");
            ****/
        if ((tImages !== null) && (tImages.length>0)){
            //let str = '';
            let str='<table>';
            for(let i in tImages) { 
                if ((tImages[i][1] !== undefined) && (tImages[i][1] !== null)){
                    titre = tImages[i][2].replaceAll('"',' ')+' - '+tImages[i][1]+' ('+tImages[i][3]+')';
                    str += '<tr><td>'+tImages[i][2]+' - '+tImages[i][1]+' - (<i>'+tImages[i][3]+'</i>)</td></tr>';
                    str += '<tr><td><a href="images/'+tImages[i][4]+'"><img src="images/vignettes/'+tImages[i][4]+'" alt="'+titre+'" title="'+titre+'"></a></td></tr>';                    
                    if ((okadmin !== undefined) && okadmin && (adminpage !== undefined) && (adminpage==true)){
                        str += '<tr><td><button id="photo'+tImages[i][0]+'" onclick="editPhoto('+tImages[i][0]+');">Editer</button> <button id="photodel'+tImages[i][0]+'" onclick="assignePhoto('+tImages[i][0]+');">Assigner</button> <button id="photodel'+tImages[i][0]+'" onclick="deletePhoto('+tImages[i][0]+');">Supprimer</button></td></tr>';  
                    }
                }
                else{
                    titre = tImages[i][2].replaceAll('"',' ')+' - ('+tImages[i][3]+')';
                    str += '<tr><td>'+tImages[i][2]+' - (<i>'+tImages[i][3]+')</i></td></tr>';
                    str += '<tr><td><a href="images/'+tImages[i][3]+'"><img src="images/vignettes/'+tImages[i][3]+'" alt="'+titre+'" title="'+titre+'"></a></td></tr>';                               
                    if ((okadmin !== undefined) && okadmin && (adminpage !== undefined) && (adminpage==true)){
                        str += '<tr><td><button id="photo'+tImages[i][0]+'" onclick="editPhoto('+tImages[i][0]+');">Editer</button> <button id="photodel'+tImages[i][0]+'" onclick="assignePhoto('+tImages[i][0]+');">Assigner</button> <button id="photodel'+tImages[i][0]+'" onclick="deletePhoto('+tImages[i][0]+';)">Supprimer</button></td></tr>'; 
                    }
                }                
            }  
            str+='</table>';  
            // console.debug("\nSTR: "+str+"\n");
            
            // Afficher
            document.getElementById("myImage").innerHTML = str;
        }
        else{
            document.getElementById("myImage").innerHTML = '<br /><span class="surligne">Aucune photo de ce modèle</span>';
        }                                       
    } 
  }



/**********************************************
 * 
 * AJOUT DE PHOTOS A LA BD
 * 
 * ********************************************/


// ---------------------
function readFile(input, idmodele=0, idmoule=0) {
    const preview =  document.querySelector("#preview");
    const file = input.files[0];
    
    // ------------------------------
    function readAndPreview(file) {
        // On s'assure que `file.name` termine par une des extensions souhaitées
        if (/\.(jpe?g|png|gif)$/i.test(file.name)) {
            const reader = new FileReader();            
            
            reader.addEventListener(
                "load",
                () => {
                    // affiche le contenu du fichier en mode blob 
                    console.log(`File name: ${file.name}`);
                    console.log(`Last modified: ${file.lastModified}`); // e.g 1552830408824
                    // console.log(reader.result);    

                    const image = new Image();
                    // image.height = 200;
                    image.width = 400;
                    image.alt= file.name;
                    image.title = file.name;
                    image.src = reader.result;
                    image.border = 1;
                    preview.appendChild(image);
                    
                    
                    // appel Ajax pour transférer le fichier vers le serveur
                    var xhttp = new XMLHttpRequest();
                    let formData = new FormData(document.forms.uneImage);
                    formData.append("imagebase64", reader.result);
                    formData.append("filename", file.name);   
                                      
                    xhttp.open("POST", url_serveur+"addfilebypost.php", true);
                    xhttp.responseType = 'text';
                    xhttp.send(formData); 
                    xhttp.addEventListener("load", function() {
                        if (xhttp.status != 200) { // analyse l'état HTTP de la réponse
                            console.debug(`Error ${xhttp.status}: ${xhttp.statusText}`); // e.g. 404: Not Found
                        } 
                        else { // show the result                            
                            console.debug(`Done, got ${xhttp.status}`);
                            console.debug(`Done, got ${xhttp.response.length} bytes`); // response est la réponse du serveur
                            console.debug(`Response : ${xhttp.response} `);
                            let responseObj = JSON.parse(xhttp.response);    
                            if ((responseObj.Ok !== undefined) && (responseObj.Ok ==1)){
                                console.debug("Filename: "+responseObj.nomf);
                                   
                                newLegendePhoto(responseObj.nomf, idmodele, idmoule);                             
                            }                          
                        }
                    });                       
                },
                false,
            );
            
            // Error
            reader.addEventListener(
                "error",
                () => {
                    // affiche le contenu du fichier en mode blob 
                    console.log(`Erreur: ${file.name}`);
                    console.log(`Type d'erreur: ${reader.result}`); // 
                },
                false,
                );
            
            reader.readAsDataURL(file);
        }
    }

    readAndPreview(file);

}


// ---------------------------------------
// Formulaire de création d'une photo rattaché à un modèle
// Envoi du formulaire vers serveur PHP sans appel Ajax
// Compatible Firefox
//  ----------------------------------
function newPhoto(idmodele=0, idmoule=0){
    //console.debug ("newPhoto()");
    if (idmodele==0){
        if ((idmodeleglobal !== undefined) && (idmodeleglobal > 0)){
            idmodele=idmodeleglobal;
        }
    }

    //console.debug ("Id modele: "+idmodele);
    //console.debug ("Id moule: "+idmoule);
    document.getElementById("myFile").innerHTML = 'Pour chaque modèle enregistrez au moins une photo d\'au plus 1200 x 800 au format .JPG ou .PNG';

        let str='';
        // Formulaire de création
        str+='<h4>Chargez une image</h4>';
        str+='<div><form name="uneImage">';
        str+='<label for="browse">Choisissez une photo ';
        if (idmoule>0){
            str+='pour le moule N° '+idmoule+' ';
            if (idmodele>0){
                str+='du modèle N° '+idmodele+' ';
            }
        }
        else{
            if (idmodele>0){
                str+='pour le modèle N° '+idmodele+' ';
            }
        }
        str+='</label> ';        
        str+='<input type="file" id="browse" name="browse" accept="image/png, image/jpeg, image/gif" onchange="readFile(this,'+idmodele+','+idmoule+')" />';               
        str+='</form>';   
        str+='<div id="preview"></div>';  
            
        document.getElementById("myPhoto").innerHTML = document.getElementById("myPhoto").innerHTML + str;
    
}



// ---------------------------------------
// Formulaire de création d'une photo rattaché à un modèle
// Envoi du formulaire vers serveur PHP sans appel Ajax
// Compatible Firefox
//  ----------------------------------
function newLegendePhoto(nomfichiertemporaire, idmodele=0, idmoule=0){
    //console.debug ("newLegendePhoto()");
    let okmodele=false;
    let okmoule=false;
    let modelname='';
        //console.debug("Modèle "+idmodele);
        //console.debug(tModeles);
        if ((tModeles !== undefined) && (tModeles !== null)){
            for (let i in tModeles) { 
                // console.debug ("Index :"+i);
                //console.debug ("ID :"+tModeles[i][0]);
                //console.debug ("Nom :"+tModeles[i][1]);
                
                if (parseInt(tModeles[i][0]) == idmodele){
                    modelname = tModeles[i][1];
                    break;
                }
            }
        }
    

    
    // <input id="browse" type="file" onchange="previewFiles()" multiple />

        let str='';
        let url= url_serveur+'addphotobypost.php';
        // Formulaire de création
        str+='<h4>Complétez ce formulaire</h4>';
        str+='<form name="AddFormPhoto" action="'+url+'" method="post">';
        str+='<div class="button"><input type="submit" value="Envoyer" name="Envoyer" onclick="return verifSaisiePhoto(\"AddFormPhoto\");" /> <input type="reset" value="Réinitialiser" name="Reset" /></div>';        
         //  id 	nom 	descriptif 	dimension [long x larg x haut] 	categorie 	timestamp 	
        str+='<div>';
        if (okmodele){
            str+='<label for="modelenom">Modèle '+idmodele+'</label><br /><input type="text" id="modelenom" size="80" name="modelenom" value="'+modelname+'" autocomplete="on" />';
        }
        else{
            str+='<label for="modelenom">Nom de ce modèle: </label><br /><input type="text" id="modelenom" size="80" name="modelenom" value="" autocomplete="on" />';        
        }       
        if (nomfichiertemporaire.length>0){
            str+='<br /><b>Nom du fichier</b> (<i>'+nomfichiertemporaire+'</i>)<br />'; 
            str+='<label for="nomfichier">Nouveau nom </label> <input type="text" id="nomfichier" size="80" name="nomfichier" value="" autocomplete="on" />'; 
        } 
        str+='<br /><label for="auteur">Auteur: </label><br /><input type="text" id="auteur" size="50" name="auteur" value="" autocomplete="on" />';
        str+='<br /><label for="legende">Légende: </label><textarea cols="50" id="legende" rows="2" name="legende" autocomplete="on"></textarea>';
        str+='<br /><label for="licence">Licence <a target="_blank" href="https://creativecommons.org/share-your-work/cclicenses/">Creative Commons</a></label> <select name="licence" id="licence">';
        str+='<option value="cc-by">CC-by</option>'; // <a href="https://creativecommons.org/licenses/by/4.0/">(Attribution)</a></option>';
        str+='<option value="cc-by-sa" selected>CC-by-sa</option>'; // <a href="https://creativecommons.org/licenses/by-sa/4.0/">(Attribution + partage identique)</a>';
        str+='<option value="cc-by-nd">CC-by-nd</option>'; // <a href="https://creativecommons.org/licenses/by-nd/4.0/">(Attribution + sans modification)</a></option>';
        str+='<option value="cc-by-nc">CC-by-nc</option>'; // <a href="https://creativecommons.org/licenses/by-nc/4.0/">(Attribution + sans util. commerc.)</a></option>';
        str+='<option value="cc-by-nc-sa">CC-by-nc-sa</option>'; // <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">(Attribution + sans util. commerc. + partage identique)</a></option>';
        str+='<option value="cc-by-nc-nd">CC-by-nc-nd</option>'; // <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">(Attribution + sans util. commerc. + sans modification)</a></option>';
        str+='</select>';        
        str+='</div>';   
        //str+='<div id="preview"></div>';
        //str+='<input type="hidden" id="nomfichier" name="nomfichier" value="'+nomfichier+'" />';        
        str+='<input type="hidden" id="nomfichiertemporaire" name="nomfichiertemporaire" value="'+nomfichiertemporaire+'" />';        
        str+='<input type="hidden" id="idmodele" name="idmodele" value="'+idmodele+'" />';        
        str+='<input type="hidden" id="idmoule" name="idmoule" value="'+idmoule+'" />';        
        str+='<input type="hidden" id="appel" name="appel" value="'+pageadmin+'" />';
        str+='</form>';   
       
        document.getElementById("myImage").innerHTML = str;
    
}

// -----------------------------------------
// Vérification des données
function verifSaisiePhoto(ThisForm){   
    //photoauteur = document.forms[ThisForm]["auteur"];               
    photolegende = document.forms[ThisForm]["legende"];    
    photolicence = document.forms[ThisForm]["licence"];   
    nomfichier = document.forms[ThisForm]["nomfichier"];
    nomfichiertemporaire = document.forms[ThisForm]["nomfichiertemporaire"];  

    if ( photolegende.value == "")                               
    { 
        alert("Complétez la légende de la photo."); 
        photolegende.focus(); 
        return false; 
    }          
     
    if ( photolicence.value == "")                               
    { 
        alert("Sélectionnez une licence Creative Commons."); 
        photolicence.focus(); 
        return false; 
    }          

    if ((nomfichier.value !== "") && (nomfichiertemporaire.value !== ""))                                
    { 
        //console.debug("Nomfichier "+ nomfichier.value);
        //console.debug("Nomfichiertemporaire "+ nomfichiertemporaire.value);
        const  regex = /\./;

        if (!regex.test(nomfichier.value)){
            //console.debug("Pas d'extension dans "+nomfichier.value);
            if (regex.test(nomfichiertemporaire.value)){
                //console.debug("Extension dans "+nomfichiertemporaire.value);
                const myArray = nomfichiertemporaire.value.split(".");
                //console.debug(myArray);
                nomfichier.value += '.'+myArray.slice(-1);
                //console.debug("Nomfichier "+ nomfichier.value);
                document.forms[ThisForm]["nomfichier"].value = nomfichier.value;
                return true;
            }
            else{
                alert("Ajoutez une extension ad hoc au nom de fichier.");   
                nomfichier.focus();
                return false;            
            }
        }
        else{
            return true;        
        } 
    }            

    return true;
}


// Lance l'appel Ajax 
// `bdm_photo` (`idphoto`, `legende`, `copyright`, `fichier`, `refmodele`, `refmoule`) 
// -----------------------
function ajax_PhotoEdit(url, mydata){ 
    if ((url !== undefined) && (url.length>0) && (mydata !== undefined) && (mydata.length>0)){
        // GET avec fetch()
        fetch(url+mydata, myInitGet)
        .then(response => response.text())  // Le retour est aussi une chaîne
        .then(response => {            
            //console.debug ("\n"+response+"\n");
            response = JSON.parse(response);
            editionPhoto(response); 
                    })  // as usual...              
        .catch(error => console.debug("Erreur : "+error));
    }
}


// -----------------------------------
// Appel Ajax
function editPhoto(idphoto){
    // console.debug ("Editer cette photo: "+idphoto);      
    if ((idphoto !== undefined) && (idphoto>0)){
        var url= url_serveur+'getphoto.php';
        var mydata="?idphoto="+idphoto;  
        ajax_PhotoEdit(url, mydata);
    }
}

// -----------------------------------
// Formulaire d'édition
function editionPhoto(response){    
    // console.debug ("\neditionPhoto()\n");
    if ((response !== undefined) && (response !== null)){       
        // 	idphoto 	auteur 	legende copyright 	fichier 	refmodele refmoule
        // console.debug ("IDPhoto: "+response.idphoto+"\n");
        // console.debug ("Fichier : "+response.fichier+"\n");
        // console.debug ("IDModèle: "+response.refmodele+"\n");
        // console.debug ("IDMoule: "+response.refmoule+"\n");
        
        let idphoto = parseInt(response.idphoto);
        if ((response.refmodele === undefined) || (response.refmodele === null)){
            response.refmodele = '';
        }
        if ((response.refmoule === undefined) || (response.refmoule === null)){
            response.refmoule = '';
        }
         
        // console.debug ("Id Modèle: "+response.refmodele);
        // console.debug ("Id Moule: "+response.refmoule);
        
        let nomfichiertemporaire = response.fichier; 
        
        let str='';
        let url= url_serveur+'addphotobypost.php';
        // Formulaire de création
        str+='<h4>Complétez ce formulaire</h4>';
        str+='<form name="EditFormPhoto" action="'+url+'" method="post">';
        str+='<div class="button"><input type="submit" value="Envoyer" name="Envoyer" onclick="return verifSaisiePhoto(\"EditFormPhoto\");" /> <input type="reset" value="Réinitialiser" name="Reset" /></div>';        
 	
        str+='<div>';
        if (response.fichier.length>0){
            str+='<br /><b>Nom du fichier</b> (<i>'+response.fichier+'</i>)<br />'; 
            str+='<label for="nomfichier">Nom du fichier</label> <input type="text" id="nomfichier" size="80" name="nomfichier" value="'+response.fichier+'" autocomplete="on" />'; 
        } 
        str+='<br /><label for="auteur">Auteur: </label><br /><input type="text" id="auteur" size="50" name="auteur" value="'+response.auteur+'" autocomplete="on" />';
        str+='<br /><label for="legende">Légende: </label><textarea cols="50" id="legende" rows="2" name="legende" autocomplete="on">'+response.legende+'</textarea>';
        str+='<br /><label for="licence">Licence <a target="_blank" href="https://creativecommons.org/share-your-work/cclicenses/">Creative Commons</a></label> <select name="licence" id="licence">';
        if ((response.copyright !== undefined) && (response.copyright.length>0)){
            if (response.copyright === "cc-by"){   // <a href="https://creativecommons.org/licenses/by/4.0/">(Attribution)</a></option>';
                str+='<option value="cc-by selected">CC-by</option>';
            }
            else{
                str+='<option value="cc-by">CC-by</option>'; 
            }
            if (response.copyright === "cc-by-sa"){ // <a href="https://creativecommons.org/licenses/by-sa/4.0/">(Attribution + partage identique)</a>';
                str+='<option value="cc-by-sa" selected>CC-by-sa</option>'; 
            }
            else{
                str+='<option value="cc-by-sa">CC-by-sa</option>';             
            }
            if (response.copyright === "cc-by-nd"){  // <a href="https://creativecommons.org/licenses/by-nd/4.0/">(Attribution + sans modification)</a></option>';             
                str+='<option value="cc-by-nd" selected>CC-by-nd</option>';
            }
            else{
                str+='<option value="cc-by-nd">CC-by-nd</option>';
            }
            if (response.copyright === "cc-by-nc"){  // <a href="https://creativecommons.org/licenses/by-nc/4.0/">(Attribution + sans util. commerc.)</a></option>';
 
                str+='<option value="cc-by-nc" selected>CC-by-nc</option>';
            }
            else{
                str+='<option value="cc-by-nc">CC-by-nc</option>'; 
            }
            if (response.copyright === "cc-by-nc-sa"){  // <a href="https://creativecommons.org/licenses/by-nc-sa/4.0/">(Attribution + sans util. commerc. + partage identique)</a></option>';
                str+='<option value="cc-by-nc-sa" selected>CC-by-nc-sa</option>';
            }
            else{
                str+='<option value="cc-by-nc-sa">CC-by-nc-sa</option>';
            }
            if (response.copyright === "cc-by-nc-nd"){         // <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">(Attribution + sans util. commerc. + sans modification)</a></option>';

                str+='<option value="cc-by-nc-nd" selected>CC-by-nc-nd</option>';
            }
            else{
                str+='<option value="cc-by-nc-nd">CC-by-nc-nd</option>';
            }
        }     
        else{
            str+='<option value="cc-by selected">CC-by</option>';
            str+='<option value="cc-by-sa">CC-by-sa</option>';             
            str+='<option value="cc-by-nd">CC-by-nd</option>';
            str+='<option value="cc-by-nc">CC-by-nc</option>'; 
            str+='<option value="cc-by-nc-sa">CC-by-nc-sa</option>';
            str+='<option value="cc-by-nc-nd">CC-by-nc-nd</option>';             
        }      
        str+='</select>';        
        str+='</div>';   
        str+='<input type="hidden" id="nomfichiertemporaire" name="nomfichiertemporaire" value="'+nomfichiertemporaire+'" />';
        str+='<input type="hidden" id="idphoto" name="idphoto" value="'+idphoto+'" />';    
        str+='<input type="hidden" id="idmodele" name="idmodele" value="'+response.refmodele+'" />';        
        str+='<input type="hidden" id="idmoule" name="idmoule" value="'+response.refmoule+'" />';        
        str+='<input type="hidden" id="appel" name="appel" value="'+pageadmin+'" />';
        str+='</form>';       
        document.getElementById("myImage").innerHTML = str + document.getElementById("myImage").innerHTML;    
    }       
}


// -----------------------------------
// Suppression d'une photo
function deletePhoto(idphoto){
    //console.debug ("Supprimer cette photo : "+idphoto);   
    
    if ((idphoto !== undefined) && (idphoto !== null) && (idphoto>0)){
        var url= url_serveur+'getphoto.php';
        var mydata="?idphoto="+idphoto;  
        ajax_PhotoDelete(url, mydata);
    }
}

// Lance l'appel Ajax 
// `bdm_photo` (`idphoto`, `legende`, `copyright`, `fichier`, `refmodele`, `refmoule`) 
// -----------------------
function ajax_PhotoDelete(url, mydata){ 
    if ((url !== undefined) && (url.length>0) && (mydata !== undefined) && (mydata.length>0)){
        // GET avec fetch()
        fetch(url+mydata, myInitGet)
        .then(response => response.text())  // Le retour est aussi une chaîne
        .then(response => {
            
            console.debug ("\n"+response+"\n");
            response = JSON.parse(response);
            suppressionPhoto(response); 
                    })  // as usual...              
        .catch(error => console.debug("Erreur : "+error));
    }
}

// -----------------------------------
// Formulaire d'édition
function suppressionPhoto(response){    
    console.debug ("\nsuppressionPhoto()\n");
    if ((response !== undefined) && (response !== null)){       
        // 	idphoto 	auteur 	legende copyright 	fichier 	refmodele refmoule
        // console.debug ("IDPhoto: "+response.idphoto+"\n");
        // console.debug ("Fichier : "+response.fichier+"\n");
        // console.debug ("IDModèle: "+response.refmodele+"\n");
        // console.debug ("IDMoule: "+response.refmoule+"\n");
        
        let idphoto = parseInt(response.idphoto);
        if ((response.refmodele === undefined) || (response.refmodele === null)){
            response.refmodele = '';
        }
        if ((response.refmoule === undefined) || (response.refmoule === null)){
            response.refmoule = '';
        }
         
        // console.debug ("Id Modèle: "+response.refmodele);
        // console.debug ("Id Moule: "+response.refmoule);
        let str='';
        let url= url_serveur+'deletephotobypost.php';
        // Formulaire de création
        str+='<h4>Confirmez la suppression de cette photo !</h4>';
        if (response.refmoule==''){
            str+='<p>Photo du modèle #'+response.refmodele+'</p>'
        }
        else{
            str+='<p>Photo du moule #'+response.refmoule+'</p>'        
        }
        str+='<form name="DelFormPhoto" action="'+url+'" method="post">';
        str+='<div class="button"><input type="submit" name="delete" value="Confirmer" /> <input type="submit" name="delete" value="Annuler" /></div>';        

       // 	idphoto 	legende [légende photo] 	copyright 	fichier 	refmodele [référence un modèle] 	refmoule [référence un élément] 	
        str+='<div><b>#ID</b>: '+idphoto+'<br /><b>Auteur:</b> '+response.auteur;
        str+='<br /><b>Légende</b>: '+response.legende;
        str+='<br /><b>Licence CC</b>: '+response.copyright;
        str+='<br /><b>Fichier</b>: '+response.fichier;
        str+='</div>';        
        str+='<input type="hidden" id="idphoto" name="idphoto" value="'+idphoto+'" />';
        str+='<input type="hidden" id="nomfichier" name="nomfichier" value="'+response.fichier+'" />';
        str+='<input type="hidden" id="appel" name="appel" value="'+pageadmin+'" />';
        str+='</form>';
           
        document.getElementById("myImage").innerHTML += str;
        //+document.getElementById("myImage").innerHTML;
    }             
}


// Ré assigne une photo à un autre modèle ou à un autre moule afin de corriger des erreurs d'attribution
// -------------------------------
function assignePhoto(idphoto){
    console.debug ("\nassignePhoto()\n");
    if ((idphoto !== undefined) && (idphoto !== null) && (idphoto>0)){    
        var url= url_serveur+'getphotosmodelesmoules.php';
        var mydata="?idphoto="+idphoto;  
        ajax_PhotoAssigne(url, mydata);
    }
}

// Lance l'appel Ajax 
// `bdm_photo` (`idphoto`, `legende`, `copyright`, `fichier`, `refmodele`, `refmoule`) 
// -----------------------
function ajax_PhotoAssigne(url, mydata){ 
    if ((url !== undefined) && (url.length>0) && (mydata !== undefined) && (mydata.length>0)){
        // GET avec fetch()
        fetch(url+mydata, myInitGet)
        .then(response => response.text())  // Le retour est aussi une chaîne
        .then(response => {           
            // console.debug ("\n"+response+"\n");
            selectAssignePhoto(response); 
                    })  // as usual...              
        .catch(error => console.debug("Erreur : "+error));
    }
}


// ------------------------
function selectAssignePhoto(response){

// '{"idphoto":'.$idphoto.', "modeles":'.json_encode($data).', "moules":[]}';
let msg='';
let tSearch = [];
let idphoto = 0;
let typemodele=0;
    if ((response !== undefined) && (response !== null)){ 
        //console.debug("Response:\n"+response)
        const objModele = JSON.parse(response);
        if ((objModele.idphoto !== undefined) && (objModele.idphoto > 0)){
            idphoto=objModele.idphoto;
        }              
        
        //console.debug("Id Photo:"+idphoto);
                          
        if ((objModele.modeles !== undefined) && (objModele.modeles !== null) && (objModele.modeles.length > 0)){
            msg='Sélectionnez le Modèle pour l\'image '+idphoto;
            //console.debug("Msg: "+ msg);
            typemodele=1;
            for(let i in objModele.modeles ) { 
                let tAux=[];
                tAux.push(objModele.modeles[i].id, objModele.modeles[i].nom, 0);
                tSearch.push(tAux);
            }
        } 
        else if ((objModele.moules !== undefined) && (objModele.moules !== null) && (objModele.moules.length > 0)){
                msg='Sélectionnez le Moule pour l\'image '+idphoto;   
                //console.debug("Msg: "+ msg);   
                typemodele=2;      
                for(let i in objModele.moules ) { 
                    let tAux=[];
                    tAux.push(objModele.moules[i].idmoule, objModele.moules[i].mdescription, objModele.moules[i].refmodele);
                    tSearch.push(tAux);
            } 
        }
    }
    // Mise en page
    if ((idphoto>0) && (tSearch !== undefined) && (tSearch !== null) && (tSearch.length > 0)){
        //console.debug("tSearch:\n"+tSearch);                
        let str='<h4>'+msg+'</h4>';
        str+='<form name="SearchForm">';
        str+='<select name="selectid" id="selectid" onchange="assignePhotoToId();">';
        //console.debug("Photo Id:"+idphoto);
        for(let i in tSearch){
            //console.debug(tSearch[i]);
            str+='<option value="'+tSearch[i][0]+'" selected>'+tSearch[i][1]+'</option>';        
        }
        str+='</select>'; 
        str+='<input type="hidden" id="idphoto" name="idphoto" value="'+idphoto+'" />';   
        str+='<input type="hidden" id="typemodele" name="typemodele" value="'+typemodele+'" />';           
        str+='</form>';
        //console.debug("Form:\n"+str);
        document.getElementById("infomodelessearch").innerHTML = str;            
    }        
}


// -----------------------
function ajax_PhotoSet(url, mydata){ 
    if ((url !== undefined) && (url.length>0) && (mydata !== undefined) && (mydata.length>0)){
        // GET avec fetch()
        fetch(url+mydata, myInitGet)
        .then(response => response.text())  // Le retour est aussi une chaîne
        .then(response => {           
            console.debug ("\n"+response+"\n");
            const objModele = JSON.parse(response);  
            if ((objModele.ok==1) && (objModele.id !== undefined) && (objModele.id > 0)){
                console.debug ("ID modèle affecté\n"+objModele.id);
                idmodeleglobal = parseInt(objModele.id);                          
                if (idmodeleglobal>0){
                    setCookie("sidmodele", idmodeleglobal, 30); // 30 jours
                    // Affiche le moule sélectionné 
                    getModeleMoulesImages(idmodeleglobal); 
                    reserverModeleMoules(idmodeleglobal);
                }
            } ;
                    })  // as usual...              
        .catch(error => console.debug("Erreur : "+error));
    }
}

// ---------------------------
function assignePhotoToId(){
console.debug("assignePhotoToId()");
    let id = document.forms["SearchForm"]["selectid"];
    let idphoto = document.forms["SearchForm"]["idphoto"];
    let type = document.forms["SearchForm"]["typemodele"];
    
    //console.debug("Id photo : "+idphoto.value);
    //console.debug("Type : "+type.value);
           
    if ((id.value !== '')  && (parseInt(id.value) > 0 )){
        console.debug("Id : "+id.value);
        if (type.value==1){ // Modèle
            // Modifier la table photo
            console.debug("Modifier la référence du modèle "+id.value+" pour la photo "+idphoto);
            var url= url_serveur+'setphoto.php';
            var mydata="?idphoto="+idphoto.value+'&idmodele='+id.value;  
            ajax_PhotoSet(url, mydata);
        } 
        else if (type.value==2){ // Moule
            // Modifier la table photo
            console.debug("Modifier la référence du moule "+id.value+" pour la photo "+idphoto.value);   
            var url= url_serveur+'setphoto.php';
            var mydata="?idphoto="+idphoto.value+'&idmoule='+id.value;  
            ajax_PhotoSet(url, mydata);       
        }         
    }        
}

