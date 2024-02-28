<?php
// Script à ne pas supprimer
// Ajoute une photo à la Base de données
// datas du formulaire en input, redirection vers la page appelante en sortie
// Eviter touts les affichages avant la fin du script

include ("./include/config.php");
include ("./include/mysql.php");

$debug = false;
$appel='';  // Page appelante
$reponse='';
$idmodele=0;
$idmoule=0;
$idphoto=0;
$modelenom='';
$auteur='';
$legende='';
$copyright = '';
$nomfichier = '';
$nomfichiertemporaire = '';
$okrenamefile=false;
$okfilerenamed=false;

$mysqli=NULL; // BD class data

// Get the contents
if (isset($_SERVER['REQUEST_METHOD']) && (strtoupper($_SERVER['REQUEST_METHOD']) !== 'POST')) {
  throw new Exception('Only POST requests are allowed');
}

if (!empty($_POST['appel'])) {
    $appel = $_POST['appel'];  
}

if (!empty($_POST['auteur'])) {
    $auteur = $_POST['auteur'];  
}

if (!empty($_POST['modelenom'])) {
    $modelenom = $_POST['modelenom'];  
}

if (!empty($_POST['legende'])) {
    $legende = $_POST['legende'];  
}

if (!empty($_POST['licence'])) {
    $copyright = $_POST['licence'];  
}

// Nom du fichier à sauvegarder
if (!empty($_POST['nomfichiertemporaire'])) {
    $nomfichiertemporaire = $_POST['nomfichiertemporaire'];  
}

if (!empty($_POST['nomfichier'])) {
    $nomfichier = $_POST['nomfichier'];
    if (!empty($nomfichiertemporaire) && ($nomfichier != $nomfichiertemporaire)){
        $okrenamefile=true;
    }  
}
else{
    $nomfichier = $nomfichiertemporaire;
}


if (!empty($_POST['idmodele'])) {
    $idmodele = $_POST['idmodele'];  
}

if (!empty($_POST['idmoule'])) {
    $idmoule = $_POST['idmoule'];  
}

// Mise à jour
if (!empty($_POST['idphoto'])) {
    $idphoto = $_POST['idphoto'];  
}

    // Debug
    if ($debug){
        echo "ID photo: $idphoto, ID moule: $idmoule, ID modèle: $idmodele, Modèle: $modelenom, Auteur: $auteur, Légende: $legende, Copyrigth: $copyright, Nom du fichier: $nomfichier, Nom du fichier temporaire: $nomfichiertemporaire<br />\n";                
    }           

    // Renommer le fichier sauvegardé 
    // A appeler AVANT de modifier la BD
    if ($okrenamefile){
    	if (file_exists(DATAPATH_IMAGES.$nomfichiertemporaire)){
            // Renommer les fichiers
            rename (DATAPATH_IMAGES.$nomfichiertemporaire, DATAPATH_IMAGES.$nomfichier);
        }           
        if (file_exists(DATAPATH_VIGNETTES.$nomfichiertemporaire)){
            rename (DATAPATH_VIGNETTES.$nomfichiertemporaire, DATAPATH_VIGNETTES.$nomfichier);		
        }         
    }        
    
 
    if (empty($idphoto) && (!empty($idmodele) || empty($idmoule))){ // Ajout d'une ligne dans la BD
		connexion_db();
		$reponse = mysql_add_photo();
        $mysqli -> close();
        if (!$debug){
            if (!empty($reponse)){ 
                // header("Location: ".$appel."?msg=Nouvelle photo enregistrée. ".$reponse);
                header("Location: ".$appel."?msg=Nouvelle photo enregistrée. ");
    		}
		    else{
                header("Location: ".$appel."?msg=Erreur à l'enregistrement de la photo.");   
            }    
        }
        else{
            if (!empty($reponse)){ 
                echo "Nouvelle photo enregistrée. ".$reponse;
            }
            else{
                echo "Erreur à l'enregistrement de la photo. "; 
            }
        }      
    }
    else if (!empty($idphoto)){ // Update
    		        
        connexion_db();
		$reponse = mysql_update_photo();
        $mysqli -> close();
            
	    if (!$debug){
            if (!empty($reponse)){ 
                //header("Location: ".$appel."?msg=Photo mise à jour. ".$reponse);
                header("Location: ".$appel."?msg=Photo mise à jour. ");
    		}
		    else{
                header("Location: ".$appel."?msg=Erreur à la mise à jour de la photo.");   
            }    
        }
        else{
            if (!empty($reponse)){ 
                        echo "Photo mise à jour. ".$reponse;
            }
            else{
                echo "Erreur à la mise à jour de la photo. "; 
            }    
        }              
    }
    else{                
	    if (!$debug){
            header("Location: ".$appel."?msg=Erreur de connexion, données manquantes.");   
        }            
        else{
             echo "Erreur de connexion, données manquantes. ";               
        }                 
    }

