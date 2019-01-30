<?php

session_set_cookie_params(600);
session_start();

require_once "db_connect.php";

$db = array('host'=>$host, 'user'=>$db_user, 'password'=>$db_password, 'name'=>$db_name);


if(isset($_GET['action']) && $_GET['action']==='loadAccount'){
  echo 'loaded'.$_SESSION["name"];
}
else if(isset($_GET['action']) && $_GET['action']==='loadPictures'){
  getStoredPictures($db, $_SESSION);
}
else if(isset($_FILES)){
  echo 'savePictures';
  // savePictures($db, $_SESSION, $_FILES);
}



function savePictures($db, $session, $files){
  
  $connection = mysqli_connect($db["host"], $db["user"], $db["password"], $db["name"]);
  $size = sizeof($files['images']['tmp_name']);

  for($i=0; $i<$size; $i++){
    $image = file_get_contents($files['images']['tmp_name'][$i]);
    $image = base64_encode($image);

    $query = 'INSERT INTO storage'.$session["id"].' VALUES(null, "'.$session["user"].'", "'.$files['images']['name'][$i].'", '.$image.', "'.$files['images']['size'][$i].'")';

    $response = mysqli_query($connection, $query);
  }

  mysqli_close($connection);

  echo 'readyToLoad';
}




function getStoredPictures($db, $session){
  $query = 'SELECT * FROM storage_id'.$session["id"];

  $connection = mysqli_connect($db["host"], $db["user"], $db["password"], $db["name"]);
  $response = mysqli_query($connection, $query);
  $fetchedData = mysqli_fetch_all($response, MYSQLI_ASSOC);
  mysqli_close($connection);

  echo json_encode($fetchedData);
}




?>