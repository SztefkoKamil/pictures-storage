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

async function submitLogin(){
  const data = {
    email: loginEmail.value,
    password: loginPassword.value
  };

  let loginValidation = checkLogin(data);
  let loginConfirm = false;

  if(loginValidation){
    loginConfirm = await sendLoginRequest(data);
  }

  if(loginConfirm === 'success'){
    console.log('login success, redirect');
    // window.location.replace(window.location.href + 'html/storage.html');
  }
  else if(loginConfirm.message === 'error'){
    console.log(loginConfirm.error);
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

function sendLoginRequest(data){

  return new Promise((resolve, reject) => {
    const newXHR = new XMLHttpRequest();

    newXHR.onreadystatechange = function(){
      if (this.readyState === 4 && this.status === 200) {
  
          if(this.response === 'success'){
            console.log('login success');
            resolve('success');
          } else {
            console.log('login error');
            reject({message: 'error', error: this.response});
          }
      }
    }

    const url = `php/login.php?email=${data.email}&password=${data.password}`;
    newXHR.open("GET", url, true);
    newXHR.send();

  });

} // ----- sendLoginRequest function -------------