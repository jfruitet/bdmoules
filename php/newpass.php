<?php
// newpass.php
// Message avec lien sécurisé pour renouveler un mot de passe

// Envoi du message par mail / smtp
 
// Session activée 
include ("./include/config.php");
include ("./include/session.php");
include ("./include/mysql.php");


$debug = false;

$mydata = new stdClass();

$data = null;
$user = null;
$update=false;
$success=false;
$appel='';  // Page de retour
$pass='';
$usermail='';

// Get the contents
if (isset($_SERVER['REQUEST_METHOD']) && (strtoupper($_SERVER['REQUEST_METHOD']) !== 'POST')) {
  throw new Exception('Only POST requests are allowed');
}

$okjson = (isset($_SERVER['CONTENT_TYPE']) && (stripos($_SERVER['CONTENT_TYPE'], 'application/json') === true));

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

if (isset($data) && !empty($data)) {
    if ($okjson ) {
        $mydata = json_decode($data,true);
    }
    else {
        $mydata = $data;    
    }
    if ($debug){
        // echo "\n<br />\n";
        print_r($mydata);
        //echo "\n<br>EXIT !";   
        //exit;         
    }
    
    if (!empty($mydata)){
        //    {"userid":'+userid+', "usernom":"'+Nom+'", "userlogin":"'+Courriel+'", "telephone":"'+Telephone+'", "club":"'+encodeURIComponent(Club)+'", "adresse":"'+encodeURIComponent(Adresse)+'"}';

        // ( [Nom] => FRUITET Jean [Adresse] => 5 Impasse Paul Edouard Lynch, 44114 Basse Goulaine [Email] => jean.fruitet@free.fr [Telephone] => 06 95 28 73 11 [Commentaire] => Je suis membre de l'ARBL. Ce moule servira à fabriquer un planeur Excalibur dans le cadre des activités de l'école de construction. [Envoyer] => Envoyer [idmodele] => 37 [idmoule] => 47 ) 
    
        // Le message
        // Plusieurs destinataires
        //$to  = 'bureau-arbl@laposte.net, jean.fruitet@free.fr'; // notez la virgule
        
        if (!empty($mydata['appel'])) { 
            $appel = $mydata['appel']; 
        }
        
        if (isset($mydata['Annuler'])) {
            header("Location: ".$appel."?msg=Renouvellement de mot de passe annulé.");
            exit;
        }
        
        if (!empty($mydata['usermail'])){
            $usermail=$mydata['usermail'];
        }
        
        if (!empty($mydata['pass'])){
            $pass=$mydata['pass'];
        }

        // Mise à jour de la BD
        if (!empty($usermail) && !empty($pass)){
            connexion_db(); 
            // Debug
            if ($user=mysql_verif_mail($usermail)){ // OK mail identique 
            
                if (mysql_update_pass($user['userid'], $pass)){           
                    $update=true;
                    $to  = $user['userlogin']; // version de développement
                    // Sujet
                    $subject = 'Confirmation de changement de mot de passe';
    
                    // Message
                    $message = 'Bonjour '.$user['usernom'].",\r\n";
                    $message .= '<br />Votre mot de passe sur la plateforme de réservation de moule de l\'ARBL a été modifié.<br />'."\n";
                    $message .= '<br /><br /><a target=\"_blank\" href=\"http://localhost/bdmoules/\">BDMoules</a>'."\n";    
                    $message .= '<br /><br />--<br />'.MAIL_WEBMASTER."\n";   
    
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
                }
            } 
        }  
        $mysqli -> close();
        if ($update==true){
            if ($debug){
                echo "Mot de passe modifié.<br />";
            }
            else {
                header("Location: ".$appel."?msg=Mot de passe modifié.");    
            }
            exit;
        }                                                                    
    }
}

if ($debug){
    echo "Mot de passe non modifié.<br />";
}
else{
    header("Location: ".$appel."?msg=Mot de passe non modifié.");
}
    
die();

//--------------------------
function mysql_verif_mail($usermail){ 
// Vérification
global $debug;
global $mysqli;

$row=array();
$sql='';
$reponse='';
    if (!empty($usermail)){
        $sql = "SELECT userid, usernom, userlogin FROM `bdm_user` WHERE `userlogin`='".$usermail."';";
        if ($result = $mysqli->query($sql)){
            if ( $row = $result->fetch_assoc()) {
                if ($row['userlogin'] == $usermail){
                    return $row;                                    
                }   
            }
        }                            
    }
    return $row;
}

//--------------------------
function mysql_update_pass($userid, $pass){ 
global $debug;
global $mysqli;

// userid 	usernom 	userlogin 	statut [1: admin, 2:auteur, 3: lecteur] pass [pass crypté MD5] 	telephone 	club	adresse
$sql='';
    if (!empty($userid)){
        $sql = "UPDATE `bdm_user` SET `pass`='".md5($pass)."' WHERE `userid`=".$userid.";";
        // Debug
        if ($debug){
            echo "SQL: ".$sql."<br />\n";                
        }           
        return ($mysqli->query($sql));
    }
    return false;
}


?>
