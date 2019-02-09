
const registerForm = document.querySelector('#register-form');
const nameIn = document.querySelector('#name');
const emailIn = document.querySelector('#email');
const passIn = document.querySelector('#password');
const pass2In = document.querySelector('#pass-repeat');
const rulesCheck = document.querySelector('#rules');
const registerBtn = document.querySelector('#register-button');


function actionListener(){
  registerForm.onsubmit = (e) => {
    e.preventDefault();
    // console.log('register');

    if(registerBtn.getAttribute('disabled') == null){
      const data = getData();
      const checked = checkData(data);
  
      if(checked){
        doRequest(data);
      }
      else {
        console.log('form data error');
      }
    }
  }


  grecaptcha.render('register-captcha',{
    'sitekey': '6Lcr8o8UAAAAALuj6bO4j1pqIRVYmURl3wBJpjT1',
    'callback': recaptcha,
    'expired-callback': expired
  });

} // ----- actionListener function --------------

const expired = function(){
  registerBtn.setAttribute('disabled', 'disabled');
}

const recaptcha = function(token){
  // console.log(token);

  const formData = new FormData();
  formData.append('g-recaptcha-response', token);

  const data = {
    method: "POST",
    body: formData
  };

  fetch('../php/register.php', data).then(response => {
    return response.text();
  }).then(response => {
    // console.log(response);

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
}

function checkData(data){
  const emailPattern = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
  let ok = true;

  if(!emailPattern.test(data.email)){
    ok = false;
    console.log('wrong email');
  }

  if(data.name.length < 2){
    ok = false;
    console.log('name to short - min 2 characters');
  }

  if(data.pass.length < 6 || data.pass.length > 24){
    ok = false;
    console.log('password must have min 6 max 24 characters');
  }

  if(data.pass != data.pass2){
    ok = false;
    console.log('repeat password');
  }

  if(!data.rules){
    ok = false;
    console.log('accept terms');
  }

  if(ok){
    return true;
  }
  else {
    return false;
  }

} // -----checkData function --------------

function doRequest(data){
  // console.log(data);

  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("password", data.pass);

  fetch('../php/register.php', {
    method: "POST",
    body: formData
  }).then(response => {
    return response.text();
  }).then(response => {
    console.log(response);
    if(response === 'redirect'){
      let href = window.location.href.slice(0,-13);
      href += 'storage.html';
      window.location.replace(href);
    }
  });;
}


export {actionListener};