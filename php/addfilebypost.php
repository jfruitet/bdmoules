<?php

// Enregistre une image codée base64 au format mime ad hoc dans un dossier ad hoc et crée une vignette
// Dépose un fichier 
include ("./include/config.php");
$debug=false;

$imagebase64='';
$filename='';
$extension='';
$nomf='';


if (!empty($_POST['filename'])){
    $filename=$_POST['filename'];
}

if (!empty($_POST['imagebase64'])){
    $imagebase64=$_POST['imagebase64'];
    //echo $imagebase64;
}

if (!empty($filename)){
	$nomf = substr($filename, 0, strrpos($filename,'.')); // supprimer l'extension
	$extension = substr($filename, strrpos($filename,'.')+1); // extension
}
else{
	// On cree un identifiant unique
	$nomf = md5(time().uniqid());
}	
	
if ($debug){
	echo "NomF: $nomf, Extension: $extension, Filename: $filename<br />\n";
}
			
if (!empty($imagebase64) && !empty($nomf)){
	if (!file_exists(DATAPATH_IMAGES.$filename)){	// Ne pas enregistrer deux fois
		// On sauvegarde
		//[imagebase64] => data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAJYCAYAAAC+ZpjcAAAgAElEQVR4Xuy9CZxld1Xvu2o4NVd19d ) 
		if (!empty($imagebase64) && (substr( $imagebase64, 0, 5 ) === "data:" )) {  
			$filename=save_base64_image($imagebase64, $nomf, DATAPATH_IMAGES);
			save_vignette($nomf);
			echo '{"Ok":1, "nomf":"'.$filename.'", "msg":"Image enregistrée"}';
			exit;
		}
	}  
	else {
		// Echec
		echo '{"Ok":0, "msg":"Ce fichier existe déjà"}';
		exit;
	}
}
// Echec
echo '{"Ok":0, "msg":"Données invalides"}';

die();

// https://stackoverflow.com/questions/15153776/convert-base64-string-to-an-image-file

// --------------
function save_base64_image($base64_image_string, $output_file_without_extension, $path_with_end_slash="" ) {
	global $extension;
    //usage:  if( substr( $img_src, 0, 5 ) === "data:" ) {  $filename=save_base64_image($base64_image_string, $output_file_without_extentnion, getcwd() . "/application/assets/pins/$user_id/"); }      
    //
    //data is like:    data:image/png;base64,asdfasdfasdf
    $output_file_with_extension='';

    $splited = explode(',', substr( $base64_image_string , 5 ) , 2);
    $mime=$splited[0];
    $data=$splited[1];

    $mime_split_without_base64=explode(';', $mime,2);
    $mime_split=explode('/', $mime_split_without_base64[0],2);
    if (count($mime_split)==2)
    {
        $extension=$mime_split[1];
        if ($extension=='jpeg') {
            $extension='jpg';
        }
        //if($extension=='javascript')$extension='js';
        //if($extension=='text')$extension='txt';
    }
    $output_file_with_extension=$output_file_without_extension.'.'.$extension;    
    file_put_contents( $path_with_end_slash . $output_file_with_extension, base64_decode($data) );
    return $output_file_with_extension;
}


// ---------------------
function save_vignette(){
	global $debug;
	global $nomf;
	global $extension;
	
	if (file_exists(DATAPATH_IMAGES.$nomf.'.'.$extension) && !file_exists(DATAPATH_VIGNETTES.$nomf.'.'.$extension)){
		// On réduit la taille du fichier
		list($width, $height, $type, $attr) = getimagesize(DATAPATH_IMAGES.$nomf.'.'.$extension);	
		$newwidth = $width;
		$newheight = $height;
		// On change d'échelle
		if ($width>400){
			$echellex = (float)(400.0 / (float)$width); 
			$newwidth = 400;
			$newheight = floor((float)$height * $echellex);
		}
		if ($debug){
			echo "Dans save_vignette()<br />\nNom fichier : $nomf, Extension : $extension <br />\n";
			echo "Path : ".DATAPATH_IMAGES.$nomf.'.'.$extension." <br />\n";
			echo "Height: $height, Width: $width, NewHeight: $newheight, NewWidth: $newwidth \n<br />";
		}			
		if ($extension=='jpg'){
			$im = imagecreatefromjpeg(DATAPATH_IMAGES.$nomf.'.'.$extension);
		}
		else if ($extension=='png'){
			$im = imagecreatefrompng(DATAPATH_IMAGES.$nomf.'.'.$extension);
		}
		else if ($extension=='gif'){
			$im = imagecreatefromgif(DATAPATH_IMAGES.$nomf.'.'.$extension);			
		}
		
		// on applique la reduction de taille
		if ($im){
			if ($debug){
                echo "Réduction de taille <br />\n";
			}				

			$newim=imagescale($im, $newwidth, $newheight, IMG_BILINEAR_FIXED);
            if ($newim){
				if ($debug){
                    echo "Enregistrement de la vignette<br />\n";
                    echo "Path Vignette : ".DATAPATH_VIGNETTES.$nomf.'.'.$extension."<br />\n";
				}				

				// On sauvegarde la vignette
				if ($extension=='jpg'){
					imagejpeg($newim, DATAPATH_VIGNETTES.$nomf.'.'.$extension);
				}
				else if ($extension=='png'){
					imagepng($newim, DATAPATH_VIGNETTES.$nomf.'.'.$extension);
				}
				else if ($extension=='gif'){
				    imagegif($newim, DATAPATH_VIGNETTES.$nomf.'.'.$extension);
				}	
				imagedestroy($newim);
			}
			imagedestroy($im);
		}		
	}	
}
	
?>
