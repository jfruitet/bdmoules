<?php
// Script à ne pas supprimer
// Retourne les infos concernant les moules d'un modèle lues dans la Base de données
// Id du modèle en paramètre GET et chaîne JSON en sortie
// http://localhost/bdmoules/php/getmodelemoules.php?idmodele=37

include ("./include/config.php");
include ("./include/mysql.php");


$debug = false;
$reponse_ok = '{"ok":1}';
$reponse_not_ok = '{"ok":0}';
$reponse=$reponse_not_ok;
$idmodele=0;
$tidmoules = array();

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
if (!empty($_GET['idmodele'])) {
    $idmodele = $_GET['idmodele'];  
}

if (!empty($idmodele))
{
    // Charger le fichier pour récupérer l'info demandée
    //$reponse = json_encode(getjson($file));
    connexion_db();
    $reponse1 = mysql_infos_modele($idmodele);
    $reponse2 = mysql_infos_moules($idmodele);
    $mysqli -> close();
}
echo '{"modele":'.json_encode($reponse1).',"moules":'.json_encode($reponse2).'}';


//--------------------------
// Retourne la ligne de la table modele correspondant au modele
function mysql_infos_modele($idmodele){ 
global $debug;
global $mysqli;
$data = '';
    if (!empty($idmodele)){	
        // idmoule 	ref_modele 	numero_inventaire mdescription 	mlieu 	matiere 	etat 	longueur 	poids 	commentaire
//        if ($result = $mysqli->query("SELECT idmoule, ref_modele, numero_inventaire, mdescription, mlieu, matiere, longueur	FROM bdmoules.bdm_moule WHERE ref_modele=".$idmodele." ORDER BY numero_inventaire")){
        if ($result = $mysqli->query("SELECT * FROM bdmoules.bdm_modele WHERE id=".$idmodele)){
            if ( $row = $result->fetch_assoc()) {
                $data = $row;
            }
        }    
    }                           
        // Debug
    if ($debug){
        echo "Data\n".$data."<br />\n";
    }    
    //return json_encode($data);
    return $data;                         
}

//--------------------------
// Retourne les lignes de la table moule correspondant au modele
function mysql_infos_moules($idmodele){ 
global $debug;
global $mysqli;
$data = array();
    if (!empty($idmodele)){	
        // idmoule 	ref_modele 	numero_inventaire mdescription 	mlieu 	matiere 	etat 	longueur 	poids 	commentaire
//        if ($result = $mysqli->query("SELECT idmoule, ref_modele, numero_inventaire, mdescription, mlieu, matiere, longueur	FROM bdmoules.bdm_moule WHERE ref_modele=".$idmodele." ORDER BY numero_inventaire")){
        if ($result = $mysqli->query("SELECT * FROM bdmoules.bdm_moule WHERE ref_modele=".$idmodele." ORDER BY numero_inventaire")){
            while ( $row = $result->fetch_assoc()) {
                $data[] = $row;
            }
        }    
    }                           
        // Debug
    if ($debug){
        echo "Data<br />\n";
        print_r($data);
        echo "<br />\n";
    }    
    //return json_encode($data);                         
    return $data;
}


?>


