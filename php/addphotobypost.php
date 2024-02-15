<?php
// Script à ne pas supprimer
// Ajoute un modele à la Base de données
// datas du formulaire en input, redirection vers la page appelante en sortie
// Eviter touts les affichages avant la fin du script

include ("./include/config.php");
include ("./include/mysql.php");

$debug = true;
$appel='';  // Page appelante
$reponse='';
$idmodele=0;
$idmoule=0;
$auteur='';
$legende='';
$copyright = '';
$fichier = '';
$refmodele=0;
$refmoule=0;

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

if (!empty($_POST['legende'])) {
    $legende = $_POST['legende'];  
}

if (!empty($_POST['licence'])) {
    $copyright = $_POST['licence'];  
}

if (!empty($_POST['urlfile'])) {
    $file = $_POST['urlfile'];  
}

if (!empty($_POST['idmodele'])) {
    $idmodele = $_POST['idmodele'];  
}

if (!empty($_POST['idmoule'])) {
    $idmoule = $_POST['idmoule'];  
}
    // Debug
    if ($debug){
        echo "Auteur: $auteur, Légende: $legende, Copyrigth: $copyright, Url: $file<br />\n";                
    }           

    connexion_db();
    $reponse = mysql_add_photo();
    $mysqli -> close();


if (!$debug){
    if (!empty($reponse)){ 
        header("Location: ".$appel."?msg=Nouveelle photo enregistrée. ".$reponse);
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
die();   

//--------------------------
function mysql_add_photo(){ 
global $debug;
global $reponse;
global $mysqli;
global $idmodele;
global $idmoule;

global $auteur;
global $legende;
global $copyright;
global $file;

$sql='';

        $sql="INSERT INTO `bdm_photo` ( `auteur`, `legende`, `copyright`, `fichier`, `refmodele`, `refmoule`) VALUES ('".addslashes($auteur)."', '".addslashes($legende)."', '".addslashes($copyright)."', '".$fichier.", ".$idmodele.", ".$idmoule.")";
        // Debug
        if ($debug){
            echo "SQL: ".$sql."<br />\n";                
        }           
        if ($result = $mysqli->query($sql)){
            // récupérer l'id créé
            $idphoto = $mysqli->insert_id;
            $reponse = '{"ok"=1, "idphoto":'.$idphoto.'}';  
        }                    
    
    return $reponse;
}


?>


