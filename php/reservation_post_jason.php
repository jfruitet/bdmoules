<?php
// reservation_post_json.php
// module de réservation d'un moule

// Paramètre entrant par POST
// Mise à jour de la table bdm_user

// Envoi du message par mail / smtp
// https://www.journaldunet.fr/developpeur/developpement/1202761-comment-configurer-xampp-pour-envoyer-des-mails-depuis-un-localhost/
// Fichier C:/xampp/php.ini et C:/xampp/sendmail/sendmail.ini modifié pour Xampp
// selon les directives de 
// http://www.sintesisdigital.com.mx/dashboard/docs/send-mail.html
// Code repris de 
// https://www.letecode.com/comment-envoyer-un-mail-en-php-avec-mail-smtp-phpmailer
// Modification de sécurité sur un compte Google avec la double authentification :
// https://help.warmupinbox.com/en/articles/4934806-configure-for-google-workplace-with-two-factor-authentication-2fa
// Le mot de passe spécifique pour l'application désignée (xampp) est enregistré dans sendmail.ini
// Il semble fonctionner pour toutes les page .php du site...
 
// Session activée 
include ("./include/config.php");
include ("./include/session.php");
include ("./include/mysql.php");

if (!isset($role) || ($role<LECTEUR)){
    echo '{"ok":0, "msg":"Vous n\'avez pas accès à cette fonction"}';
    die();    
}


$debug = false;
//$debug = true;
$mydata = new stdClass();
$reponse_ok = '{"ok":1}';
$reponse_not_ok = '{"ok":0}';
$data = null;
$success=false;
$appel='';  // Page de retour
$userid=0; // Mise à jour des infos de la table bdm_user
$usernom='';
$telephone='';
$club='';
$adresse='';

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
            header("Location: ".$appel."?msg=Réservation annulée.");
            exit;
        }
        
        if (!empty($mydata['userid'])) { // utile pour mettre à jour la table bdm_user
            $userid = $mydata['userid'];             
        }
        
        // Mise à jour de la BD
        if (!empty($userid)){
            $usernom=$mydata['Nom'];
            $telephone=$mydata['Telephone'];
            $club=$mydata['Club'];
            $adresse=$mydata['Adresse'];
            connexion_db(); 
            // Debug
            if ($debug){
                echo "Mise à jour du compte Id: $userid, Nom: $usernom, Téléphone: $telephone, Club: $club, Adresse: $adresse<br />\n";                
            }    
            $reponse = mysql_update_bdm_user($userid);
            $mysqli -> close();
        } 
        
        $to  = MAIL_RESERVATION; // version de développement
        // Sujet
        $subject = 'Réservation de moules';
    
        // Message
        $message = 'Merci de bien vouloir me réserver les moule suivants '.$mydata['moules']."\r\n";
        $message .= 'Nom : '.$mydata['Nom']."<br />\n";
        $message .= 'Adresse : '.$mydata['Adresse']."<br />\n";
        $message .= 'Courriel : '.$mydata['Courriel']."<br />\n";
        $message .= 'Téléphone : '.$mydata['Telephone']."<br />\n";
        $message .= 'Club : '.$mydata['Club']."<br /><br />\n";
        $message .= 'Commentaire : '.$mydata['Commentaire']."<br />\n";
   
    
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
    
        $headers = 'From: '.$mydata['Courriel']. "\r\n" . 
     'Cc: '.MAIL_WEBMASTER. "\r\n" .
     'Bcc: jean.fruitet@gmail.com'. "\r\n" .
     'Reply-To: '.$mydata['Courriel']. "\r\n" .
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

if ($okjson){ 
    if ($success){    // return value
        echo $reponse_ok;      
    } 
    else{
        echo $reponse_not_ok;
    }
}
else if (!empty($appel)){
    if ($success){    // return value
        header("Location: ".$appel."?msg=Réservation envoyée.");
    }
    else{
        header("Location: ".$appel."?msg=Réservation annulée.");
    }
}



//--------------------------
function mysql_update_bdm_user($userid){ 
// Pas de mise à jour du courriel ni du mot de passe ni du rôle
global $debug;
global $mysqli;
global $usernom;
global $telephone;
global $club;
global $adresse;

$sql='';
$reponse='';
    if (!empty($userid)){
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
