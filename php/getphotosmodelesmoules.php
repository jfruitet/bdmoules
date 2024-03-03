<?php
// Script à ne pas supprimer
// Lecture des données associée à une photo dans la Base de données
// Retourne la liste des modèles ou la liste des moules selon que la photo est associée à un modèle ou à un moule
// Id du modele sélectionné en paramètre GET et chaîne JSON en sortie

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
if (!empty($idphoto) && ($idphoto>0)){
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
$data=array();
    if (!empty($idphoto) && ($idphoto>0)){
        if ($result = $mysqli->query("SELECT refmodele, refmoule FROM bdm_photo WHERE idphoto=".$idphoto)){
            // Récupérer les lignes de la table 
            if ( $row = $result->fetch_assoc())  {
                // Moule ou modèle ?
                if (empty($row['refmoule']) || ($row['refmoule']==null) || ($row['refmoule']==0)){
                    // Modèle
                    return mysql_get_modeles($idphoto);              
                }   
                else{
                    return mysql_get_moules($idphoto); 
                }              
            }          
        }
    }
    return '';
}

//--------------------------
function mysql_get_modeles($idphoto){ 
global $debug;
global $mysqli;
$data=array();
    if ($result = $mysqli->query("SELECT id, nom FROM bdm_modele ORDER BY nom")){
            // Récupérer les lignes de la table 
            while ( $row = $result->fetch_assoc())  {
                $data[]=$row;
            }          
    }
    if (!empty($data)){
        return '{"idphoto":'.$idphoto.', "modeles":'.json_encode($data).', "moules":[]}';   
    }
    return '';
}


//--------------------------
function mysql_get_moules($idphoto){ 
global $debug;
global $mysqli;
$data=array();
    if ($result = $mysqli->query("SELECT idmoule, mdescription, ref_modele FROM bdm_moule ORDER BY idmoule")){
            // Récupérer les lignes de la table 
            while ( $row = $result->fetch_assoc())  {
                $data[]=$row;
            }          
    }
    if (!empty($data)){
        return '{"idphoto":'.$idphoto.', "modeles":[], "moules":'.json_encode($data).'}';   
    }
    return '';
}

?>


