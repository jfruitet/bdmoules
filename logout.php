<?php
// Logout
// start a session
include("./php/include/session.php");    

unset($_SESSION);

if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    $arr_cookie_options = array (
        'expires' => time() - 42000, 
        'path' => $params["path"], 
        'domain' => $params["domain"], // leading dot for compatibility or use subdomain
        'secure' => $params["secure"],     // pas forcément en https
        'httponly' => $params["httponly"],    // javascript peut y accéder
        'samesite' => 'Strict' // None || Lax  || Strict
    );             

    setcookie(session_name(), '', time() - 42000, $arr_cookie_options);

}

session_destroy();

?>
