const loginForm = document.querySelector('#login-form');
const loginEmail = document.querySelector('#login-email');
const loginPassword = document.querySelector('#login-password');
const loginBtn = document.querySelector('#login-button');

export default function(){

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitLogin();
  });

}

function submitLogin(){
  const data = {};

  data.email = loginEmail.value;
  data.password = loginPassword.value;
  console.log(data);

  let loginValidation = checkLogin(data.email, data.password);

  if(loginValidation){
    sendLoginRequest(data);
  }

  // window.location.replace(window.location.href + 'html/storage.html');


} // ----- submitLogin function --------------

function checkLogin(email, password){
  const emailPattern = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
  const emailIsValid = emailPattern.test(email);

  const inputs = document.querySelectorAll('input');
  console.log(inputs[0]);

  inputs.forEach((input) => {
    input.classList.remove('login-error');
  });


  let emailValid = false;
  if(!emailIsValid){
    inputs[0].classList.add('login-error');

  } else {
    emailValid = true;
  }

  let passValid = false;
  if(password === '' || password.length < 5){
    inputs[1].classList.add('login-error');
  } else {
    passValid = true;
  }

  if(emailValid && passValid){
    return true;
  }

}

function sendLoginRequest(data){
  const newXHR = new XMLHttpRequest();
  newXHR.onreadystatechange = function(){
    if (this.readyState == 4 && this.status == 200) {
        console.log(response);
    }
  }

  newXHR.open("POST", 'php/login.php', true);
  newXHR.send(data);
}