'use strict';

import {checkIfLogged, listenToSubmit} from './login.js';

console.log(document.location);

checkIfLogged();

window.onload = () => {

  listenToSubmit();


}