<?php

// Enregistre une image codée base64 au format mime ad hoc
// Dépose un fichier 
$debug=false;

$imagebase64='';
$filename='';
$tmpfilename='';

if (!empty($_GET)){
    echo "GET\n";
    //print_r($_GET);    
}
if ($debug){
if (!empty($_POST)){
    echo "POST\n";
    print_r($_POST);    
}
exit;
}

if (!empty($_POST['filename'])){
    $filename=$_POST['filename'];
}

if (!empty($_POST['imagebase64'])){
    $imagebase64=$_POST['imagebase64'];
    //echo $image;
}

//[imagebase64] => data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAlgAAAJYCAYAAAC+ZpjcAAAgAElEQVR4Xuy9CZxld1Xvu2o4NVd19d ) 
if (!empty($imagebase64) && (substr( $imagebase64, 0, 5 ) === "data:" )) {  
    $nomf = md5(time().uniqid()); 
    $tmpfilename=save_base64_image($imagebase64, $nomf, "../images/");
    echo '{"Ok":1, "nomf":"'.$filename.'", "tmp":"'.$tmpfilename.'"}';
    exit;
}  
echo '{"Ok":0}';

die();

// https://stackoverflow.com/questions/15153776/convert-base64-string-to-an-image-file

// --------------
function save_base64_image($base64_image_string, $output_file_without_extension, $path_with_end_slash="" ) {
    //usage:  if( substr( $img_src, 0, 5 ) === "data:" ) {  $filename=save_base64_image($base64_image_string, $output_file_without_extentnion, getcwd() . "/application/assets/pins/$user_id/"); }      
    //
    //data is like:    data:image/png;base64,asdfasdfasdf
    $output_file_with_extension='';
    $extension='jpg';
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

?>