die();   

// -------------------------
function mysql_rename_files(){
// N'est pas utile car si un fichier doit être renommé c'est seulement quand le fichier temporaire 
// est remplacé par un nom de fichier plus explicite et avant même que la ligne concernant cette image soit placée dans la BD
global $debug;
global $mysqli;
global $nomfichier;
global $nomfichiertemporaire;
    $reponse='';
    $sql='';
	if (!empty($nomfichier) && !empty($nomfichiertemporaire)){ 
        $sql="UPDATE `bdm_photo` SET `fichier`='$nomfichier', `fichier`='$nomfichier' WHERE `fichier`='$nomfichiertemporaire'";
 		// Debug
        if ($debug){
            echo "SQL: ".$sql."<br />\n";                
        }           
		if ($result = $mysqli->query($sql)){
			$reponse = '{"ok"=1, "nomfichier":'.$nomfichier.'}';  	
        }                    
    }
    return $reponse;
}

//--------------------------
function mysql_add_photo(){ 
global $debug;
global $idphoto;
global $mysqli;
global $idmodele;
global $idmoule;
global $nommodele;
global $auteur;
global $legende;
global $copyright;
global $nomfichier;

$reponse='';
$sql='';
$idphoto=0;

	if (!empty($nomfichier)){ 
        if (!empty($idmoule)){
            $sql="INSERT INTO `bdm_photo` ( `auteur`, `legende`, `copyright`, `fichier`, `refmoule`) VALUES ('".addslashes($auteur)."', '".addslashes($legende)."', '".addslashes($copyright)."', '".$nomfichier."', ".$idmoule.")";
        }
        else if (!empty($idmodele)){
            $sql="INSERT INTO `bdm_photo` ( `auteur`, `legende`, `copyright`, `fichier`, `refmodele`) VALUES ('".addslashes($auteur)."', '".addslashes($legende)."', '".addslashes($copyright)."', '".$nomfichier."', ".$idmodele.")";        
        }
 		// Debug
        if ($debug){
            echo "SQL: ".$sql."<br />\n";                
        }           
		if ($result = $mysqli->query($sql)){
			// récupérer l'id créé
			$idphoto = $mysqli->insert_id;
			$reponse = '{"ok"=1, "idphoto":'.$idphoto.', "nomfichier":"'.$nomfichier.'"}';   			
        }                    
    }
    return $reponse;
}


// -------------------------
function mysql_update_photo(){
global $debug;

global $mysqli;
global $idphoto;
global $idmodele;
global $idmoule;
global $nommodele;
global $auteur;
global $legende;
global $copyright;
global $nomfichier;
global $nomfichiertemporaire;

    $reponse='';
    $sql='';
// idphoto 	auteur 	legende copyright 	fichier 	refmodele   refmoule

	if (!empty($idphoto) && !empty($idphoto)){ 
        $sql="UPDATE `bdm_photo` SET `auteur`='$auteur', `legende`='$legende', `copyright`='$copyright', `fichier`='$nomfichier', `refmodele`=$idmodele, `refmoule`=$idmoule WHERE `idphoto`=$idphoto";
 		// Debug
        if ($debug){
            echo "SQL: ".$sql."<br />\n";                
        }           
		if ($result = $mysqli->query($sql)){
			$reponse = '{"ok"=1, "idphoto":'.$idphoto.', "nomfichier":"'.$nomfichier.'"}';  	
        }                    
    }
    return $reponse;
}



?>


