<?php
  session_start();


  if(isset($_GET["check"]) && $_GET["check"] === "logged"){
    if(isset($_SESSION["start-time"]) && $_SESSION["start-time"] < time() && (time() - $_SESSION["start-time"]) < 600){
      echo "success";
    }
  } 
  else if(isset($_GET["email"]) && isset($_GET["password"])) {

    $data = checkData($_GET);
    $query = 'SELECT * FROM users WHERE email="'.$data["email"].'"';
    
    require_once "db_connect.php";
    $connection = mysqli_connect($host, $db_user, $db_password, $db_name);
    $response = mysqli_query($connection, $query);
    $result = mysqli_fetch_all($response, MYSQLI_ASSOC);
    mysqli_close($connection);
    
    if($_GET["email"] === $result[0]["email"] && $_GET["password"] === $result[0]["password"]){
      $_SESSION['id'] = $result[0]["id"];
      $_SESSION['user'] = $result[0]["email"];
      $_SESSION['name'] = $result[0]["name"];
      $_SESSION['start-time'] = time();
      echo 'success';
    } else {
      echo 'error';
    }
    
  } // ----- main if --------------------------------


  function checkData($get){

    $data = array(
      'email' => filter_var($get["email"], FILTER_SANITIZE_STRING),
      'password' => filter_var($get["password"], FILTER_SANITIZE_STRING)
    );

    $pattern = '/^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/';
    $ok = true;

    if(!preg_match($pattern, $data["email"])){
      $ok = false;
    }
  
    if(strlen($data["password"]) < 6 || strlen($data["password"]) > 24){
      $ok = false;
    }

    if($ok){
      return $data;
    }
  } // ----- checkData function -----------------


?>