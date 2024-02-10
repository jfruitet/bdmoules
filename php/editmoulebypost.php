<?php
// Script à ne pas supprimer
// Ajoute un moule à la Base de données
// datas du formulaire en input, redirection vers la page appelante en sortie
// Eviter touts les affichages avant la fin du script

include ("./include/config.php");
include ("./include/mysql.php");

$debug = false;
$appel='';  // Page appelante
$reponse='';
$idmodele=0;
$idmoule=0;
$numinventaire=0;
$mdescription='';
$mlieu = '';
$matiere = '';
$etat = '';
$longueur = '';
$poids = '';
$commentaire = '';

$mysqli=NULL; // BD class data

// Get the contents
if (isset($_SERVER['REQUEST_METHOD']) && (strtoupper($_SERVER['REQUEST_METHOD']) !== 'POST')) {
  throw new Exception('Only POST requests are allowed');
}

/*
if (isset($_SERVER['CONTENT_TYPE']) && (stripos($_SERVER['CONTENT_TYPE'], 'application/json') === false)) {
  throw new Exception('Content-Type must be application/json');
}
*/
//    mydata+='?ref_modele='+refmodele+'&mdescription='+mdescription.value+'&mlieu='+mlieu.value+'&matiere='+matiere.value
// +'&etat='+metat.value+'&longueur='+mlongueur.value+'&poids='+mpoids.value+'&mcommentaire='+mcommentaire.value;

if (!empty($_POST['appel'])) {
    $appel = $_POST['appel'];  
}
 
if (!empty($_POST['refmodele'])) {
    $idmodele = $_POST['refmodele'];  
}

if (!empty($_POST['numinventaire'])) {
    $numinventaire = $_POST['numinventaire'];  
}

if (!empty($_POST['mdescription'])) {
    $mdescription = $_POST['mdescription'];  
}

if (!empty($_POST['mlieu'])) {
    $mlieu = $_POST['mlieu'];  
}

if (!empty($_POST['matiere'])) {
    $matiere = $_POST['matiere'];  
}

if (!empty($_POST['etat'])) {
    $etat = $_POST['etat'];  
}

if (!empty($_POST['longueur'])) {
    $longueur = $_POST['longueur'];  
}

if (!empty($_POST['poids'])) {
    $poids = $_POST['poids'];  
}

if (!empty($_POST['mcommentaire'])) {
    $commentaire = $_POST['mcommentaire'];  
}

if (!empty($idmodele)){
     if (!empty($idmoule)){
        // Debug
        if ($debug){
            echo "Edition<br />\nId moule: $idmoule, ref_modele: $idmodele, Num inventaire: $numinventaire, Description: $mdescription, Lieu: $mlieu, Matière: $matiere, Etat: $etat, Longueur: $longueur, Poids: $poids, Commentaire: $commentaire <br />\n";                
        }           
        connexion_db();
        $reponse = mysql_edit_moule();
        $mysqli -> close();
        if (!$debug){
            if (!empty($reponse)){ 
                header("Location: ".$appel."?msg=Moule ré-enregistré. ".$reponse);
            }
            else{
                header("Location: ".$appel."?msg=Erreur à l'enregistrement du moule ".$idmoule);   
            }                 
        }
    }        
    else{
        // Debug
        if ($debug){
            echo "Création<br />\nref_modele: $idmodele, Description: $mdescription, Lieu: $mlieu, Matière: $matiere, Etat: $etat, Longueur: $longueur, Poids: $poids, Commentaire: $commentaire <br />\n";                
        }           
        connexion_db();
        $reponse = mysql_add_moule();
        $mysqli -> close();
        if (!$debug){
            if (!empty($reponse)){ 
                header("Location: ".$appel."?msg=Nouveau moule enregistré. ".$reponse);
            }
            else{
                header("Location: ".$appel."?msg=Erreur à l'enregistrement du moule.");   
            }         
        }
    }
}
else{
    if (!$debug){
        header("Location: ".$appel."?msg=Erreur: Numéro de modèle inconnu...");
    }
    else{
        echo "Erreur : IdModele inconnu.";   
    }         
}
die();   

//--------------------------
function mysql_add_moule(){ 
global $debug;
global $reponse;
global $mysqli;
global $idmodele;
global $idmoule;
global $numinventaire;
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
        $sql="UPDATE `bdm_moule` SET `mdescription`='".addslashes($mdescription)."', `mlieu`='".addslashes($mlieu)."', `matiere`='".addslashes($matiere)."', `etat`='".addslashes($etat)."', `longueur`=".(double)$longueur.", `poids`=".(double)$poids.", `commentaire`='".addslashes($commentaire)."' WHERE `idmoule`=".$idmoule." ;";
        // Debug
        if ($debug){
            echo "SQL: ".$sql."<br />\n";                
        }           
        if ($result = $mysqli->query($sql)){
            // récupérer l'id créé
             $reponse = '{"ok"=1, "idmoule":'.$idmoule.'}';  
        }                    
    }
    return $reponse;
}


//--------------------------
function mysql_edit_moule(){ 
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


