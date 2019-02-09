<?php

session_set_cookie_params(60);
session_start();

checkSession();

require_once "db_connect.php";

$db = array('host'=>$host, 'user'=>$db_user, 'password'=>$db_password, 'name'=>$db_name);


if(isset($_GET['action']) && $_GET['action']==='load-account'){
  echo 'loaded'.$_SESSION["name"];
}
else if(isset($_GET['action']) && $_GET['action']==='load-pictures'){
  getStoredPictures($db, $_SESSION);
}
else if(isset($_GET['action']) && $_GET['action']==='logout-user'){
  logoutUser();
}
else if(isset($_GET['action']) && $_GET['action']==='delete-user'){
  echo 'delete-user-success';
}
else if(isset($_FILES)){
  echo 'readyToLoad';
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
  
  getStoredPictures($db, $session);

  // echo 'readyToLoad';
}


function getStoredPictures($db, $session){
  $query = 'SELECT * FROM storage'.$session["id"];

  $connection = mysqli_connect($db["host"], $db["user"], $db["password"], $db["name"]);
  $response = mysqli_query($connection, $query);
  $fetchedData = mysqli_fetch_all($response, MYSQLI_ASSOC);
  mysqli_close($connection);

  echo json_encode($fetchedData);
  // echo "ssss";
}


function logoutUser(){
  session_destroy();

  echo 'logout-user-success';
}

function checkSession(){
  if((time() - $_SESSION["start-time"]) > 600){
    die("logout-user-success");
  }
  else {
    $_SESSION["start-time"] = time();
  }
}


?>