const registerForm = document.querySelector('#register-form');
const nameIn = document.querySelector('#name');
const emailIn = document.querySelector('#email');
const passIn = document.querySelector('#password');
const pass2In = document.querySelector('#pass-repeat');
const rulesCheck = document.querySelector('#rules');
const registerBtn = document.querySelector('#register-button');
const rulesBtn = document.querySelector('#rules-button');
const rulesLabel = document.querySelector('#rules-label');
const registerModal = document.querySelector('#register-modal');
const registerModalBtn = document.querySelector('#register-modal-button');
const warningWindow = document.querySelector('#warning-window');
let formErrors = [];
let position = -60;


function actionListener(){
  registerForm.onsubmit = (e) => {
    e.preventDefault();

    if(registerBtn.getAttribute('disabled') == null){
      const data = getData();
      const checked = checkData(data);
  
      if(checked === true){
        doRequest(data);
      }
      else {
        showWarning(checked);
      }
    }
  }

  rulesBtn.onclick = (e) => {
    if(registerBtn.getAttribute('disabled') === "disabled"){
      e.preventDefault();
    }
    registerModal.style.display="flex";
  }

  registerModalBtn.onclick = () => {
    registerModal.style.display="none";
  }


  grecaptcha.render('register-captcha',{
    'sitekey': 'SITE_KEY',
    'callback': recaptcha,
    'expired-callback': expired
  });

} // ----- actionListener function --------------


const expired = function(){
  registerBtn.setAttribute('disabled', 'disabled');
}  // ----- expired recaptcha function -------------

const recaptcha = function(token){
  const formData = new FormData();
  formData.append('g-recaptcha-response', token);

  const data = {
    method: "POST",
    body: formData
  };

  fetch('php/register.php', data).then(response => {
    return response.text();
  }).then(response => {

    if(response === '1'){
      registerBtn.removeAttribute('disabled');
    }
    else { console.log('captcha verify error'); }
  });

} // ----- recaptcha function -------------


function getData(){
  const data = {};
  data.name = nameIn.value;
  data.email = emailIn.value;
  data.pass = passIn.value;
  data.pass2 = pass2In.value;
  data.rules = rulesCheck.checked;

  return data;
} // ----- getData function -------------

function checkData(data){
  nameIn.classList.remove("error-input");
  emailIn.classList.remove("error-input");
  passIn.classList.remove("error-input");
  pass2In.classList.remove("error-input");
  rulesLabel.style.color = "#000";
  const emailPattern = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
  let ok = true;


  if(!emailPattern.test(data.email)){
    ok = false;
    emailIn.classList.add("error-input");
    formErrors.push("Podaj poprawny email");
  }

  if(data.name.length < 2){
    ok = false;
    nameIn.classList.add("error-input");
    formErrors.push("Imię musi mieć co najmniej 2 znaki");
  }

  if(data.pass.length < 6 || data.pass.length > 24){
    ok = false;
    passIn.classList.add("error-input");
    formErrors.push("Hasło musi mieć od 2 do 24 znaków");
  }

  if(data.pass != data.pass2 || data.pass2.length < 6){
    ok = false;
    pass2In.classList.add("error-input");
    formErrors.push("Powtórz hasło");
  }

  if(!data.rules){
    ok = false;
    rulesLabel.style.color = "red";
    formErrors.push("Zaakceptuj regulamin");
  }

  if(ok){
    return true;
  }
  else {
    return formErrors;
  }

} // -----checkData function --------------


function doRequest(data){
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.pass);

  fetch('php/register.php', {
    method: "POST",
    body: formData
  }).then(response => {
    return response.text();
  }).then(response => {
    
    if(response === 'redirect'){
      let href = window.location.href.slice(0,-13);
      href += 'storage.html';
      window.location.replace(href);
    }
    else if(response === 'user-exist'){
      showWarning("Użytkownik o takim adresie email już istnieje!");
    }
    else if(response === 'too-many-users'){
      showWarning("Osiągnięto limit 10 użytkowników!");
    }
    else{
      // console.log(response);
    }
  });

} // ----- doRequest function -------------


function showWarning(data){
  formErrors = [];
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

} // ----- showWarning function --------------

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


export {actionListener};