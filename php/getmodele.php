<?php
// Script à ne pas supprimer
// Lecture d'un fichier passé en paramètres 
// N'a aucune spécialisation sauf le dossier du fichier cherché

include ("./include/config.php");
include ("./include/mysql.php");


$debug = true;
$reponse_ok = '{"ok":1}';
$reponse_not_ok = '{"ok":0}';
$file = "";
$ismodele = 0;  
$reponse=$reponse_not_ok;

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
    // Charger le fichier pour récupérer l'info demandée
    //$reponse = json_encode(getjson($file));
    connexion_db();
    $reponse = mysql_get_moules($idmodele);
    $mysqli -> close();
}
echo $reponse;

//--------------------------
function mysql_get_moules($idmodele){ 
global $debug;
    if (!empty($idmodele)){
        $result = $mysqli->query("SELECT * FROM bdmoules.bdm_moule WHERE ref_modele=".$idmodele." ORDER BY mdescription");
        // Debug
        if ($debug){
            printf("Select returned %d rows.\n", $result->num_rows);
            echo "Data\n";
            print_r($result);
        }             
        return json_encode($result);      
    }       
}


?>


