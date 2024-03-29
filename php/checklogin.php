<?php
// Vérification des droits de connexion et du rôle
// On démarre une nouvelle session
include ("./include/config.php");
include ("./include/session.php");
include ("./include/mysql.php");
$debug=false;
$mysqli=NULL; // BD class data
$reponse_not_ok='{"ok":0}';
$reponse='';
$success='';
$mydata = new stdClass();
$data = null;
$appel='';  // Page appelante
$usernom='';

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
        echo "NewPass:".$mydata['NewPass'];
        echo "<br />UserMail: ".$mydata['usermail']." UserPass: ".$mydata['userpass']."<br />\n";
        //echo "EXIT"; exit;
    }
    
    // Changement de mot de passe ?
    if (!empty($mydata['NewPass'])){
        if ($debug){
            echo "NEWPASS : ".$mydata['NewPass']."<br />\n";
            echo $mydata['usermail']."<br />\n";
        }
        
        if (!empty($mydata['usermail'])){
    
        // Le message
        // Plusieurs destinataires
        //$to  = 'bureau-arbl@laposte.net, jean.fruitet@free.fr'; // notez la virgule
        
            connexion_db();     
            $usernom=mysql_verifusermail($mydata['usermail']);
            $mysqli -> close();
            if ($debug){
                echo "USERNOM: ".$usernom."<br />\n";
                echo $mydata['usermail']."<br />\n";
            }            
            if (!empty($usernom)){
            
                $to  = $mydata['usermail']; // version de développement
                // Sujet
                $subject = 'Réservation de moules : nouveau mot de passe';
    
                // Message
                $message = 'Bonjour  '.$usernom.",\r\n";
                $message .= 'Vous avez demandé un renouvellement de votre mot de passe sur la plateforme de réservation de moule de l\'ARBL.<br />'."\n";
                $message .= '<br />Cliquez sur le lien <a href="http://localhost/bdmoules/php/saisienewpass.php?id='.md5($usernom).'&courriel='.$mydata['usermail'].'&secondes='.time().'">Créer un nouveau mot de passe</a>.<br />'."\n";
   
    
            // Header
            // En-têtes additionnels
     
            // Version d'exploitation
     /*
     $headers =      'From: '.$mydata->Email. "\r\n" . 
     'From: '$mydata['Courriel']. "\r\n" .
     'Cc: jean.fruitet@orange.fr'. "\r\n" .
     'Bcc: ludovic.boissinot@orange.fr' ."\r\n" . 
     'Reply-To: '.$data['Courriel']. "\r\n" .
      X-Mailer: PHP/' . phpversion();
    */
    // Version de développement
    
                $headers = 'From: '.MAIL_WEBMASTER. "\r\n" . 
     'Cc: '.MAIL_WEBMASTER. "\r\n" .
     'Bcc: jean.fruitet@gmail.com'. "\r\n" .
     'Reply-To: '.MAIL_WEBMASTER. "\r\n" .
     'X-Mailer: PHP/' . phpversion(); 
    
                $headers .= "MIME-Version: 1.0\r\n";
                $headers .= "Content-Type: text/html; charset=UTF-8\r\n";     
    
                if ($debug){
                    echo "\n<br />To: ".$to."<br />\n";
                    echo "Subject: ".$subject."<br />\n";
                    echo "Headers: ".$headers."<br />\n";
                    echo "Message: ".$message."<br />\n";
                }
    
        // Envoi ; Attention j'utilise la configuration de sendmail.exe pour Xampp décrite ici
        // http://www.sintesisdigital.com.mx/dashboard/docs/send-mail.html
        // Après avoir configuré Google Mail pour la double authentification 
        // En utilisant un mot de passe sépcifique 
                $success = mail($to, $subject, $message, $headers);    
                if (!$debug){
                    if (!empty($success)){ 
                        header("Location: ".$mydata['appel']."?msg=Demande de renouvellement de mot de passe envoyée à ".$usernom);
                    }
                    else{
                        header("Location: ".$mydata['appel']."?msg=Ce courriel n\'est pas enregistré dans notre base de donnée. ".$reponse_not_ok);   
                    }    
                }
                else{
                    if (!empty($success)){ 
                        echo "Demande de renouvellement envoyée à ".$success;
                    }
                    else{
                        echo "Ce courriel n\'est pas enregistré dans notre base de donnée. "; 
                    }    
                }    
            } 
        }       
    }
    // Debut de check Login
    else if (!empty($mydata['usermail']) && !empty($mydata['userpass'])){
        echo "CHECKLOGIN UserMail: ".$mydata['usermail']." UserPass: ".$mydata['userpass']."<br />\n";
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
    }
    else{
        if (!$debug){
            header("Location: ".$mydata['appel']."?msg=Connexion invalide. ".$reponse_not_ok);     
        }
        else{
            echo "Connexion invalide. "; 
        }               
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


//--------------------------
function mysql_verifusermail($usermail){ 
// Pas de mise à jour du courriel ni du mot de passe ni du rôle
global $debug;
global $mysqli;
global $usernom;

$usernom='';
$sql='';
$reponse='';
    if (!empty($usermail)){
        $sql = "SELECT usernom, userlogin FROM `bdm_user` WHERE `userlogin`='".$usermail."';";
        //echo $sql;
        if ($result = $mysqli->query($sql)){
            if ( $row = $result->fetch_assoc()) {
                if ($row['userlogin'] == $usermail){
                    $usernom = $row['usernom'];                                    
                }   
            }
        }                            
    }
    return $usernom;
}


?>
