<?php
// Vérification des droits de connexion et du rôle
include ("./include/mysql.php");
$debug=false;
$mysqli=NULL; // BD class data
$reponse='{"ok":0}';
$mydata = new stdClass();
$data = null;

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
        echo "UserMail: ".$mydata['usermail']." UserPass: ".$mydata['userpass']."<br />\n";
        //exit;
    }
    
    if (!empty($mydata['usermail']) && !empty($mydata['userpass'])){
        //echo "UserMail: ".$mydata['usermail']." UserPass: ".$mydata['userpass']."<br />\n";
        connexion_db();
        if ($role=connexion($mydata['usermail'], $mydata['userpass'])) // on vérifie que les identifiants sont bons
        {
            session_start(); 
        
            $domain = ($_SERVER['HTTP_HOST'] != 'localhost') ? $_SERVER['HTTP_HOST'] : false;   // Localhost pas forcément supporté par les navigateurs    
            $arr_cookie_options = array (
                'expires' => time() + 60*60*24*1, // 1 jour
                'path' => '/bdmoules/', // pas ailleurs que le dossier ad hoc
                'domain' => $domain, // leading dot for compatibility or use subdomain
                'secure' => false,     // or true : forcément HTTPS
                'httponly' => false,    // or true : uniquement HTML et pas de javascript
                'samesite' => 'Strict' // None || Lax  || Strict
            );             
            setcookie('usermail', $mydata['usermail'], $arr_cookie_options);
            setcookie('role', $role, $arr_cookie_options);
            $reponse =  '{"ok":1, "role":'.$role.'}';
        }
        $mysqli -> close();
    }
}
echo $reponse;
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

?>
