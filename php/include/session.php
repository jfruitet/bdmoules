<?php
    // A placer ne tête de toutes les pages nécessitant une connexion authentifiée
    // On démarre une nouvelle session
    $domain = ($_SERVER['HTTP_HOST'] != 'localhost') ? $_SERVER['HTTP_HOST'] : false;   // Localhost pas forcément supporté par les navigateurs    
    $arr_cookie_options = array (
        'expires' => time() + 60*60*24*1, // 1 jour
        'path' => '/bdmoules/', // pas ailleurs que le dossier ad hoc
        'domain' => $domain, // leading dot for compatibility or use subdomain
        'secure' => false,     // or true : forcément HTTPS
        'httponly' => false,    // or true : uniquement HTML et pas de javascript
        'samesite' => 'Strict' // None || Lax  || Strict
    );   
    
    $usermail='';
    $role=0;
    
    ini_set("session.name", "PHPSESSIDBDM");
    ini_set("session.use_strict_mode", 1);
    ini_set("session.cookie_domain", $domain);
    ini_set("session.cookie_path",  "/bdmoules/");    
    ini_set("session.cookie_httponly", "0");
    ini_set("session.cookie_samesite", "Strict");
    session_start();

/**
 * On utilise session_id() pour récupérer l'id de session s'il existe.
 * Si l'id de session n'existe  pas, session_id() renvoie une chaine
 * de caractères vide
 **/
 
    $id_session = session_id();
    if (!empty($id_session)){ 
        $usermail=$_COOKIE['usermail'];
        $role=$_COOKIE['role'];
    }
?>

