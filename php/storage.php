<?php
session_start();

checkSession();

require_once "db_connect.php";
$connection = mysqli_connect($host, $db_user, $db_password, $db_name);


if(isset($_GET['action']) && $_GET['action']==='load-account'){
  echo 'loaded'.$_SESSION["name"];
}
else if(isset($_GET['action']) && $_GET['action']==='load-pictures'){
  $_SESSION["counter"] = getStoredPictures($_SESSION, $connection);
}
else if(isset($_GET['action']) && $_GET['action']==='logout-user'){
  session_destroy();
  echo 'logout-user-success';
}
else if(isset($_POST["id"]) && isset($_POST['new-name'])){
  editImage($_POST['id'], $_POST['new-name'], $_SESSION["id"], $connection);
}
else if(isset($_GET['action']) && $_GET['action']==='delete-image' && isset($_GET['imageID'])){
  deleteImage($_GET['imageID'], $connection);
}
else if(isset($_GET['action']) && $_GET['action']==='delete-user'){
  deleteUser($_SESSION, $connection);
}
else if(isset($_FILES['images'])){
  if(($_SESSION["counter"] + count($_FILES["images"]["tmp_name"])) > 12){
    echo "too-many-images";
  }
  else {
    savePictures($_SESSION, $_FILES, $connection, "upload");
  }
}
else if(isset($_POST)){
  if(($_SESSION["counter"] + count($_POST)) > 12){
    echo "too-many-images";
  }
  else {
    savePictures($_SESSION, $_POST, $connection, "drop");
  }
}
else{
  print_r($_POST);
}


function savePictures($session, $files, $connection, $flag){

  if($flag === "upload"){
    $size = sizeof($files['images']['tmp_name']);
  }
  else if($flag === "drop"){
    $size = sizeof($files);
  }

  for($i=0; $i<$size; $i++){
    if($flag === "upload"){
      $image = file_get_contents($files['images']['tmp_name'][$i]);
      $image = base64_encode($image);
      $query = 'INSERT INTO storage'.$session["id"].' VALUES(null, "'.$session["user"].'", "'.$files['images']['name'][$i].'", "'.$image.'", "'.$files['images']['size'][$i].'")';
    }
    else if($flag === "drop"){
      $files[$i] = json_decode($files[$i]);
      $query = 'INSERT INTO storage'.$session["id"].' VALUES(null, "'.$session["user"].'", "'.$files[$i]->name.'", "'.$files[$i]->path.'", "'.$files[$i]->size.'")';
    }
    
    $response = mysqli_query($connection, $query);
  }

  echo 'readyToLoad';
} // ----- savePictures function ---------------------------


function getStoredPictures($session, $connection){
  $query = 'SELECT * FROM storage'.$session["id"];

  $response = mysqli_query($connection, $query);
  $fetchedData = mysqli_fetch_all($response, MYSQLI_ASSOC);

  echo "json-".json_encode($fetchedData);

  return count($fetchedData);
} // ----- getStoredPictures function ---------------------------


function editImage($imgID, $newName, $id, $connection){
  $query = 'UPDATE storage'.$id.' SET img_name="'.$newName.'" WHERE id='.$imgID;
  $response = mysqli_query($connection, $query);

  if($response){
    echo "edit-name-success";
  }
} // ----- editImage function ---------------------------

function deleteImage($id, $connection){
  $query = 'DELETE FROM storage'.$_SESSION["id"].' WHERE id='.$id;
  $response = mysqli_query($connection, $query);

  if($response){
    $_SESSION["counter"]--;
    echo "delete-image-".$id;
  }
} // ----- deleteImage function ---------------------------


function deleteUser($session, $connection){
  if($session["user"] != "guest@test.pl"){
    $query = 'DROP TABLE storage'.$session["id"];
    $response = mysqli_query($connection, $query);
  
    if($response){
      $query = 'DELETE FROM users WHERE id='.$session["id"];
      $response = mysqli_query($connection, $query);
  
      if($response){
        session_destroy();
        echo 'logout-user-success';
      }
    }
  }
} // ----- deleteUser function ---------------------------


function checkSession(){
  if(!isset($_SESSION["start-time"]) || (time() - $_SESSION["start-time"]) > 600){
    session_destroy();
    die("logout-user-success");
  }
  else {
    $_SESSION["start-time"] = time();
  }
} // ----- checkSession function ---------------------------

mysqli_close($connection);

?>