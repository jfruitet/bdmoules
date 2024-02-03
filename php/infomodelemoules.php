<?php
// Script à ne pas supprimer
// Retourne quelques infos concernant le modèle et les moules de ce modèle lues dans la Base de données
// Id du modèle et liste de idmoule (séparateur ',') en paramètre GET et chaîne JSON en sortie
// infomodelemoules.php?idmodele=37&sidmoules=46,47
// localhost/bdmoules/php/infomodelemoules.php?idmodele=37&sidmoules=46,47
include ("./include/config.php");
include ("./include/mysql.php");


$debug = false;
$idmodele=0;
$sidmoules='';
$tidmoules = array();
$reponse = '{"Ok":0}';

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

if (!empty($_GET['sidmoules'])) {
    $sidmoules = $_GET['sidmoules'];  
    $tidmoules = explode(',', $sidmoules);
}

// Debug
if ($debug){
            echo "IDModele: ".$idmodele."<br />\n";
            echo "IDMoules: ".$sidmoules."<br />\n";
            print_r($tidmoules);
            echo "<br />\n";
}    

if (!empty($idmodele)){
    // Charger le fichier pour récupérer l'info demandée
    //$reponse = json_encode(getjson($file));
    connexion_db();
    $reponse = mysql_infos_modele_moules($idmodele, $tidmoules);
    $mysqli -> close();
}
echo $reponse;



//--------------------------
// Retourne une ligne de la table modele
function mysql_infos_modele_moules($idmodele, $tidmoules){ 
global $debug;
global $mysqli;
$modele = array();
$moules = array();
// Debug
if ($debug){
            echo "IDModele: ".$idmodele."<br />\n";
            print_r($tidmoules);
            echo "<br />\n";
}    

    if (!empty($idmodele)){
        //	id 	nom 	descriptif 	dimension (long x larg x haut) 	categorie 	timestamp 	
        if ($result = $mysqli->query("SELECT id, nom, descriptif, dimension, categorie FROM bdmoules.bdm_modele WHERE bdmoules.bdm_modele.id=".$idmodele)){
            //echo "Modele\n";
            if ( $row = $result->fetch_assoc()) {
                $modele[] = $row;
            }
            // echo "Moules\n";                
            if (!empty($tidmoules)){    // Récupérer une liste de moules
                for ($i=0; $i<count($tidmoules); $i++){
                // idmoule 	ref_modele 	numero_inventaire mdescription 	mlieu 	matiere 	etat 	longueur 	poids 	commentaire
                    echo "Moule: ".$tidmoules[$i]."<br />\n";                         
                    $sql="SELECT numero_inventaire, mdescription, mlieu, matiere, longueur	FROM bdmoules.bdm_moule WHERE ref_modele=".$idmodele." AND idmoule=".$tidmoules[$i];
                    echo "SQL: ".$sql."<br />\n";                                             
                    
                    if ($result2 = $mysqli->query($sql)){
                        while ( $row2 = $result2->fetch_assoc()) {
                            $moules[] = $row2;
                        }
                    }                        
                }
            } 
            else {   // Récupérer tous les moules
                if ($result2 = $mysqli->query("SELECT numero_inventaire, mdescription, mlieu, matiere, longueur FROM bdmoules.bdm_moule WHERE ref_modele=".$idmodele." ORDER BY idmoule")){
                    while ( $row2 = $result2->fetch_assoc()) {
                        $moules[] = $row2;
                    }
                }                                    
            }
        }    
                           
        // Debug
        if ($debug){
            echo "Modele\n";
            print_r($modele);
            echo "<br />\n";
            echo "Moules\n";
            print_r($moules);
            echo "<br />\n";
        }    
        return '{"Ok":1,"modele":'.json_encode($modele).',"moules":'.json_encode($moules).'}'; 
    }
    return '{"Ok":0}';                                
}


?>


