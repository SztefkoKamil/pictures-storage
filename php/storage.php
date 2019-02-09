<?php

session_start();

checkSession();

require_once "db_connect.php";
$connection = mysqli_connect($host, $db_user, $db_password, $db_name);


if(isset($_GET['action']) && $_GET['action']==='load-account'){
  echo 'loaded'.$_SESSION["name"];
}
else if(isset($_GET['action']) && $_GET['action']==='load-pictures'){
  getStoredPictures($_SESSION, $connection);
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
  echo 'delete-user-success';
}
else if(isset($_FILES['images'])){
  // echo 'readyToLoad';
  savePictures($_SESSION, $_FILES, $connection);
}
else{
  print_r('nothing');
}



function savePictures($session, $files, $connection){
  
  $size = sizeof($files['images']['tmp_name']);

  for($i=0; $i<$size; $i++){
    $image = file_get_contents($files['images']['tmp_name'][$i]);
    $image = base64_encode($image);

    $query = 'INSERT INTO storage'.$session["id"].' VALUES(null, "'.$session["user"].'", "'.$files['images']['name'][$i].'", "'.$image.'", "'.$files['images']['size'][$i].'")';
    
    $response = mysqli_query($connection, $query);
  }
  
  echo 'readyToLoad';
}


function getStoredPictures($session, $connection){
  $query = 'SELECT * FROM storage'.$session["id"];

  $response = mysqli_query($connection, $query);
  $fetchedData = mysqli_fetch_all($response, MYSQLI_ASSOC);

  echo json_encode($fetchedData);
  // echo "ssss";
}

function editImage($imgID, $newName, $id, $connection){
  $query = 'UPDATE storage'.$id.' SET img_name="'.$newName.'" WHERE id='.$imgID;
  $response = mysqli_query($connection, $query);
  if($response){
    echo "edit-name-success";
  }
}


function deleteImage($id, $connection){
  $query = 'DELETE FROM storage'.$_SESSION["id"].' WHERE id='.$id;
  $response = mysqli_query($connection, $query);
  if($response){
    echo "delete-image-".$id;
  }
}


function checkSession(){
  if(!isset($_SESSION["start-time"]) || (time() - $_SESSION["start-time"]) > 600){
    session_destroy();
    die("logout-user-success");
  }
  else {
    $_SESSION["start-time"] = time();
  }
}

mysqli_close($connection);

?>