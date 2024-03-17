<?php
// Script à ne pas supprimer
// Ajoute un modele à la Base de données
// datas du formulaire en input, redirection vers la page appelante en sortie
// Eviter touts les affichages avant la fin du script
// Session activée 
include ("./include/config.php");
include ("./include/session.php");

if (!isset($role) || ($role<AUTEUR)){
    echo '{"Ok":0, "msg":"Vous n\'avez pas accès à cette fonction"}';
    die();    
}

include ("./include/mysql.php");

$debug = false;
$appel='';  // Page appelante
$reponse='';
$idmodele=0;
$nom='';
$descriptif='';
$dimension = '';
$categorie = '';

$mysqli=NULL; // BD class data

// Get the contents
if (isset($_SERVER['REQUEST_METHOD']) && (strtoupper($_SERVER['REQUEST_METHOD']) !== 'POST')) {
  throw new Exception('Only POST requests are allowed');
}


if (!empty($_POST['appel'])) {
    $appel = $_POST['appel'];  
}

if (!empty($_POST['modelenom'])) {
    $nom = $_POST['modelenom'];  
}

if (!empty($_POST['modeledescriptif'])) {
    $descriptif = $_POST['modeledescriptif'];  
}

if (!empty($_POST['modeledimensions'])) {
    $dimension = $_POST['modeledimensions'];  
}

if (!empty($_POST['modelecategorie'])) {
    $categorie = implode(",",$_POST['modelecategorie']);  
}


    // Debug
    if ($debug){
        echo "Nom: $nom, Description: $descriptif, Dimension: $dimension, Catégorie: $categorie<br />\n";                
    }           

    connexion_db();
    $reponse = mysql_add_modele();
    $mysqli -> close();


if (!$debug){
    if (!empty($reponse)){ 
        header("Location: ".$appel."?msg=Nouveau modele enregistré. ".$reponse);
    }
    else{
        header("Location: ".$appel."?msg=Erreur à l'enregistrement du modele.");   
    }    
}
else{
    if (!empty($reponse)){ 
        echo "Nouveau modele enregistré. ".$reponse;
    }
    else{
        echo "Erreur à l'enregistrement du modele. "; 
    }    
}    
die();   

//--------------------------
function mysql_add_modele(){ 
global $debug;
global $reponse;
global $mysqli;
global $idmodele;

global $nom;
global $descriptif;
global $categorie;
global $dimension;

$sql='';

        $sql="INSERT INTO `bdm_modele` ( `nom`, `descriptif`, `dimension`, `categorie`) VALUES ('".addslashes($nom)."', '".addslashes($descriptif)."', '".addslashes($dimension)."', '".addslashes($categorie)."')";
        // Debug
        if ($debug){
            echo "SQL: ".$sql."<br />\n";                
        }           
        if ($result = $mysqli->query($sql)){
            // récupérer l'id créé
            $idmodele = $mysqli->insert_id;
            $reponse = '{"ok"=1, "idmodele":'.$idmodele.'}';  
        }                    
    
    return $reponse;
}


?>


