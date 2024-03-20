<?php
// Vérification des droits de connexion et du rôle
// On démarre une nouvelle session
include ("./include/session.php");
include ("./include/mysql.php");
$debug=false;
$mysqli=NULL; // BD class data
$reponse_not_ok='{"ok":0}';
$reponse='';
$mydata = new stdClass();
$data = null;
$appel='';  // Page appelante

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
    if (isset($_SERVER['CONTENT_TYPE']) && (stripos($_SERVER['CONTENT_TYPE'], 'application/json') === true)) {
        $mydata = json_decode($data,true);
    }
    else{
        $mydata = $data;
    }
    
    if ($debug){
        print_r($data);
        echo "<br />";
        print_r($mydata);
        echo "<br />";
        echo "UserMail: ".$mydata['usermail']." UserPass: ".$mydata['userpass']."<br />\n";
        //exit;
    }

    if (!empty($mydata['usermail']) && !empty($mydata['userpass'])){
        //echo "UserMail: ".$mydata['usermail']." UserPass: ".$mydata['userpass']."<br />\n";
        connexion_db();
        if ($role=connexion($mydata['usermail'], $mydata['userpass'])) // on vérifie que les identifiants sont bons
        {      
            setcookie('usermail', $mydata['usermail'], $arr_cookie_options);
            setcookie('role', $role, $arr_cookie_options);
            $reponse =  '{"ok":1, "usermail":"'.$mydata['usermail'].'", "role":'.$role.'}';
        }
        else{
            // Créer un compte ?
            if ($role=addconnexion($mydata['usermail'], $mydata['userpass'])) // on voit si on peut créer un nouveau compte
            {      
                setcookie('usermail', $mydata['usermail'], $arr_cookie_options);
                setcookie('role', $role, $arr_cookie_options);
                $reponse =  '{"ok":1, "usermail":"'.$mydata['usermail'].'", "role":'.$role.'}';
            }
            else{
                $reponse =  ''; // {"msg":"Erreur de mot de passe", "ok":0, "usermail":'.$mydata['usermail'].', "role":'.$role.'}';            
            }            
        }
        $mysqli -> close();
    }
}
//echo $reponse;
if (!$debug){
    if (!empty($reponse)){ 
        header("Location: ".$mydata['appel']."?msg=Connexion valide. ".$reponse);
    }
    else{
        header("Location: ".$mydata['appel']."?msg=Connexion invalide. ".$reponse_not_ok);   
    }    
}
else{
    if (!empty($reponse)){ 
        echo "Connexion valide. ".$reponse;
    }
    else{
        echo "Connexion invalide. "; 
    }    
}    

die();

// Retourne le rôle de l'utilisateur
// Statut de connexion à 1 pour admin, 2 pour auteur, 3 pour lecteur sinon 0: visiteur
//-----------------------
function connexion($usermail, $userpass){
global $mysqli;
global $debug;
    if (!empty($usermail) && !empty($userpass)){                
        // récupérer le login et mot de passe
        $sql="SELECT statut FROM `bdm_user` WHERE `userlogin`='".$usermail."' AND `pass`='".md5($userpass)."';";
        if ($debug){
            echo $sql;
        }
        if ($result = $mysqli->query($sql)){
            if ($row = $result->fetch_assoc()) {
                return $row['statut'];                
            }
        }               
    }
    return 0;
}

// Retourne le rôle de l'utilisateur
// Statut de connexion à 1 pour admin, 2 pour auteur, 3 pour lecteur sinon 0: visiteur
//-----------------------
function addconnexion($usermail, $userpass){
global $mysqli;
global $debug;
    if (!empty($usermail) && !empty($userpass)){                
        // récupérer le login et mot de passe
        $sql="SELECT * FROM `bdm_user` WHERE `userlogin`='".$usermail."';";
        if ($debug){
            echo $sql;
        }
        if ($result = $mysqli->query($sql)){
            if ($row = $result->fetch_assoc()) {
                if ($row['pass'] != md5($userpass)){    // Compte existant mais Mot de pass incorrect
                    return 0;
                }                
            }
            else { // Mail Inconnu
                $usernom=substr($usermail,0,strpos($usermail,'@'));
                $sql2="INSERT INTO `bdm_user`  (`usernom`, `userlogin`, `statut`, `pass`, `telephone`, `club`) VALUES ('".$usernom."', '".$usermail."', 1, '".md5($userpass)."', '', '');";    
                if ($debug){
                    echo $sql2;
                }
                if ($result2 = $mysqli->query($sql2)){
                    return 1; // Rôle visiteur
                }
            }                
        }             
    }
    return 0;
}


?>
