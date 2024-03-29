<?php
// Création d'un pass crypté MD5

// Session activée 
include ("./include/config.php");
include ("./include/session.php");

if (!isset($role) || ($role<LECTEUR)){
    echo '{"Ok":0, "msg":"Vous n\'avez pas accès à cette fonction"}';
    die();    
}

include ("./include/mysql.php");

$debug = false;
$appel='';  // Page appelante
$userid=0;
$usernom='';
$userlogin='';
$statut=0;
$pass='';
$passmd5='';
$telephone='';
$club='';
$adresse='';

$action=0;
$reponse='';

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

// Array ( [Editer] => Editer [unom] => FRUITET Jean [ulogin] => jean.fruitet@gmail.com 
// [ustatut] => 1 [uoldpass] => 81dc9bdb52d04dc20036dbd8313ed055 [utelephone] => 06 95 28 73 11 
// [uclub] => ARBL, Association Radiomodéliste des Bords de Loire, 44980 Sainte luce sur Loire [userid] => 1 [appel] => ../administrer.html ) 

//print_r($_POST);
//exit;

if (!empty($_POST['Abandonner']) && !empty($_POST['appel'])){
    header("Location: ".$_POST['appel']."?msg=Mise à jour abandonnée. ");
    exit;
}

if (!empty($_POST['appel'])) {
    $appel = $_POST['appel'];  
}


if (!empty($_POST['userid'])) {
    $userid = $_POST['userid'];  
}
 
if (!empty($_POST['unom'])) {
    $usernom = $_POST['unom'];  
}

if (!empty($_POST['ulogin'])) {
    $userlogin = $_POST['ulogin'];  
}

if (!empty($_POST['upass'])) {
    $pass = $_POST['upass'];  
}

if (isset($_POST['ustatut']) && (((int)$_POST['ustatut']) >= 0) && (((int)$_POST['ustatut']) < 4))  {
    $statut = $_POST['ustatut'];  
}

if (!empty($_POST['uoldpass'])) {
    $passmd5 = $_POST['uoldpass'];  
}

if (!empty($_POST['utelephone'])) {
    $telephone = $_POST['utelephone'];  
}

if (!empty($_POST['uclub'])) {
    $club = $_POST['uclub'];  
}

if (!empty($_POST['uadresse'])) {
    $adresse = $_POST['uadresse'];  
}

if (!empty($userlogin)){
    connexion_db(); 
    
    if ($role==ADMIN){    
        if (empty($userid)) {
            // Debug
            if ($debug){
                echo "Création d'un nouveau compte, Nom: $usernom, Login: $userlogin, Rôle: $statut, Pass: $pass, Téléphone: $telephone, Club: $club, Adresse: $adresse<br />\n";                
            }           
            $action=0;
            $reponse = mysql_add_user();
        }
        else if (!empty($passmd5)){
            // Debug
            if ($debug){
                echo "Mise à jour du compte Id: $userid, Nom: $usernom, Login: $userlogin, Rôle: $statut, Pass: $pass, Téléphone: $telephone, Club: $club, Adresse: $adresse<br />\n";                
            }    
            $action=1;       
            $reponse = mysql_update_user($passmd5);
        }
    }
    else { // Mise à jour partielle
        if ($debug){
            echo "Mise à jour patielle du compte Id: $userid, Nom: $usernom, Téléphone: $telephone, Club: $club, Adresse: $adresse<br />\n";                
        }    
        $action=2;       
        $reponse = mysql_update_partiel();
    }
}
$mysqli -> close();

if (!$debug){
    if (!empty($reponse)){ 
        if (!$action){
            header("Location: ".$appel."?msg=Nouveau compte enregistré. ".$reponse);
        }
        else{
           header("Location: ".$appel."?msg=Compte modifié. ".$reponse);        
        }
    }
    else{
        header("Location: ".$appel."?msg=Erreur à l'enregistrement du compte.");   
    }    
}
else{
    if (!empty($reponse)){ 
        if (!$action){
            echo "Nouveau compte enregistré. ".$reponse;
        }
        else{
            echo "Compte modifié. ".$reponse;        
        }
    }
    else{
        if (!$action){
            echo "Erreur à l'enregistrement d'un compte. ";
        }
        else{
            echo "Erreur à la modification d'un compte. ";        
        }
    }    
}    
die();   

