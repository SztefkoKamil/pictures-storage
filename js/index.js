const loginForm = document.querySelector('#login-form');
const loginEmail = document.querySelector('#login-email');
const loginPassword = document.querySelector('#login-password');
const warningWindow = document.querySelector('#warning-window');
let position = -60;


function checkIfLogged(){
  const url = 'php/index.php?check=logged';
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
  const url = `php/index.php?email=${data.email}&password=${data.password}`;

  let loginValidation = checkLogin(data);

  if(loginValidation){
    sendRequest(url);
  }
} // ----- submitLogin function --------------

function checkLogin(data){
  const emailPattern = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
  const emailIsValid = emailPattern.test(data.email);
  const formErrors = [];

  const inputs = document.querySelectorAll('input');

  inputs.forEach((input) => {
    input.classList.remove('login-error');
  });

  let emailValid = false;
  if(!emailIsValid){
    inputs[0].classList.add('login-error');
    formErrors.push("Podaj poprawny email");

  } else {
    emailValid = true;
  }

  let passValid = false;
  if(data.password === '' || data.password.length < 5){
    inputs[1].classList.add('login-error');
    formErrors.push("Hasło musi mieć od 2 do 24 znaków");
  } else {
    passValid = true;
  }

  if(formErrors.length > 0){
    showWarning(formErrors);
  }

  if(emailValid && passValid){
    return true;
  }
} // ----- checkLogin function ---------------

function showWarning(data){
  let message = '';
  
  if(Array.isArray(data)){
    for(let i in data){
      message += data[i];
      
      if((data.length - i) >= 2){
        message += ', ';
      }
    }
    message += '!';
  }
  else {
    message = data;
  }

  warningWindow.innerText = message;
  requestAnimationFrame(slideDown);
  setTimeout(() => {
    requestAnimationFrame(slideUp);
  }, 2000);
} // ----- showWarning function -------------

function slideDown(){
  if(position < 0){
    position += 2;
    warningWindow.style.top = position + 'px';
  
    if(position <= -2){
      requestAnimationFrame(slideDown);
    }
  }
} // ----- slideDown function ---------------

function slideUp(){
  if(position > -60){
    position -= 2;
    warningWindow.style.top = position + 'px';
  
    if(position >= -58){
      requestAnimationFrame(slideUp);
    }
  }
} // ----- slideUp function ---------------

function sendRequest(url){

  fetch(url, {method: 'GET'}).then(response => {
    return response.text();
  }).then(response => {
    if(response === 'login-success'){
      window.location.replace(window.location.href + 'storage.html');
    }
    else if(response === 'login-error'){
      showWarning("Błędny email lub hasło!");
    }
    else {
      console.log(response);
    }
  });
} // ----- sendRequest function ------------------

export {checkIfLogged, listenToSubmit}