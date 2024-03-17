<?php
// Script à ne pas supprimer
// Edite un moule de la Base de données
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

$nom=0;
$descriptif='';
$dimension = '';
$tcategorie = array();

$mysqli=NULL; // BD class data

// Get the contents
if (isset($_SERVER['REQUEST_METHOD']) && (strtoupper($_SERVER['REQUEST_METHOD']) !== 'POST')) {
  throw new Exception('Only POST requests are allowed');
}

if (!empty($_POST['appel'])) {
    $appel = $_POST['appel'];  
}
 
if (!empty($_POST['idmodele'])) {
    $idmodele = $_POST['idmodele'];  
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
    $tcategorie = $_POST['modelecategorie'];  
    $categorie = implode(",",$tcategorie);
}


if (!empty($idmodele)){
        // Debug
        
        if ($debug){
            echo "Edition<br />\nId: $idmodele, Nom: $nom, Descriptif: $descriptif, Dimension: $dimension, Catégorie: $categorie<br />\n";                
        }           
        connexion_db();
        $reponse = mysql_edit_modele();
        $mysqli -> close();
        if (!$debug){
            if (!empty($reponse)){ 
                header("Location: ".$appel."?msg=Modèle ré-enregistré. ".$reponse);
            }
            else{
                header("Location: ".$appel."?msg=Erreur au ré-enregistrement du modèle ".$idmoule);   
            }                 
        }
}        
else{
    if (!$debug){
        header("Location: ".$appel."?msg=Erreur: Numéro de modèle inconnu...");
    }
    else{
        echo "Erreur : Id Modele inconnu.";   
    }         
}
die();   

//--------------------------
function mysql_edit_modele(){ 
global $debug;
global $reponse;
global $mysqli;
global $idmodele;
global $nom;
global $descriptif;
global $dimension;
global $categorie;

$sql='';
    if (!empty($idmodele)){
        $sql="UPDATE `bdm_modele` SET `nom`='".addslashes($nom)."', `descriptif`='".addslashes($descriptif)."', `dimension`='".addslashes($dimension)."', `categorie`='".addslashes($categorie)."'  WHERE `id`=".$idmodele." ;";
        // Debug
        if ($debug){
            echo "SQL: ".$sql."<br />\n";                
        }           
        if ($result = $mysqli->query($sql)){
            // récupérer l'id créé
             $reponse = '{"ok"=1, "idmodele":'.$idmodele.'}';  
        }                    
    }
    return $reponse;
}


?>


