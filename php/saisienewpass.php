<?php
// saisienewpass.php
// formulaire pour renouveler un mot de passe
// http://localhost/bdmoules/php/saisienewpass.php?id=28b89a356ca26f0959d131f8ed53b47a&courriel=jean.fruitet@free.fr&secondes=1711715124
// Envoi du message par mail / smtp
 
// Session activée 
include ("./include/config.php");
include ("./include/session.php");
include ("./include/mysql.php");


$debug = false;
//$debug = true;
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
    // echo ("SECONDES ".$secondes);
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


if (empty($delai) || (time()>$delai)){
    // délai de 15 minutes pour effectuer le changement de mot de passe
    if ($debug && false){
        echo "Timestamp: ".$secondes." Delai: ".$delai." &gt; ".time()."<br />\n";       
    }    
    affiche_entete();
    echo '<p><span id="msg">Délai dépassé...</span></p>'; 
    affiche_bas_de_page();    
}    
else if (!empty($usermail) && !empty($id)) {    // Vérification de l'identité du demandeur
    connexion_db();     
    $usernom=mysql_verifusermail($usermail);
    $mysqli -> close();
                  
    if (!empty($usernom)){
                if ($id == md5($usernom)){  // On a correctement identifié l'émetteur
                     affiche_entete();
                     affiche_saisie($usermail);
                     affiche_script();
                     affiche_bas_de_page();
                     exit;
                } 
    } 
    else{
        affiche_entete();
        echo '<p><span id="msg">Utilisateur inconnu...</span></p>'; 
        affiche_bas_de_page();            
    }        
}            




//--------------------------
function mysql_verifusermail($usermail){ 
// Pas de mise à jour du courriel ni du mot de passe ni du rôle
global $debug;
global $mysqli;
$row=null;
$usernom='';
$sql='';
$reponse='';
    if (!empty($usermail)){
        $sql = "SELECT userid, usernom, userlogin FROM `bdm_user` WHERE `userlogin`='".$usermail."';";
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

// ---------------------------
function affiche_entete(){

echo '<!DOCTYPE html>
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
<h2><a target="_blank" href="http://www.arbl.fr"><img class="imgright" src="../images/logo_arbl.png" alt="logo ARBL" title="logo ARBL"></a>Moules de l\'ARBL</h2>
<p><a href="mailto:jean.fruitet@free.fr?subject=Moules ARBL">jean.fruitet@free.fr</a></p>
<h3>Nouveau mot de passe</h3>
'; 
}

// -----------------------
function affiche_saisie($usermail){   
$url='./newpass.php';
if (!empty($usermail)){
    echo '<p>Saisissez deux fois votre nouveau mot de passe.</p>'."\n";        
    echo '<form name="formPass" action="'.$url.'" method="post" onSubmit="return verifPass();">'."\n";
    echo '<br /> <label for="pass">Nouveau mot de passe</label> <input type="password" id="pass" name="pass" size="10" value="" />'."\n";
    echo '<br /> <label for="pass2">Ressaisir S.V.P.</label> <input type="password" id="pass2" name="pass2" size="10" value="" />'."\n";    
    echo '<input type="hidden" name="appel" id="appel" value="../index.html" />'."\n";
    echo '<input type="hidden" id="usermail" name="usermail" value="'.$usermail.'" />'."\n";    
    echo '<br /><input type="submit" name "Envoyer" value="Envoyer" />'."\n";
    echo '&nbsp; &nbsp; <input type="reset" value="Réinitialiser"  />'."\n";
    echo '</form>'."\n";
    }
    else{
        echo '<p><span id="msg">Utilisateur inconnu...</span></p>'."\n";    
    } 
}

// ---------------------------
function affiche_script(){       
echo '<div class="left">
<p><span id="consigne"><span></p>
</div>
<script src="../js/config.js"></script>
<script src="../js/login.js"></script>
<script src="../js/myscript.js"></script>
<script>       

 // --------------------
 function verifPass(){
    let fusermail=document.forms["formPass"]["usermail"];               
    let fuserpass=document.forms["formPass"]["pass"];
    let fuserpass2=document.forms["formPass"]["pass2"];                
          
    if (fusermail.value == "")                                  
    { 
        alert("Courriel non renseigné."); 
        return false; 
    } 
    
    if (fuserpass.value == ""){ 
        alert("Complétez le mot de passe"); 
        fuserpass.focus(); 
        return false; 
    }  
          
    if (fuserpass2.value == "") { 
        alert("Ressaisir ce mot de passe"); 
        fuserpass2.focus(); 
        return false; 
    }  
    
    if ((fuserpass.value !== "") && (fuserpass2.value !== "") && (fuserpass2.value !== fuserpass.value) {
        alert("Mots de passes différents"); 
        fuserpass2.focus(); 
        return false;                 
    }       
     
    return true;                     
 }
  
</script>
';
}

// ---------------------------
function affiche_bas_de_page(){ 
echo '<div id="basdepage">Version 0.3 (<a target="_blank" href="https://creativecommons.org/licenses/by-sa/4.0/deed.fr">CC BY-SA 4.0</a>) <a href="mailto:jean.fruitet@free.fr?subject=Moules ARBL">JF</a></div>
</body>
</html>                
';
}

?>
