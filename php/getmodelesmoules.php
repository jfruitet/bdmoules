<?php
// Script à ne pas supprimer
// Lecture des modeles et des moules associés dans la Base de données
// Chaîne JSON en sortie

include ("./include/config.php");
include ("./include/mysql.php");

$debug = false;
$reponse_ok = '{"ok":1}';
$reponse_not_ok = '{"ok":0}';

$reponse=$reponse_not_ok;

$mysqli=NULL; // BD class data

// Get the JSON contents
if (isset($_SERVER['REQUEST_METHOD']) && (strtoupper($_SERVER['REQUEST_METHOD']) !== 'GET')) {
  throw new Exception('Only GET requests are allowed');
}
if (isset($_SERVER['CONTENT_TYPE']) && (stripos($_SERVER['CONTENT_TYPE'], 'application/json') === false)) {
  throw new Exception('Content-Type must be application/json');
}

// Charger le fichier pour récupérer l'info demandée
connexion_db();
$reponse = mysql_get_modeles_moules();
$mysqli -> close();

echo $reponse;

//  INSERT INTO `bdm_modele` (`id`, `nom`, `descriptif`, `dimension`, `categorie`, `timestamp`) VALUES
// INSERT INTO `bdm_moule` (`idmoule`, `ref_modele`, `numero_inventaire`, `mdescription`, `mlieu`, `matiere`, `etat`, `longueur`, `poids`, `commentaire`) VALUES

//--------------------------
function mysql_get_modeles_moules(){ 
global $debug;
global $mysqli;
    $data = array();
    $result = $mysqli->query("SELECT bdm_modele.id, bdm_modele.nom, bdm_modele.descriptif, bdm_modele.dimension, bdm_modele.categorie, 
        bdm_moule.idmoule, bdm_moule.numero_inventaire, bdm_moule.mdescription, bdm_moule.mlieu, bdm_moule.matiere, bdm_moule.etat, bdm_moule.longueur, bdm_moule.poids, bdm_moule.commentaire  
    FROM bdm_modele
    LEFT JOIN bdm_moule
    ON bdm_modele.id=bdm_moule.ref_modele
    ORDER BY bdm_modele.nom");
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


?>


