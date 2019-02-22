'use strict';

import {checkIfLogged, listenToSubmit} from './login.js';
import {loadAccount, actionListeners} from './storage.js';
import {actionListener} from './register.js';

let  isTouchDevice = function() {  
  try {  
    document.createEvent("TouchEvent");  
    return true;  
  } catch (e) {  
    return false;  
  }  
}
// console.log(isTouchDevice());
// let  isMouseDevice = function() {  
//   try {  
//     document.createEvent("MouseEvent");  
//     return true;  
//   } catch (e) {  
//     return false;  
//   }  
// }
// console.log(isMouseDevice());

if(/storage.html$/.test(document.location.href)){
  // console.log('storage.js');
  window.onload = () => {
    loadAccount();
    actionListeners(isTouchDevice());
  }
}
else if(/register.html$/.test(document.location.href)){
  // console.log('register.js');
  
  window.onload = () => {
    actionListener();
  }
}
else if(/pictures-storage\/$/.test(document.location.href)){
  // console.log('login.js');
  checkIfLogged();
  
  window.onload = () => {
    listenToSubmit();
  }
}

// console.log(document.location.href);
