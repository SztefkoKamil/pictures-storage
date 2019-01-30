<?php


  if(isset($_GET["check"]) && $_GET["check"] === "logged"){
    if(isset($_SESSION["user"]) && isset($_SESSION["name"]) && isset($_SESSION["id"])){
      echo 'success';
      exit();
    }
  } 
  else if(isset($_GET["email"]) && isset($_GET["password"])) {
    require_once "db_connect.php";

    $connection = mysqli_connect($host, $db_user, $db_password, $db_name);

    $query = 'SELECT * FROM users WHERE email="'.$_GET["email"].'"';

    $response = mysqli_query($connection, $query);
    $result = mysqli_fetch_all($response, MYSQLI_ASSOC);
    mysqli_close($connection);
    
    if($_GET["email"] === $result[0]["email"] && $_GET["password"] === $result[0]["password"]){
      session_set_cookie_params(600);
      session_start();
      $_SESSION['user'] = $result[0]["email"];
      $_SESSION['name'] = $result[0]["name"];
      $_SESSION['id'] = $result[0]["id"];
      echo 'success';
    } else {
      echo 'error';
    }
    
  }


?>