<?php
// Script à ne pas supprimer
// Ajoute un moule à la Base de données
// data en input, et chaîne JSON en sortie
// localhost/bdmoules/php/addmoule.php?refmodele=10&mdescription=Plan de l'Alpha 27&mlieu=La Minais&matiere=Papier&etat=Correct&longueur=80&poids=100&mcommentaire=Format A2, échelle 1/2
include ("./include/config.php");
include ("./include/mysql.php");

$debug = true;
$reponse_ok = '{"ok":1}';
$reponse_not_ok = '{"ok":0}';
$reponse=$reponse_not_ok;
$idmodele=0;
$idmoule=0;
$mdescription='';
$mlieu = '';
$matiere = '';
$etat = '';
$longueur = '';
$poids = '';
$commentaire = '';

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
//    mydata+='?refmodele='+refmodele+'&mdescription='+mdescription.value+'&mlieu='+mlieu.value+'&matiere='+matiere.value
// +'&etat='+metat.value+'&longueur='+mlongueur.value+'&poids='+mpoids.value+'&commentaire='+mcommentaire.value;
 
if (!empty($_GET['refmodele'])) {
    $idmodele = $_GET['refmodele'];  
}

if (!empty($_GET['mdescription'])) {
    $mdescription = $_GET['mdescription'];  
}

if (!empty($_GET['mlieu'])) {
    $mlieu = $_GET['mlieu'];  
}

if (!empty($_GET['matiere'])) {
    $matiere = $_GET['matiere'];  
}

if (!empty($_GET['etat'])) {
    $etat = $_GET['etat'];  
}

if (!empty($_GET['longueur'])) {
    $longueur = $_GET['longueur'];  
}

if (!empty($_GET['poids'])) {
    $poids = $_GET['poids'];  
}

if (!empty($_GET['mcommentaire'])) {
    $commentaire = $_GET['mcommentaire'];  
}

if (!empty($idmodele))
{
    connexion_db();
    $reponse = mysql_set_new_moule();
    $mysqli -> close();
}
echo $reponse;

//--------------------------
function mysql_set_new_moule(){ 
global $debug;
global $reponse;
global $mysqli;
global $idmodele;
global $idmoule;
global $mdescription;
global $mlieu;
global $matiere;
global $etat;
global $longueur;
global $poids;
global $commentaire;
// INSERT INTO `bdm_moule` (`idmoule`, `ref_modele`, `numero_inventaire`, `mdescription`, `mlieu`, `matiere`, `etat`, `longueur`, `poids`, `commentaire`) VALUES

$sql='';
$numeromax=0;

    if (!empty($idmodele)){
        $sql="INSERT INTO `bdm_moule` (`ref_modele`, `mdescription`, `mlieu`, `matiere`, `etat`, `longueur`, `poids`, `commentaire`) VALUES ($idmodele, '".addslashes($mdescription)."', '".addslashes($mlieu)."', '$matiere', '$etat', ".(double)$longueur.", ".(double)$poids.", '".addslashes($commentaire)."')";
        // Debug
        if ($debug){
            echo "SQL: ".$sql."<br />\n";                
        }           
        if ($result = $mysqli->query($sql)){
            // récupérer l'id créé
            $idmoule = $mysqli->insert_id;
            $reponse = '{"ok"=1, "idmoule":'.$idmoule.'}';  
            
            // récupérer le numéro d'inventaire
            if ($result2 = $mysqli->query("SELECT Max(numero_inventaire) AS numeromax FROM `bdm_moule`")){
                if ( $row = $result2->fetch_assoc()) {
                    $numeromax=$row['numeromax'];
                    $numeromax=(int)$numeromax+1;                
                    // mettre à jour le numéro d'inventaire
                    // UPDATE table_name SET column1=value, column2=value2,... WHERE some_column=some_value  
                    if ($result3 = $mysqli->query("UPDATE `bdm_moule` SET `numero_inventaire`=".$numeromax." WHERE `idmoule`=".$idmoule." ;")){
                        $reponse = '{"ok"=1, "idmoule":'.$idmoule.', "numero_inventaire":'.$numeromax.'}';  
                    }
                }                 
            }               
        }                    
    }
    return $reponse;
}


?>


