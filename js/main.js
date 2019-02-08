'use strict';

import {checkIfLogged, listenToSubmit} from './login.js';
import {loadAccount, actionListeners} from './storage.js';
import {actionListener, recaptcha} from './register.js';

if(/storage.html$/.test(document.location.href)){
  console.log('storage.js');
  window.onload = () => {
    loadAccount();
    actionListeners();
  }
}
else if(/register.html$/.test(document.location.href)){
  console.log('register.js');
  
  window.onload = () => {
    actionListener();
  }
}
else if(/pictures-storage\/$/.test(document.location.href)){
  console.log('login.js');
  checkIfLogged();
  
  window.onload = () => {
    listenToSubmit();
  }
}

// console.log(document.location.href);
