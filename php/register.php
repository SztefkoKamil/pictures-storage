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
  print_r($_POST);
  // add to db, check id, create table,
}
else {
  echo 'no POST data';
}

?>