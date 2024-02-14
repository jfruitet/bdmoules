<?php
// Script à ne pas supprimer
// Supprime un modèle de la Base de données
// datas du formulaire en input, redirection vers la page appelante en sortie
// Eviter touts les affichages avant la fin du script

include ("./include/config.php");
include ("./include/mysql.php");

$debug = false;
$delete='';
$appel='';  // Page appelante
$reponse='';
$idmodele=0;


$mysqli=NULL; // BD class data

// Get the contents
if (isset($_SERVER['REQUEST_METHOD']) && (strtoupper($_SERVER['REQUEST_METHOD']) !== 'POST')) {
  throw new Exception('Only POST requests are allowed');
}



if (!empty($_POST['delete'])) {
    $delete = $_POST['delete'];  
}

if (!empty($_POST['appel'])) {
    $appel = $_POST['appel'];  
}
 
if (!empty($_POST['idmodele'])) {
    $idmodele = $_POST['idmodele'];  
}

// Supprimer
     if (!empty($idmodele) && ($delete=="Confirmer")){
        // Debug
        if ($debug){
            echo "Suppression<br />\nId modele: $idmodele <br />\n";                
        }           
        connexion_db();
        $reponse = mysql_delete_modele($idmodele);
        $mysqli -> close();
        if (!$debug){
            if (!empty($reponse)){ 
                header("Location: ".$appel."?msg=Modèle supprimé. ".$reponse);
            }
            else{
                header("Location: ".$appel."?msg=Erreur à la suppression d'un modèle. ");
            }                 
        }
        else{
            if (!empty($reponse)){ 
                echo ("Modèle supprimé. ".$reponse);
            }
            else{
                echo("Erreur à la suppression d'un modèle. ");
            }                         
        }
    }     
    else{
        if (!$debug){
            header("Location: ".$appel."?msg=Suppression annulée. ");
        }
        else{
            echo "Suppression annulée\n";
        }
    }   
die();   

//--------------------------
function mysql_delete_modele(){ 
global $debug;
global $reponse;
global $mysqli;
global $idmodele;

$sql='';

    if (!empty($idmodele)){
        // Supprimer les moules associés    
        $result = $mysqli->query("DELETE FROM bdmoules.bdm_moule WHERE ref_modele=".$idmodele.";");
        // Supprimer le modèle
        $sql="DELETE FROM `bdm_modele` WHERE `id`=".$idmodele." ;";
        // Debug
        if ($debug){
            echo "SQL: ".$sql."<br />\n";                
        }           
        if ($result = $mysqli->query($sql)){
             $reponse = '{"ok"=1}';  
        }                    
    }
    return $reponse;
}




?>


