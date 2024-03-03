<?php
// Script à ne pas supprimer
// Supprime une photo de la Base de données
// datas du formulaire en input, redirection vers la page appelante en sortie
// Eviter touts les affichages avant la fin du script

include ("./include/config.php");
include ("./include/mysql.php");

$debug = false;
$delete = '';
$appel='';  // Page appelante
$reponse='';

$idphoto=0;
$nomfichier = '';

$mysqli=NULL; // BD class data

// Get the contents
if (isset($_SERVER['REQUEST_METHOD']) && (strtoupper($_SERVER['REQUEST_METHOD']) !== 'POST')) {
  throw new Exception('Only POST requests are allowed');
}

if (!empty($_POST['appel'])) {
    $appel = $_POST['appel'];  
}

if (!empty($_POST['delete'])) {
    $delete = $_POST['delete'];  
}

if (!empty($_POST['nomfichier'])) {
    $nomfichier = $_POST['nomfichier'];
}


if (!empty($_POST['idphoto'])) {
    $idphoto = $_POST['idphoto'];  
}

    // Debug
    if ($debug){
        echo "ID photo: $idphoto, Nom du fichier: $nomfichier<br />\n";                
    }           

    // Supprimer les fichiers sauvegardés 
     if (!empty($idphoto) && ($delete=="Confirmer") && !empty($nomfichier)){

        // Debug
        if ($debug){
            echo "Suppression<br />\nId moule: $idphoto <br />\n";                
        }           

        connexion_db();
        $reponse = mysql_delete_photo($idphoto);
        $mysqli -> close();
        
        if (!empty($reponse)){
            // A appeler APRES avoir modifié la BD    
    	   if (file_exists(DATAPATH_IMAGES.$nomfichier)){
                // supprimer les fichiers
                unlink(DATAPATH_IMAGES.$nomfichier);
            }           
            if (file_exists(DATAPATH_VIGNETTES.$nomfichier)){
                unlink(DATAPATH_VIGNETTES.$nomfichier);		
            }       
        }  
        
        if (!$debug){
            if (!empty($reponse)){ 
                header("Location: ".$appel."?msg=Photo supprimée. ");
            }
            else{
                header("Location: ".$appel."?msg=Erreur à la suppression d'une photo. ");
            }                 
        }
        else{
            if (!empty($reponse)){ 
                echo ("Photo supprimée. ");
            }
            else{
                echo("Erreur à la suppression d'une photo. ");
            }                         
        }
    }
    else{
        if (!$debug){
            header("Location: ".$appel."?msg=Données manquantes pour la suppression d'une photo. ");
        }
        else{
            echo("Données manquantes pour la suppression d'une photo. ");
        }                     
    }
    
die();   

//--------------------------
function mysql_delete_photo(){ 
global $debug;
global $reponse;
global $mysqli;
global $idphoto;

$sql='';
    if (!empty($idphoto)){
        $sql="DELETE FROM `bdm_photo` WHERE `idphoto`=".$idphoto." ;";
        // Debug
        if ($debug){
            echo "SQL: ".$sql."<br />\n";                
        }           
        if ($result = $mysqli->query($sql)){
            // récupérer l'id créé
             $reponse = '{"ok"=1, "idphoto":'.$idphoto.'}';  
        }                    
    }
    return $reponse;
}



?>


