<?php

// Dépose un fichier 
if (!empty($_GET)){
    echo "GET\n";
    print_r($_GET);    
}

if (!empty($_POST)){
    echo "POST\n";
    print_r($_POST);    
}

/*
POST Array ( [image] => data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAJYCAYAAAC+ZpjcAAAgAElEQVR4Xuy9CZxld1Xvu2o4NVd19d ) 
*/


die();
?>
