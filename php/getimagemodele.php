<?php
// Script à ne pas supprimer
// Lecture des photos associées à un id de modele dans la Base de données
// Id du modele en paramètre GET et chaîne JSON en sortie

include ("./include/config.php");
include ("./include/mysql.php");


$debug = false;
$reponse_ok = '{"ok":1}';
$reponse_not_ok = '{"ok":0}';
$reponse=$reponse_not_ok;
$idmodele=0;

$mysqli=NULL; // BD class data

// Get the JSON contents
if (isset($_SERVER['REQUEST_METHOD']) && (strtoupper($_SERVER['REQUEST_METHOD']) !== 'GET')) {
  throw new Exception('Only GET requests are allowed');
}
if (isset($_SERVER['CONTENT_TYPE']) && (stripos($_SERVER['CONTENT_TYPE'], 'application/json') === false)) {
  throw new Exception('Content-Type must be application/json');
}
if (!empty($_GET['idmodele'])) {
    $idmodele = $_GET['idmodele'];  
}

if (!empty($idmodele))
{
    connexion_db();
    $reponse = mysql_get_images_modele($idmodele);
    $mysqli -> close();
}
echo $reponse;

//--------------------------
function mysql_get_images_modele($idmodele){ 
global $debug;
global $mysqli;
$data = array();
    if (!empty($idmodele)){
        $result = $mysqli->query("SELECT * FROM bdm_photo WHERE bdm_photo.refmodele=".$idmodele);
        // Récupérer les lignes de la table 
        while ( $row = $result->fetch_assoc())  {
            $data[] = $row;
        }
        // Debug
        if ($debug){
            printf("Select returned %d rows.\n", $result->num_rows);
            echo "Data\n";
            print_r($data);
            echo "\n";    
        }         
    
        //Afficher le tableau au format JSON
        return json_encode($data);                
    }
}


?>