//--------------------------
function mysql_add_user(){ 
global $debug;

global $mysqli;
global $userid;
global $usernom;
global $userlogin;
global $statut;
global $pass;
global $telephone;
global $club;
global $adresse;

// userid 	usernom 	userlogin 	statut [1: admin, 2:auteur, 3: lecteur] pass [pass crypté MD5] 	telephone 	club adresse
 	
$sql='';
$reponse='';

    if (!empty($userlogin)){
        $sql='INSERT INTO `bdm_user` (`usernom`, `userlogin`, `statut`, `pass`, `telephone`, `club`, `adresse`) VALUES ("'.addslashes($usernom).'", "'.addslashes($userlogin).'", '.$statut.', "'.md5($pass).'", "'.$telephone.'", "'.addslashes($club).'", "'.addslashes($adresse).'")';
        // Debug
        if ($debug){
            echo "SQL: ".$sql."<br />\n";                
        }           
        if ($result = $mysqli->query($sql)){
            // récupérer l'id créé
            $userid = $mysqli->insert_id;
            $reponse = '{"ok"=1, "userid":'.$userid.'}';  
        }                    
    }
    return $reponse;
}


//--------------------------
function mysql_update_user($passmd5){ 
global $debug;

global $mysqli;
global $userid;
global $usernom;
global $userlogin;
global $statut;
global $telephone;
global $club;
global $adresse;

// userid 	usernom 	userlogin 	statut [1: admin, 2:auteur, 3: lecteur] pass [pass crypté MD5] 	telephone 	club  adresse	
$sql='';
$reponse='';

    if (!empty($userid)){
        $sql = 'UPDATE `bdm_user` SET `usernom`="'.addslashes($usernom).'", `userlogin`="'.addslashes($userlogin).'", `statut`='.$statut.', `telephone`="'.addslashes($telephone).'", `club`="'.addslashes($club).'", `adresse`="'.addslashes($adresse).'" WHERE `userid`='.$userid.' AND `pass`="'.$passmd5.'";';
        // Debug
        if ($debug){
            echo "SQL: ".$sql."<br />\n";                
        }           

        if ($result = $mysqli->query($sql)){         
            $reponse = '{"ok"=1, "userid":'.$userid.'}';  
        }                    
    }
    return $reponse;
}

//--------------------------
function mysql_update_user_pass(){ 
global $debug;
global $pass;

// userid 	usernom 	userlogin 	statut [1: admin, 2:auteur, 3: lecteur] pass [pass crypté MD5] 	telephone 	club	adresse
$sql='';
$reponse='';

    if (!empty($userid)){
        $sql = 'UPDATE `bdm_user` SET `pass`="'.md5($pass).'" WHERE `userid`='.$userid.';';
        // Debug
        if ($debug){
            echo "SQL: ".$sql."<br />\n";                
        }           

        if ($result = $mysqli->query($sql)){         
            $reponse = '{"ok"=1, "userid":'.$userid.'}';  
        }                    
    }
    return $reponse;
}


//--------------------------
function mysql_update_partiel(){ 
// Pas de mise à jour du courriel ni du mot de passe ni du rôle
global $debug;
global $mysqli;
global $userid;
global $usernom;
global $userlogin;
global $telephone;
global $club;
global $adresse;

$sql='';
$reponse='';
    if (!empty($userid) && !empty($userlogin)){
        $sql = 'UPDATE `bdm_user` SET `usernom`="'.addslashes($usernom).'",  `telephone`="'.addslashes($telephone).'", `club`="'.addslashes($club).'", `adresse`="'.addslashes($adresse).'" WHERE `userid`='.$userid.';';
                
        // Debug
        if ($debug){
            echo "SQL: ".$sql."<br />\n";                
        }           

        if ($result = $mysqli->query($sql)){         
            $reponse = '{"ok":1, "userid":'.$userid.'}';  
        }                    
    }
    return $reponse;
}


?>


