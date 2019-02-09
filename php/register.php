<?php
if(isset($_POST["g-recaptcha-response"])){
  $url = 'https://www.google.com/recaptcha/api/siteverify';
  $secret = '6Lcr8o8UAAAAAJdFFd-QyCbA3d1z8NIyoRWrCMuR';

  $response = file_get_contents($url.'?secret='.$secret.'&response='.$_POST["g-recaptcha-response"]);

  $data = json_decode($response);

  // echo '{"success": '.$data->success.', "action": "'.$data->action.'"}';
  echo $data->success;

  // print_r($data);
}
else if(isset($_POST["email"])){
  require_once "db_connect.php";
  $connection = mysqli_connect($host, $db_user, $db_password, $db_name);
  // print_r($_POST);
  // addToDB($_POST, $connection);
  checkID($_POST["email"], $connection);
  // check if email exist, add to db, check id, create table,

  mysqli_close($connection);
}
else {
  echo 'no POST data';
}


function addToDB($data, $connection){
  $query = 'INSERT INTO users VALUES(null, "'.$data["name"].'", "'.$data["email"].'", "'.$data["password"].'")';
  $response = mysqli_query($connection, $query);

  if($response){
    checkID($data["email"], $connection);
  }

}


function checkID($email, $connection){
  $query = 'SELECT * FROM users WHERE email="'.$email.'"';
  $response = mysqli_query($connection, $query);
  $fetchedData = mysqli_fetch_assoc($response);
  // print_r($fetchedData);
  // createTable($fetchedData, $connection);
  createSession($fetchedData);
}


function createTable($data, $connection){
  $query = 'CREATE TABLE storage'.$data["id"].'(id int NOT NULL AUTO_INCREMENT PRIMARY KEY, owner text NOT NULL, img_name text NOT NULL, img longblob NOT NULL, img_size text NOT NULL)';
  $response = mysqli_query($connection, $query);

  createSession($data);
}


function  createSession($data){
  session_start();
  $_SESSION["id"] = $data["id"];
  $_SESSION["email"] = $data["email"];
  $_SESSION["name"] = $data["name"];
  $_SESSION["start-time"] = time();
  echo "redirect";
}


?>