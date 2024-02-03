<?php

mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

function connexion_db(){
    global $mysqli;
    $mysqli = new mysqli("localhost", "root", "", "bdmoules");
    
    // Check connection
    if ($mysqli -> connect_errno) {
        echo "Failed to connect to MySQL: " . $mysqli -> connect_error;
        exit();
    }
    // echo $mysqli->host_info . "\n";
} 


?>
