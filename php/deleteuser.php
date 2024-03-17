<?php
// Script à ne pas supprimer
// Supprime un utilisateur de la Base de données
// datas du formulaire en input, redirection vers la page appelante en sortie
// Eviter touts les affichages avant la fin du script

// Session activée 
include ("./include/config.php");
include ("./include/session.php");

if (!isset($role) || ($role<ADMIN)){
    echo '{"Ok":0, "msg":"Vous n\'avez pas accès à cette fonction"}';
    die();    
}

include ("./include/mysql.php");

$debug = false;
$appel='';  // Page appelante
$reponse=false;
$iduser=0;
$delete='';
$mysqli=NULL; // BD class data

// Get the contents
if (isset($_SERVER['REQUEST_METHOD']) && (strtoupper($_SERVER['REQUEST_METHOD']) !== 'POST')) {
  throw new Exception('Only POST requests are allowed');
}

/*
if (isset($_SERVER['CONTENT_TYPE']) && (stripos($_SERVER['CONTENT_TYPE'], 'application/json') === false)) {
  throw new Exception('Content-Type must be application/json');
}
*/
//    mydata+='?ref_modele='+refmodele+'&mdescription='+mdescription.value+'&mlieu='+mlieu.value+'&matiere='+matiere.value
// +'&etat='+metat.value+'&longueur='+mlongueur.value+'&poids='+mpoids.value+'&mcommentaire='+mcommentaire.value;

if (!empty($_POST['delete'])) {
    $delete = $_POST['delete'];  
}

if (!empty($_POST['appel'])) {
    $appel = $_POST['appel'];  
}


if (!empty($_POST['iduser'])) {
    $iduser = $_POST['iduser'];  
}

     if (!empty($iduser) && !empty($delete) && ($delete=='Confirmer')) {
        // Debug
        if ($debug){
            echo "Suppression<br />\nId User: $iduser <br />\n";                
        }           
        connexion_db();
        $reponse = mysql_delete_user($iduser);
        $mysqli -> close();
        if (!$debug){
            if ($reponse){ 
                header("Location: ".$appel."?msg=Utilisateur supprimé: ".$iduser);
            }
            else{
                header("Location: ".$appel."?msg=Erreur à la suppression d'un utilisateur. ");
            }                 
        }
        else{
            if ($reponse){ 
                echo ("Utilisateur supprimé. ".$iduser);
            }
            else{
                echo("Erreur à la suppression d'un utilisateur. ");
            }                         
        }
    }        
    else{
        if (!$debug){
            header("Location: ".$appel."?msg=Suppression d'un utilisateur abandonnée.");
        }
        else{
            echo ("Suppression d'un utilisateur abandonnée.");        
        }
    }
die();   

//--------------------------
function mysql_delete_user($iduser){ 
global $debug;
global $reponse;
global $mysqli;

$sql='';

    if (!empty($iduser)){
        $sql="DELETE FROM `bdm_user` WHERE `userid`=".$iduser." ;";
        // Debug
        if ($debug){
            echo "SQL: ".$sql."<br />\n";                
        }           
        if ($result = $mysqli->query($sql)){
            return true;  
        }                    
    }
    return false;
}


?>


