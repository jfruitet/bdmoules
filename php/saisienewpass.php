<?php
// saisienewpass.php
// formulaire pour renouveler un mot de passe
// http://localhost/bdmoules/php/saisienewpass.php?id=28b89a356ca26f0959d131f8ed53b47a&courriel=jean.fruitet@free.fr&secondes=1711715124
// Envoi du message par mail / smtp
 
// Session activée 
include ("./include/config.php");
include ("./include/session.php");
include ("./include/mysql.php");


//$debug = false;
$debug = true;
$success=false;
$secondes='';
$usernom='';
$usermail='';
$id='';  // MD5 du nom
$delai=0;

// Get the contents

if (isset($_SERVER['REQUEST_METHOD']) && (strtoupper($_SERVER['REQUEST_METHOD']) !== 'GET')) {
  throw new Exception('Only GET requests are allowed');
}

      
if (!empty($_GET['id'])) {
    $id = $_GET['id'];  
}

if (!empty($_GET['courriel'])) {
    $usermail = $_GET['courriel'];  
}


if (!empty($_GET['secondes'])) {
    $secondes = $_GET['secondes'];  
    echo ("SECONDES ".$secondes);
    $delai = (int) $secondes;
    $delai+=60*15;
}

      if ($debug && false){
                echo "ID = USERNOM MD5: $id<br />\n";
                echo "Courriel: $usermail<br />\n";
                echo "Timestamp: $secondes<br />\n";
                echo "Delai: $delai<br />\n";
                echo "Time: ".time()."<br />\n";
            }      


if (!empty($delai) && (time()<$delai)){
    // délai de 15 minutes pour effectuer le changement de mot de passe
    if ($debug && false){
        echo "Timestamp: ".$secondes." Delai: ".$delai." &gt; ".time()."<br />\n";
    }        
    if (!empty($usermail) && !empty($id)) {    // Vérification de l'identité du demandeur
            connexion_db();     
            $usernom=mysql_verifusermail($usermail);
            $mysqli -> close();
                  
            if (!empty($usernom)){
                if ($id == md5($usernom)){  // On a correctement identifié l'émetteur
?>               
<!DOCTYPE html>
<html lang="fr">
  <meta charset="UTF-8">  
  <meta name="keywords" content="HTML, CSS, JavaScript">
  <meta name="description" content="Gestion des Moules ARBL">
  <meta name="author" content="Jean Fruitet">
  <link rel="icon" type="image/x-icon" href="./images/favicon.ico">
  <title>Gestion des moules ARBL</title>
  <!-- Feuilles de style -->
<link rel="stylesheet" href="../css/style.css"> 
<link rel="stylesheet" href="../css/style1.css">
</head>
<body>
<h2><a target="_blank" href="http://www.arbl.fr"><img class="imgright" src="../images/logo_arbl.png" alt="logo ARBL" title="logo ARBL"></a>Moules de l'ARBL</h2>
<p><a href="mailto:jean.fruitet@free.fr?subject=Moules ARBL">jean.fruitet@free.fr</a></p>
<h3>Nouveau mot de passe</h3>
<p><span id="msg">Saisissez un nouveau mot de passe...</span>
<span id="loginform"><span></p>
<div class="left">
<p><span id="consigne"><span></p>
</div>
<div id="basdepage">Version 0.3 (<a target="_blank" href="https://creativecommons.org/licenses/by-sa/4.0/deed.fr">CC BY-SA 4.0</a>) <a href="mailto:jean.fruitet@.free.fr?subject=Moules ARBL">JF</a></div>
</body>
<script src="../js/config.js"></script>
<script src="../js/login.js"></script>
<script src="../js/myscript.js"></script>

<script>
// Chargement de la liste des fichiers de données vérifiées
 window.onload = function(){
    // Cookies
    checkCookies();
    adminpage = 0;
    // Paramètres
    let msg = ''; 
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    if (urlParams.has('msg')){
        msg = urlParams.get('msg');
    }
    document.getElementById("msg").innerHTML = '<span class="surligne">'+msg+'</span> ';        
    //document.getElementById("loginform").innerHTML = saisieNewPass();
}    
</script>
</html>                
<?php
                } 
            }   
    }            
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
