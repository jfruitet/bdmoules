<?php
include ("./include/config.php");

//-----------------------
function login(){
    $str='<p>Saisissez votre identifiant d\'administrateur.</p>'."\n";
    $str.='<form action="checklogin.php" method="post"><label for="adminmail">Courriel</label> <input type="text" id="adminmail" name="adminmail" value="'.mail.'" />'."\n";
    $str.='&nbsp; &nbsp; <label for="adminpass">Mot de passe</label> <input type="password" id="adminpass" name="adminpass" size="10" value="" />'."\n";
    $str.='<input type="submit" name="Valider" value="Valider" /></form></p>'."\n";

    echo $str;
}

?>
