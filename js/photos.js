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



/**********************************************
 * 
 * AJOUT DE PHOTOS A LA BD
 * 
 * ********************************************/
// https://blog.lesieur.name/coder-proprement-en-javascript-par-l-exemple-upload-d-image/


/****************************

// ----------------------------- 
Function.prototype.namedParameters = function(type, list, error) {
  var params,
    callback = type,
    regex = /^(?:function *[a-zA-Z0-9_$]*)? *\(? *([a-zA-Z0-9_$, ]*) *\)?/g,
    functions = list || {};

  if (type instanceof Array) {
    callback = type.pop();
    params = type;
  } else {
    params = ((regex.exec(callback.toString()) || [1]).slice(1)[0] || "").split(',')
  }

  params = params.map(function(item) {
    var key = item.trim();
    if (functions.hasOwnProperty(key)) {
      return functions[key];
    } else {
      return (error && error(key)) || new Error('Named parameter `' + key + "` doesn't exist.");
    }
  });

  callback.apply(this, params);
};

// Logic 

(function() {
  function selectImage(afterSelectCallback) {
    var inputFile = document.createElement("input");
    inputFile.type = "file";
    inputFile.accept = "image/*";

    inputFile.addEventListener("change", function() {
      if (afterSelectCallback) {
        afterSelectCallback(inputFile);
      }
    });

    return inputFile;
  }

  function readImage(inputFile, callback) {
    var reader = new FileReader();

    reader.addEventListener("load", function() {
         
      var image = document.createElement("img");

      image.addEventListener("load", function() {
        if (callback) {
          callback(image, reader);
        }
      });

      image.src = reader.result;
      image.title = reader.name;
    });

    reader.readAsDataURL(inputFile.files[0]);
  }

  function resizeWithSameRatio(options, callback) {
    var width = options.width || 0,
      height = options.height || 0,
      maxWidth = options.maxWidth || 400,
      maxHeight = options.maxHeight || 300

    if (width > height) {
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
    } else {
      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }
    }

    Function.namedParameters(callback, {
      width: width,
      height: height
    });
  }

  function thumbnailWithCanvas(options, callback) {
    var imageSource = options.imageSource || document.createElement("img"),
      width = options.width || 0,
      height = options.height || 0,
      canvas = document.createElement("canvas"),
      imageResult = document.createElement("img"),
      context;

    canvas.width = width;
    canvas.height = height;

    context = canvas.getContext("2d");
    context.drawImage(imageSource, 0, 0, width, height);

    imageResult.addEventListener("load", function() {
      Function.namedParameters(callback, {
        imageResult: imageResult,
        canvas: canvas
      });
    });

    imageResult.src = canvas.toDataURL("image/jpg", 0.8);
  }

  function reduceImage(imageSource, callback) {
    resizeWithSameRatio({
      height: imageSource.height,
      maxHeight: 300,
      width: imageSource.width,
      maxWidth: 400
    }, function(height, width) {
      thumbnailWithCanvas({
        imageSource: imageSource,
        width: width,
        height: height
      }, function(canvas, imageResult) {
        callback(imageResult, canvas);
      })
    });
  }

  function uploadImage(options, callback) {
    var xhttp = new XMLHttpRequest(),
      formData = new FormData();

    url = options.url || new Error("`options.url` parameter invalid for `uploadImage` function.");
    image = options.image || new Error("`options.image` parameter invalid for `uploadImage` function.");

    if (url instanceof Error) {
      throw url;
    }
    if (image instanceof Error) {
      throw image;
    }

    //formData.append("image", image.src.substring("0", "100")); // Remove substring, it's just to allow mokup response to work.
    formData.append("image", image.src); 
    xhttp.open("POST", url, true);

    xhttp.addEventListener("load", function() {
      if (xhttp.status < 200 && xhttp.status >= 400) {
        return Function.namedParameters(callback, {
          error: new Error("XHR connection error for `uploadImage` function."),
          response: null
        });
      }
      Function.namedParameters(callback, {
        error: null,
        response: xhttp.responseText
      });
    });

    xhttp.addEventListener("error", function(test) {
      Function.namedParameters(callback, {
        error: new Error("XHR connection error for `uploadImage` function."),
        response: null
      });
    });

    xhttp.send(formData);
  }

  // Exec 

  // var body = document.getElementsByTagName("body")[0];
  var myFile = document.getElementById("myFile");
  
  myFile.appendChild(
    selectImage(function(inputFile) {
      readImage(inputFile, function(image) {
        reduceImage(image, function(imageResult) {
          uploadImage({
            // url: "https://www.mocky.io/v2/5773cc3c0f0000950c597af9",
            url: url_serveur+"addfilebypost.php",
            image: imageResult
          }, function(error, response) {
            var data = document.createElement("div");
            data.textContent = (error) ? error : response;

            myFile.appendChild(data);
            myFile.appendChild(imageResult);
            
            console.debug("Data:"+data);
            console.debug("imageResult:"+imageResult);
            
          });
        });
      });
    })
  );
}());    

************************/

