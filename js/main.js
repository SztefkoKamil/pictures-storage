'use strict';

import {checkIfLogged, listenToSubmit} from './index.js';
import {loadAccount, actionListeners} from './storage.js';
import {actionListener} from './register.js';


if(/storage.html$/.test(document.location.href)){
  window.onload = () => {
    loadAccount();
    actionListeners();
  }
}
else if(/register.html$/.test(document.location.href)){
  window.onload = () => {
    actionListener();
  }
}
else if(/pictures-storage\/$/.test(document.location.href)){
  checkIfLogged();
  window.onload = () => {
    listenToSubmit();
  }
}