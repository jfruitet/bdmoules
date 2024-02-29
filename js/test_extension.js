// JavaScript Document
    let nomfichier="Voilier_Mini-Cedar";
    let nomfichiertemporaire="12345.jpg";
    
    console.debug("Nomfichier "+ nomfichier);
    console.debug("Nomfichiertemporaire "+ nomfichiertemporaire);
    
    function verifExtensionFichier(){
        const  regex = /\./;

        if (!regex.test(nomfichier)){
            console.debug("Pas d'extension dans "+nomfichier);
            if (regex.test(nomfichiertemporaire)){
                console.debug("Extension dans "+nomfichiertemporaire);
                const myArray = nomfichiertemporaire.split(".");
                console.debug(myArray);
                nomfichier.value += '.'+myArray.slice(-1);
                console.debug("Nomfichier "+ nomfichier);
                
                alert("Vérifiez l'extension du nom de fichier."+nomfichier);   

                return false;
            }
            else{
                alert("Ajoutez une extension ad hoc au nom de fichier.");   
                nomfichier.focus();
                return false;            
            }
        }
    }
        