// ---------------------
function readFile(input, idmodele=0, idmoule=0) {
    const preview =  document.querySelector("#preview");
    const file = input.files[0];
    
    // ------------------------------
    function readAndPreview(file) {
        // On s'assure que `file.name` termine par
        // une des extensions souhaitées
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
                                console.debug("Temporary Filename: "+responseObj.tmp);   
                                newLegendePhoto(responseObj.nomf,responseObj.tmp, idmodele, idmoule);                             
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
    console.debug ("newPhoto()");

    if ((idmodeleglobal !== undefined) && (idmodeleglobal > 0)){
        idmodele=idmodeleglobal;
    }
    
    if ((idmouleglobal !== undefined) && (idmouleglobal > 0)){        
        idmoule=idmouleglobal;
    }

    console.debug ("Id modele: "+idmodele);
    console.debug ("Id moule: "+idmoule);
    
        let str='';
        // Formulaire de création
        str+='<h4>Chargez une image</h4>';
        str+='<div><form name="uneImage">';
        if (idmodele>0){
            str+='<label for "browse">Choisissez une photo pour le modèle '+idmodele+' </label> ';
        }
        else{
            str+='<label for "browse">Choisissez une photo </label> ';
        }
        str+='<input type="file" id="browse" name="browse" accept="image/png, image/jpeg, image/gif" onchange="readFile(this,'+idmodele+','+idmoule+')" />';               
        str+='</form>';   
        str+='<div id="preview"></div>';       
        document.getElementById("myPhoto").innerHTML += str;
    
}



// ---------------------------------------
// Formulaire de création d'une photo rattaché à un modèle
// Envoi du formulaire vers serveur PHP sans appel Ajax
// Compatible Firefox
//  ----------------------------------
function newLegendePhoto(nomfichier, nomfichiertemporaire, idmodele=0, idmoule=0){
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
        str+='<div class="button"><input type="submit" value="Envoyer" name="Envoyer" onclick="return verifSaisieAddPhoto();" /> <input type="reset" value="Réinitialiser" name="Reset" /></div>';        
         //  id 	nom 	descriptif 	dimension [long x larg x haut] 	categorie 	timestamp 	
        str+='<div>';
        if (okmodele){
            str+='<label for="modelenom">Modèle '+idmodele+'</label><br /><input type="text" id="modelenom" size="50" name="modelenom" value="'+modelname+'" autocomplete="on" />';
        }
        else{
            str+='<label for="modelenom">Nom de ce modèle: </label><br /><input type="text" id="modelenom" size="50" name="modelenom" value="" autocomplete="on" />';        
        }        
        str+='<br /><label for="auteur">Auteur: </label><br /><input type="text" id="auteur" size="50" name="auteur" value="" autocomplete="on" />';
        str+='<br /><label for="legende">Légende: </label><textarea cols="50" id="legende" rows="2" name="legende" autocomplete="on"></textarea>';
        str+='<br /><label for="licence">Licence: </label><select name="licence" id="licence" autocomplete="on">';
        str+='<option value="">--Sélectionnez une licence Creative Commons--</option>';
        str+='<option value="cc-by">CC-by (Attribution)</option>';
        str+='<option value="cc-by-sa">CC-by-sa (Attribution / Partage dans les mêmes conditions)</option>';
        str+='<option value="cc-by-nd">CC-by-nd (Attribution / Pas de Modification)</option>';
        str+='<option value="cc-by-nc">CC-by-nc (Attribution / Pas d’Utilisation Commerciale)</option>';
        str+='<option value="cc-by-nc-sa">CC-by-nc-sa (Attribution / Pas d’Utilisation Commerciale / Partage dans les mêmes conditions)</option>';
        str+='<option value="cc-by-nc-nd">CC-by-nc-nd (Attribution / Pas d’Utilisation Commerciale / Pas de Modification)</option>';
        str+='</select>';        
        str+='</div>';   
        //str+='<div id="preview"></div>';
        str+='<input type="hidden" id="nomfichier" name="nomfichier" value="'+nomfichier+'" />';        
        str+='<input type="hidden" id="nomfichiertemporaire" name="nomfichiertemporaire" value="'+nomfichiertemporaire+'" />';        
        str+='<input type="hidden" id="idmodele" name="idmodele" value="'+idmodele+'" />';        
        str+='<input type="hidden" id="idmoule" name="idmoule" value="'+idmoule+'" />';        
        str+='<input type="hidden" id="appel" name="appel" value="'+pageadmin+'" />';
        str+='</form>';   
       
        document.getElementById("myImage").innerHTML = str;
    
}

// -----------------------------------------
// Vérification des données
function verifSaisieAddPhotoe(){   
    photoauteur = document.forms["AddFormPhoto"]["auteur"];               
    photolegende = document.forms["AddFormPhoto"]["legende"];    
    photolicence = document.forms["AddFormPhoto"]["licence"];   
    photofile = document.forms["AddFormPhoto"]["photofile"];  
     if ( photoauteur.value == "")                                  
    { 
        alert("Complétez le nom du photographe."); 
        photoauteur.focus(); 
        return false; 
    }    
    if ( photolegende.value == "")                               
    { 
        alert("Complétez la légende de la photo."); 
        photolegende.focus(); 
        return false; 
    }        
    if ((photofile === undefined) || (photofile === null))                 
    { 
        alert("Téléchargez une image."); 
        photofile.focus(); 
        return false; 
    }     
     

    return true;
}



// -----------------------------------
// Edite le modele associé à un modèle particulier
function editPhoto(idmodele, index){
    console.debug ("Editer ce modèle: "+idmodele);   
    
    if ((idmodele !== undefined) && (idmodele>0) 
        && (tPhotos[index] !== undefined) && (tPhotos[index] !== null) && (tPhotos[index].length>0)){
        console.debug ("tPhoto: "+tPhotos[index]);
        let str='';
        let url= url_serveur+'editmodelebypost.php';
        // Formulaire de création
        str+='<h4>Complétez ce formulaire</h4>';
        str+='<form name="EditFormPhoto" action="'+url+'" method="post">';
        str+='<div class="button"><input type="submit" value="Envoyer" name="Envoyer" onclick="return verifSaisieAddPhoto();" /> <input type="reset" value="Réinitialiser" name="Reset" /></div>';        

        //  id 	nom 	descriptif 	dimension [long x larg x haut] 	categorie 	timestamp 	
        str+='<div><label for="modelenom">Nom: </label><br /><input type="text" id="modelenom" size="50" name="modelenom" value="'+tPhotos[index][1]+'" autocomplete="on" />';
        str+='<br /><textarea cols="50" id="modeledescriptif" rows="3" name="modeledescriptif" autocomplete="on">'+tPhotos[index][2]+'</textarea>';
        str+='<br /><label for="modeledimensions">Dimensions: </label>'; 
        str+='<input type="text" id="modeledimensions" size="20" name="modeledimensions" value="'+tPhotos[index][3]+'" autocomplete="on" />';
        str+='<br /><label for="modelecategorie">Catégorie: </label>';
        str+='<select name="modelecategorie[]" id="modelecategorie" multiple>';
        str+='<option value="">--Sélectionnez au moins une catégorie--</option>';
        let options = tPhotos[index][4].split(",");
        if (options.includes("avion")){         
            str+='<option value="avion" selected>Avion</option>';
        }
        else{
            str+='<option value="avion">Avion</option>';                    
        }            
        if (options.includes("planeur")){           
                str+='<option value="planeur" selected>Planeur</option>';
        }
        else{
                str+='<option value="planeur">Planeur</option>';       
        }
        if (options.includes("voilier")){           
                str+='<option value="voilier" selected>Voilier</option>';
        }
        else{
                str+='<option value="voilier">Voilier</option>';
        }            
        if (options.includes("bateau")){           
                str+='<option value="bateau" selected>Bateau</option>';
        }
        else{
                str+='<option value="bateau">Bateau</option>';
        }
        if (options.includes("maquette")){           
                str+='<option value="maquette" selected>Maquette</option>';
        }
        else{
                str+='<option value="maquette">Maquette</option>';
        }    
        if (options.includes("plan")){           
                str+='<option value="plan" selected>Plan</option>';
        }
        else{
                str+='<option value="plan">Plan</option>';
        }
        if (options.includes("autre")){           
                str+='<option value="autre" selected>Autre</option>';
        }
        else{
                str+='<option value="autre">Autre</option>';
        }
        
        str+='</select>';        
        str+='</div>';        
        str+='<input type="hidden" id="appel" name="appel" value="'+pageadmin+'" />'
        str+='<input type="hidden" id="idmodele" name="idmodele" value="'+idmodele+'" />';
        str+='</form>';      
        document.getElementById("myImage").innerHTML = str;    
    }       
}


// -----------------------------------
// Edite le modele associé à un modèle particulier
function deletePhoto(idphoto, index){
    console.debug ("Supprimer cette photo : "+idphoto);
    console.debug ("Index:"+index);     
    
    if ((idphoto !== undefined) && (idphoto>0) 
        && (tPhotos[index] !== undefined) && (tPhotos[index] !== null) && (tPhotos[index].length>0)){

        let str='';
        let url= url_serveur+'deletephotobypost.php';
        // Formulaire de création
        str+='<h4>Confirmez la suppression de cette photo !</h4>';
        str+='<form name="DelFormPhoto" action="'+url+'" method="post">';
        str+='<div class="button"><input type="submit" name="delete" value="Confirmer" /> <input type="submit" name="delete" value="Annuler" /></div>';        

       // 	photoid 	legende [légende photo] 	copyright 	fichier 	refmodele [référence un modèle] 	refmoule [référence un élément] 	
        str+='<div><b>#ID</b>: '+tPhotos[index][0]+'<br /><b>Auteur:</b> '+tPhotos[index][1];
        str+='<br /><b>Légende</b>: '+tPhotos[index][2];
        str+='<br /><b>Licence CC</b>: '+tPhotos[index][3];
        str+='<br /><b>Fichier</b>: '+tPhotos[index][4];
        str+='</div>';        
        str+='<input type="hidden" id="appel" name="appel" value="'+pageadmin+'" />';
        str+='</form>';
           
        document.getElementById("myImage").innerHTML = str;
    }             
}


