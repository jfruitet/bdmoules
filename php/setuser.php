<?php
// Mise à jour de la table user par l'utilisateur identifié
// userid 	usernom 	userlogin 	statut [1: admin, 2:auteur, 3: lecteur] pass [pass crypté MD5] 	telephone 	club	adresse
// Mise à jour depuis le formulaire de réservation :
// '{"userid":'+userid+', "usernom":"'+Nom+'", "userlogin":"'+Courriel+'", "telephone":"'+Telephone+'", "adresse":"'+adresse+'"}';

// Session activée 
include ("./include/config.php");
include ("./include/session.php");
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
$reponse='{"ok":0}';

$mysqli=NULL; // BD class data

if (!isset($role) || ($role<LECTEUR)){
    echo '{"Ok":0, "msg":"Vous n\'avez pas accès à cette fonction"}';
    die();    
}


// Get the JSON contents
if (isset($_SERVER['REQUEST_METHOD']) && (strtoupper($_SERVER['REQUEST_METHOD']) !== 'POST')) {
  throw new Exception('Only POST requests are allowed');
}
/*
if (isset($_SERVER['CONTENT_TYPE']) && (stripos($_SERVER['CONTENT_TYPE'], 'application/json') === false)) {
  throw new Exception('Content-Type must be application/json');
}
*/

if (isset($_POST) && !empty($_POST)) {
    $data = $_POST;  
}
else {
    // Read the input stream
    $data = file_get_contents("php://input");
}

if (isset($data) && (!empty($data)))
{
    $mydata = json_decode($data,true);
    if ($debug){
        print_r($data);
        echo "<br />";
        print_r($mydata);
        echo "<br />";
        //exit;
    }

    if (!empty($mydata['Abandonner']) && !empty($mydata['appel'])){
        header("Location: ".$mydata['appel']."?msg=Mise à jour abandonnée. ");
        exit;
    }
}    

if (!empty($mydata['appel'])) {
    $appel = $mydata['appel'];  
}
    
if (!empty($mydata['userid'])) {
    $userid = $mydata['userid'];  
}

if (!empty($mydata['upass'])) {
    $pass = $mydata['upass'];  
}

if (isset($mydata['ustatut']) && (((int)$mydata['ustatut']) >= 0) && (((int)$mydata['ustatut']) < 4))  {
    $statut = $mydata['ustatut'];  
}

if (!empty($mydata['uoldpass'])) {
    $passmd5 = $mydata['uoldpass'];  
}

// '{"userid":'+userid+', "usernom":"'+Nom+'", "userlogin":"'+Courriel+'", "telephone":"'+Telephone+'", "adresse":"'+adresse+'"}';

if (!empty($mydata['usernom'])) {
    $usernom = $mydata['usernom'];  
}

if (!empty($mydata['userlogin'])) {
    $userlogin = $mydata['userlogin'];  
}

if (!empty($mydata['telephone'])) {
    $telephone = $mydata['telephone'];  
}

if (!empty($mydata['club'])) {
    $club = $mydata['club'];  
}

if (!empty($mydata['adresse'])) {
    $adresse = $mydata['adresse'];  
}

connexion_db(); 
if (!empty($userlogin) && !empty($userid) && !empty($upass)){   // Mise à jour du mot de passe
    // Debug
    if ($debug){
            echo "Mise à jour du mot de passe pour le compte Id: $userid, Nom: $usernom, Login: $userlogin, Rôle: $statut<br />\n";                
    }    
    $reponse = mysql_update_user_pass(md5($pass));
}
else if (!empty($userlogin) && !empty($userid)){    // Mise à jour de la table
    // Debug
    if ($debug){
            echo "Mise à jour du compte Id: $userid, Nom: $usernom, Login: $userlogin, Rôle: $role, Téléphone: $telephone, Club: $club, Adresse: $adresse<br />\n";                
    }    
    $reponse = mysql_update_user();
}
else if (!empty($userlogin)){   // ATTENTION : changement de login ? Ca me paraît risqué
;
}

$mysqli -> close();
echo $reponse;
die();   


//--------------------------
function mysql_update_user_pass($passmd5){ 
global $debug;
global $mysqli;
global $userid;
global $statut;
	
$sql='';
$reponse='';

    if (!empty($userid) && !empty($passmd5)){
        if (!empty($statut)){
            $sql = 'UPDATE `bdm_user` SET `statut`='.$statut.', `password`="'.$passmd5.'" WHERE `userid`='.$userid.';';
        }
        else{
            $sql = 'UPDATE `bdm_user` SET `password`="'.$passmd5.'" WHERE `userid`='.$userid.';';
        }
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

//--------------------------
function mysql_update_user(){ 
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

    if (!empty($userid)){
        if (!empty($club)){
            $sql = 'UPDATE `bdm_user` SET `usernom`="'.addslashes($usernom).'",  `telephone`="'.addslashes($telephone).'", `club`="'.addslashes($club).'", `adresse`="'.addslashes($adresse).'" WHERE `userid`='.$userid.';';        
        }
        else{
            $sql = 'UPDATE `bdm_user` SET `usernom`="'.addslashes($usernom).'",  `telephone`="'.addslashes($telephone).'", `adresse`="'.addslashes($adresse).'" WHERE `userid`='.$userid.';';
        }            
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


//--------------------------
function mysql_update_user_login(){ 
// Mise à jour du login (courriel) et du rôle
global $debug;
global $mysqli;
global $userid;
global $usernom;
global $userlogin;
global $statut;

$sql='';
$reponse='';

    if (!empty($userid) && !empty($userlogin)){
        $sql = 'UPDATE `bdm_user` SET `userlogin`="'.addslashes($userlogin).'" WHERE `userid`='.$userid.';';
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


