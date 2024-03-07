<?php
    //On démarre une nouvelle session
    session_start();
    /*On utilise session_id() pour récupérer l'id de session s'il existe.
     *Si l'id de session n'existe  pas, session_id() rnevoie une chaine
     *de caractères vide*/
    $id_session = session_id();
    if (isset($_SESSION['admin']) && (!empty($_SESSION['admin']))){
        setcookie('admin', $_SESSION['admin']); 
        echo("Administrateur de session : ".$_SESSION['admin']);
    }
    include("administrer.html");
?>

