<?php

if(isset($_POST["g-recaptcha-response"])){
  $url = 'https://www.google.com/recaptcha/api/siteverify';
  $secret = 'SECRET_KEY';

  $response = file_get_contents($url.'?secret='.$secret.'&response='.$_POST["g-recaptcha-response"]);
  $data = json_decode($response);

  echo $data->success;
}
else if(isset($_POST["email"])){
  require_once "db_connect.php";
  $connection = mysqli_connect($host, $db_user, $db_password, $db_name);

  $limit = checkUsersLimit($connection);

  if($limit){
    die("too-many-users");
  }

  $check = existEmail($_POST["email"], $connection);

  if($check){
    die("user-exist");
  }

  $data = array(
    'name' => filter_var($_POST["name"], FILTER_SANITIZE_STRING),
    'email' => filter_var($_POST["email"], FILTER_SANITIZE_STRING),
    'password' => filter_var($_POST["password"], FILTER_SANITIZE_STRING)
  );

  $check = checkData($data);

  if(!$check){
    die("wrong-data");
  }

  $email = addToDB($_POST, $connection);
  $data = false;

  if($email){
    $data = checkID($email, $connection);
  }

  if($data){
    $table = createTable($data["id"], $connection);
  }
  else {
    $register = false;
  }

  if($table === "success"){
    createSession($data);
  }

  mysqli_close($connection);
}
else {
  echo 'no POST data';
} // ----- main if ----------------------------------------


function checkUsersLimit($connection){
  $query = 'SELECT * FROM users';
  $response = mysqli_query($connection, $query);
  $fetchedData = mysqli_fetch_assoc($response);

  if(count($fetchedData) >= 10){
    return true;
  }
  else {
    return false;
  }
} // ----- checkUsersLimit function ---------------------------


function existEmail($email, $connection){
  $query = 'SELECT * FROM users WHERE email="'.$email.'"';
  $response = mysqli_query($connection, $query);
  $fetchedData = mysqli_fetch_assoc($response);
  if($fetchedData){
    return true;
  }
  else {
    return false;
  }
} // ----- existEmail function ---------------------------


function checkData($data){
  $pattern = '/^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/';
  $ok = true;

  if(!preg_match($pattern, $data["email"])){
    $ok = false;
  }

  if(strlen($data["name"]) < 2){
    $ok = false;
  }

  if(strlen($data["password"]) < 6 || strlen($data["password"]) > 24){
    $ok = false;
  }

  return $ok;
} // ----- checkData function ---------------------------


function addToDB($data, $connection){
  $query = 'INSERT INTO users VALUES(null, "'.$data["name"].'", "'.$data["email"].'", "'.$data["password"].'")';
  $response = mysqli_query($connection, $query);

  if($response){
    return $data["email"];
  }
} // ----- addToDB function ---------------------------


function checkID($email, $connection){
  $query = 'SELECT * FROM users WHERE email="'.$email.'"';
  $response = mysqli_query($connection, $query);
  $fetchedData = mysqli_fetch_assoc($response);

  return $fetchedData;
} // ----- checkID function ---------------------------


function createTable($data, $connection){
  $query = 'CREATE TABLE storage'.$data.'(id int NOT NULL AUTO_INCREMENT PRIMARY KEY, owner text NOT NULL, img_name text NOT NULL, img longblob NOT NULL, img_size text NOT NULL)';
  $response = mysqli_query($connection, $query);

  if($response){
    return "success";
  }
} // ----- createTable function ---------------------------


function  createSession($data){
  session_start();
  $_SESSION["id"] = $data["id"];
  $_SESSION["user"] = $data["email"];
  $_SESSION["name"] = $data["name"];
  $_SESSION["start-time"] = time();
  $_SESSION["counter"] = 0;
  echo "redirect";
} // ----- createSession function ---------------------------


?>