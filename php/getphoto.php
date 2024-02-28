<?php
// Script à ne pas supprimer
// Lecture des données associée à une photo dans la Base de données
// Id du modele en paramètre GET et chaîne JSON en sortie

include ("./include/config.php");
include ("./include/mysql.php");


$debug = true;
$idphoto=0;
$reponse='';

$mysqli=NULL; // BD class data

// Get the JSON contents
if (isset($_SERVER['REQUEST_METHOD']) && (strtoupper($_SERVER['REQUEST_METHOD']) !== 'GET')) {
  throw new Exception('Only GET requests are allowed');
}
/*
if (isset($_SERVER['CONTENT_TYPE']) && (stripos($_SERVER['CONTENT_TYPE'], 'application/json') === false)) {
  throw new Exception('Content-Type must be application/json');
}
*/
if (!empty($_GET['idphoto'])) {
    $idphoto = $_GET['idphoto'];  
}

if (!empty($idphoto))
{
    connexion_db();
    $reponse = mysql_get_photo($idphoto);
    $mysqli -> close();
}
echo $reponse;
die();

//--------------------------
function mysql_get_photo($idphoto){ 
global $debug;
global $mysqli;
    if (!empty($idphoto)){
        if ($result = $mysqli->query("SELECT * FROM bdm_photo WHERE bdm_photo.idphoto=".$idphoto)){
            // Récupérer les lignes de la table 
            if ( $row = $result->fetch_assoc())  {
                return (json_encode($row));
            }          
        }
    }
    return '';
}


?>


