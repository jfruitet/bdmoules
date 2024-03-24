// JavaScript Document
  
    var idmodele=37;// Excalibur
    var idmoule=46;
    var tidmoules=[46,47];
    
    var name = '';               
    var email = '';    
    var phone = '';   
    var adresse = '';  
    var comment = '';     
    
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
    

//--------------------------------
function validationReservation()  {                                  

    name = document.forms["RegForm"]["Nom"];               
    email = document.forms["RegForm"]["Email"];    
    phone = document.forms["RegForm"]["Telephone"];   
    adresse = document.forms["RegForm"]["Adresse"];  
    comment = document.forms["RegForm"]["Commentaire"];  

    if (name.value == "")                                  
    { 
        alert("Mettez votre nom."); 
        name.focus(); 
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
    getInfosMoulesModule();
    //envoiReservationMailto();
    return true; 
}

// -----------------------
function  getInfosMoulesModule(){
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


// ----------------------- 
function redigeReservation(response){
// 
    console.debug("redigeReservation()");
    
    let body='%0A%0ANom: '+name+'%0A%0AEmail: '+email+'%0A%0ATéléphone: '+phone+'%0A%0AAdresse: '+adresse+'%0A%0ACommentaire '+comment;
    body+='%0A%0A'+JSON.stringify(response);
    
    console.debug("body\n");
    document.getElementById("myInfo").innerHTML = '<a href="mailto:bureau-arbl@laposte.net?cc=jean.fruitet@free.fr&subject=Réservation moules&body='+body+'>Envoyer Email</a>';
      
}      

/*****************
// ----------------------- 
function envoiReservation(){
// envoie le contenu JSON de la demande de réservation au serveur
    console.debug("envoiReservation()");
    
    var mystrjson='';
    //var mystr='';

    name = document.forms["RegForm"]["Nom"].value;               
    email = document.forms["RegForm"]["Email"].value;    
    phone = document.forms["RegForm"]["Telephone"].value;   
    adresse = document.forms["RegForm"]["Adresse"].value;  
    var comment = document.forms["RegForm"]["Commentaire"].value; 
    var idmodele = document.forms["RegForm"]["idmodele"].value;               
    var idmoule = document.forms["RegForm"]["idmoule"].value;               

    mystrjson+='{"idmodele":"'+idmodele+'", "idmoule":"'+idmoule+'", Nom":"'+name+'", "Email":"'+email+'", "Telephone":"'+phone+'", "Adresse":"'+adresse+'", "Commentaire":"'+comment+'"}';
    //mystr+='idmodele='+idmodele+'&idmoule='+idmoule+'&Nom='+name+'&Email='+email+'&Telephone='+phone+'&Adresse='+adresse+'&Commentaire='+comment;
        
    console.debug("JSON: "+mystrjson+"\n");
    //console.debug("STR: "+mystr+"\n");
        
    //var url= url_serveur+'reservation.php';
    var url= url_serveur+'reservation_json.php';
    console.debug("URL: "+ url);
    //ajax_post(url, mystrjson);
    ajax_get(url, mystrjson);
 }
*******************/ 
 

/********************************
 * 
 * 
 * 

// Envoi d'un formulaire avec Ajax en Post
// ----------------------- 
function ajax_post(url, mystrjson){    
    console.debug("Ajax Post "+ url+" "+mystrjson);
    if ((url !== undefined) && (url.length>0) && (mystrjson !== undefined) && (mystrjson.length>0)){ 
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById("consigne").innerHTML = this.responseText;
            }
        };
        xhttp.open("POST", url, true);
        xhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
        xhttp.send(mystrjson);             
    }
}

// Envois de formulaires par Fetch et POST
// En erreur sur Firefox et sur Google Chrome
// ----------------------- 
function ajax_post_fetch(url, mystrjson){    
    console.debug("Ajax Post "+ url+"\n"+mystrjson);
    if ((url !== undefined) && (url.length>0) && (mystrjson !== undefined) && (mystrjson.length>0)){ 
        
        // POST avec fetch()
        fetch(url, {
            method: 'POST',
            headers: {'Content-Type': 'application/json;charset=UTF-8'},
            //body: JSON.stringify(myjson), // turn the JS object literal into a JSON string
         
            body: mystrjson, // mystrjson est déjà une chaîne
            referrer: "about:client", //ou "" (pas de réferanr) ou une url de l'origine
            referrerPolicy: "no-referrer-when-downgrade", //ou no-referrer, origin, same-origin...
            //mode: "cors", //ou same-origin, no-cors
            mode: "same-origin",
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
}

*******************************/



