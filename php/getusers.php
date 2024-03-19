<?php
// Script à ne pas supprimer
// Retourne les infos concernant les moules d'un modèle lues dans la Base de données
// Id du modèle en paramètre GET et chaîne JSON en sortie
// http://localhost/bdmoules/php/getmodelemoules.php?idmodele=37

// Session activée 
include ("./include/config.php");
include ("./include/session.php");

include ("./include/mysql.php");

$debug = false;
$reponse='';
$iduser=0;

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
if (!empty($_GET['iduser'])) {
    $iduser = $_GET['iduser'];  
}

// Fourni par session.php
// echo ("Usermail: ".$usermail." Rôle: ".$role);
// exit;
if (!isset($role) || ($role<ADMIN)){
    echo '{"Ok":0, "msg":"Vous n\'avez pas accès à cette fonction"}';
    die();    
}

connexion_db();
if (!empty($iduser))
{    
    $reponse = mysql_infos_user($iduser);
}
else{
    $reponse = mysql_infos_all_users();
}    
if (!empty($reponse)){
    echo json_encode($reponse);
}
else{
        echo '{"ok":0}';
}        

$mysqli -> close();

exit;

//--------------------------
// Retourne la ligne de la table user correspondant au user
function mysql_infos_user($iduser){ 
global $debug;
global $mysqli;
$data = array();
    if (!empty($iduser)){	
        // idmoule 	ref_user 	numero_inventaire mdescription 	mlieu 	matiere 	etat 	longueur 	poids 	commentaire
//        if ($result = $mysqli->query("SELECT idmoule, ref_user, numero_inventaire, mdescription, mlieu, matiere, longueur	FROM bdmoules.bdm_moule WHERE ref_user=".$iduser." ORDER BY numero_inventaire")){
        if ($result = $mysqli->query("SELECT * FROM bdmoules.bdm_user WHERE userid=".$iduser)){
            if ( $row = $result->fetch_assoc()) {
                $data = $row;
            }
        }    
    }                           
        // Debug
    if ($debug){
        echo "Data\n".$data."<br />\n";
    }    
    return $data;
}

//--------------------------
// Retourne les lignes de la table moule correspondant au user
function mysql_infos_all_users(){ 
global $debug;
global $mysqli;
$data = array();
    if ($result = $mysqli->query("SELECT * FROM bdmoules.bdm_user ORDER BY usernom;")){
        while($row = $result->fetch_assoc()) {
                $data[] = $row;
        }    
    }                           
        // Debug
    if ($debug){
        echo "Data:<br />\n";
        print_r($data); 
    }    
    return $data;                        
}


?>


