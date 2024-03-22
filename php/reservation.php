<?php
// reservation.php
// module de réservation d'un moule
// Utilise SMTP
// Paramètre entrant par POST
// Envoi du message par mail
// https://www.journaldunet.fr/developpeur/developpement/1202761-comment-configurer-xampp-pour-envoyer-des-mails-depuis-un-localhost/
// Fichier C:/xampp/php.ini et C:/xampp/sendmail/sendmail.ini modifiés

// Session activée 
include ("./include/config.php");
include ("./include/session.php");

if (!isset($role) || ($role<LECTEUR)){
    echo '{"Ok":0, "msg":"Vous n\'avez pas accès à cette fonction"}';
    die();    
}


$debug = true;
$mydata = new stdClass();
$reponse_ok = '{"ok":1}';
$reponse_not_ok = '{"ok":0}';
$data = null;
$success=false;

// Get the JSON contents
if (isset($_SERVER['REQUEST_METHOD']) && (strtoupper($_SERVER['REQUEST_METHOD']) !== 'GET')) {
  throw new Exception('Only GET requests are allowed');
}
if (isset($_SERVER['CONTENT_TYPE']) && (stripos($_SERVER['CONTENT_TYPE'], 'text/plain;charset=UTF-8') === false)) {
  throw new Exception('Content-Type must be text/plain;charset=UTF-8');
}

if (!empty($_GET['idmodele'])) {
    $idmodele = $_GET['idmodele'];  
}
if (!empty($_GET['idmoule'])) {
    $idmoule = $_GET['idmoule'];  
}

if (!empty($_GET['Nom'])) {
    $Nom = $_GET['Nom'];  
}
if (!empty($_GET['Adresse'])) {
    $Adresse = $_GET['Adresse'];  
}
if (!empty($_GET['Email'])) {
    $Email = $_GET['Email'];  
}
if (!empty($_GET['Telephone'])) {
    $Telephone = $_GET['Telephone'];  
}
if (!empty($_GET['Commentaire'])) {
    $Commentaire = $_GET['Commentaire'];  
}


if (isset($idmodele) && (!empty($idmodele)) && isset($idmoule) && (!empty($idmoule)))
{
    $str="$idmodele, $idmoule, $Nom, $Adresse, $Email, $Telephone, $Commentaire"; 
    if ($debug){
        // print_r($data);
        // echo "\n<br />\n";
        // print_r($mydata);
        file_put_contents("debug_test.txt", $str."\n");
    }
    
    $success=!empty($str);
    
    // ( [Nom] => FRUITET Jean [Adresse] => 5 Impasse Paul Edouard Lynch, 44114 Basse Goulaine [Email] => jean.fruitet@free.fr [Telephone] => 06 95 28 73 11 [Commentaire] => Je suis membre de l'ARBL. Ce moule servira à fabriquer un planeur Excalibur dans le cadre des activités de l'école de construction. [Envoyer] => Envoyer [idmodele] => 37 [idmoule] => 47 ) 
    
    // Le message
    // Plusieurs destinataires
    //$to  = 'bureau-arbl@laposte.net, jean.fruitet@free.fr'; // notez la virgule
    /*
    $to  = 'jean.fruitet@gmail.fr'; // version de développement
    // Sujet
    $subject = 'Réservation de moules';
    // Message
    $message = 'Merci de bien vouloir me réserver le moule N°'.$data['idmoule'].' du modèle '.$data['idmodele']."\n";
    $message .= 'Nom : '.$data['Nom']."\n";
    $message .= 'Adresse : '.$data['Adresse']."\n";
    $message .= 'Courriel : '.$data['Email']."\n";
    $message .= 'Téléphone : '.$data['Telephone']."\n\n";
    $message .= $data['Commentaire']."\n";   
    */ 
    // Header
     // En-têtes additionnels
     /*
     // Version d'exploitation
     $headers =      'From: '.$data['Email']. "\r\n" . 
     'From: '$data['Email']. "\r\n" .
     'Cc: jean.fruitet@orange.fr'. "\r\n" .
     'Bcc: ludovic.boissinot@orange.fr' ."\r\n" . 
     'Reply-To: '.$data['Email']. "\r\n" .
      X-Mailer: PHP/' . phpversion();
    */
    // Version de développement
    /*
    $headers = 'From: '.$data['Email']. "\r\n" . 
     'Cc: jean.fruitet@orange.fr'. "\r\n" .
     'Bcc: jean.fruitet@laposte.fr'. "\r\n" .
     'Reply-To: '.$data['Email']. "\r\n" .
     'X-Mailer: PHP/' . phpversion(); 
    if ($debug){
        echo "\n<br />To: ".$to."<br />\n";
        echo "Subject: ".$subject."<br />\n";
        echo "Headers: ".$headers."<br />\n";
        echo "Message: ".$message."<br />\n";
    }
     // Envoi ; Attention j'utilise la configuration de sendmail.exe pour Xampp décrite ici
     // http://www.sintesisdigital.com.mx/dashboard/docs/send-mail.html
    $success= mail($to, $subject, $message, $headers);
    */
    
    
    if ($success){    // return value
        echo $reponse_ok; // Chasser la première accolade      
    } 
    else{
        echo $reponse_not_ok;
    }
}
else {
    echo $reponse_not_ok;
}
?>


