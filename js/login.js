const loginForm = document.querySelector('#login-form');
const loginEmail = document.querySelector('#login-email');
const loginPassword = document.querySelector('#login-password');


function checkIfLogged(){
  const url = 'php/login.php?check=logged';
  sendRequest(url);
} // ----- checkIfLogged function -------------

function listenToSubmit(){
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    submitLogin();
  });
} // ----- listenToSubmit -----------------

function submitLogin(){
  const data = {
    email: loginEmail.value,
    password: loginPassword.value
  }
  const url = `php/login.php?email=${data.email}&password=${data.password}`;

  let loginValidation = checkLogin(data);

  if(loginValidation){
    sendRequest(url);
  }
} // ----- submitLogin function --------------

function checkLogin(data){
  const emailPattern = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
  const emailIsValid = emailPattern.test(data.email);

  const inputs = document.querySelectorAll('input');

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
  if(data.password === '' || data.password.length < 5){
    inputs[1].classList.add('login-error');
  } else {
    passValid = true;
  }

  if(emailValid && passValid){
    return true;
  }
} // ----- checkLogin function ---------------

function sendRequest(url){
  const newXHR = new XMLHttpRequest();

  newXHR.onreadystatechange = function(){
    if (this.readyState === 4 && this.status === 200) {

        if(this.response === 'success'){
          window.location.replace(window.location.href + 'html/storage.html');
        } else {
          console.log('login error');
          console.log(this.response);
        }
    }
  };

  newXHR.open("GET", url, true);
  newXHR.send();
} // ----- sendRequest function ------------------

export {checkIfLogged, listenToSubmit}