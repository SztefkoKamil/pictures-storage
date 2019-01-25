<?php

  require_once "db_connect.php";

  $connection = mysqli_connect($host, $db_user, $db_password, $db_name);

  $query = 'SELECT * FROM users WHERE email="'.$_GET["email"].'"';

  $response = mysqli_query($connection, $query);
  $result = mysqli_fetch_all($response, MYSQLI_ASSOC);

  if($_GET["email"] === $result[0]["email"] && $_GET["password"] === $result[0]["password"]){
    echo 'success';
  } else {
    echo 'error';
  }
  










?>