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
$mail='';

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
if (!empty($_GET['mail'])) {
    $mail = $_GET['mail'];  
}

// Fourni par session.php
// echo ("Usermail: ".$usermail." Rôle: ".$role);
// exit;
if (!isset($role) || ($role<LECTEUR)){
    echo '{"ok":0, "msg":"Vous n\'avez pas accès à cette fonction"}';
    die();    
}


if (!empty($mail))
{    
    connexion_db();
    $reponse = mysql_info_user($mail);
    $mysqli -> close(); 
}
if (!empty($reponse)){
    echo '{"ok":1, "user":'.json_encode($reponse).'}';
}
else{
    echo '{"ok":0, "msg":"Utilisateur inconnu"}';
}        

die();

//--------------------------
// Retourne la ligne de la table user correspondant au user
function mysql_info_user($mail){ 
global $debug;
global $mysqli;
$data= array();
    if (!empty($mail)){	
      if ($result = $mysqli->query("SELECT * FROM bdmoules.bdm_user WHERE userlogin='".$mail."';")){
            if ( $data = $result->fetch_assoc()) {
                // Debug
                if ($debug){
                    echo "Data<br />\n";
                    print_r($data);
                    echo "\n<br />\n";
                }                
            }
        }                            
    }
    return $data;
}


?>


