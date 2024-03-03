<?php
// Script à ne pas supprimer
// Ré affecte une photot à un autre modèle u à un autre moule
// data en input, et chaîne JSON en sortie
// localhost/bdmoules/php/addmoule.php?refmodele=10&mdescription=Plan de l'Alpha 27&mlieu=La Minais&matiere=Papier&etat=Correct&longueur=80&poids=100&mcommentaire=Format A2, échelle 1/2
include ("./include/config.php");
include ("./include/mysql.php");

$debug = false;
$reponse = '{"ok":0}';
$idmodele=0;
$idmoule=0;
$idphoto=0;

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
 
if (!empty($_GET['idphoto'])) {
    $idphoto = $_GET['idphoto'];  
}

if (!empty($_GET['idmodele'])) {
    $idmodele = $_GET['idmodele'];  
}

if (!empty($_GET['idmoule'])) {
    $idmoule = $_GET['idmoule'];  
}

if (!empty($idphoto) && ($idphoto>0) && !empty($idmoule) && ($idmoule>0))
{
    connexion_db();
    $reponse = mysql_update_photo_moule();
    $mysqli -> close();
}
else if (!empty($idphoto) && ($idphoto>0) && !empty($idmodele) && ($idmodele>0))
{
    connexion_db();
    $reponse = mysql_update_photo_modele();
    $mysqli -> close();
}

echo $reponse;
die();

//--------------------------
function mysql_update_photo_modele(){ 
global $debug;
global $reponse;
global $mysqli;
global $idphoto;
global $idmodele;
global $idmoule;

    $sql="UPDATE `bdm_photo` SET `refmodele`=".$idmodele." WHERE `idphoto`=".$idphoto." ;";
    if ($result = $mysqli->query($sql)){
        $reponse = '{"ok":1, "idphoto":'.$idphoto.', "id":'.$idmodele.'}';                      
    }
    return $reponse;
}


//--------------------------
function mysql_update_photo_moule(){ 
global $debug;
global $reponse;
global $mysqli;
global $idphoto;
global $idmodele;
global $idmoule;

    $sql="UPDATE `bdm_photo` SET `refmoule`=".$idmoule." WHERE `idphoto`=".$idphoto." ;";
    if ($result = $mysqli->query($sql)){
        $reponse = '{"ok":1, "idphoto":'.$idphoto.', "id":'.$idmoule.'}';                      
    }
    return $reponse;
}


?>


