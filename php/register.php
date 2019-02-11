<?php

if(isset($_POST["g-recaptcha-response"])){
  $url = 'https://www.google.com/recaptcha/api/siteverify';
  $secret = '6Lcr8o8UAAAAAJdFFd-QyCbA3d1z8NIyoRWrCMuR';

  $response = file_get_contents($url.'?secret='.$secret.'&response='.$_POST["g-recaptcha-response"]);

  $data = json_decode($response);

  echo $data->success;

  // print_r($data);
}
else if(isset($_POST["email"])){
  require_once "db_connect.php";
  $connection = mysqli_connect($host, $db_user, $db_password, $db_name);
  // print_r($_POST);

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
}


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
}


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
}


function addToDB($data, $connection){
  $query = 'INSERT INTO users VALUES(null, "'.$data["name"].'", "'.$data["email"].'", "'.$data["password"].'")';
  $response = mysqli_query($connection, $query);

  if($response){
    return $data["email"];
  }

}


function checkID($email, $connection){
  $query = 'SELECT * FROM users WHERE email="'.$email.'"';
  $response = mysqli_query($connection, $query);
  $fetchedData = mysqli_fetch_assoc($response);
  // print_r($fetchedData);
  // createSession($fetchedData);
  return $fetchedData;
}


function createTable($data, $connection){
  $query = 'CREATE TABLE storage'.$data.'(id int NOT NULL AUTO_INCREMENT PRIMARY KEY, owner text NOT NULL, img_name text NOT NULL, img longblob NOT NULL, img_size text NOT NULL)';
  $response = mysqli_query($connection, $query);

  // createSession($data);
  if($response){
    return "success";
  }
}


function  createSession($data){
  // session_set_cookie_params(600);
  session_start();
  $_SESSION["id"] = $data["id"];
  $_SESSION["email"] = $data["email"];
  $_SESSION["name"] = $data["name"];
  $_SESSION["start-time"] = time();
  echo "redirect";
}


?>