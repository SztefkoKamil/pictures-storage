const actionBar = document.querySelector('#action-bar');
const welcomeMsg = document.querySelector('#welcome-message');
const logoutBtn = document.querySelector('#logout-button');
const deleteUserBtn = document.querySelector('#delete-user-button');
const uploadForm = document.querySelector('#upload-form');
const uploadInput = document.querySelector('#upload-input');
const fileInputBtn = document.querySelector('#file-input-button');
const filesCounter = document.querySelector('#files-counter');
const uploadBtn = document.querySelector('#upload-button');
const dropField = document.querySelector('#drop-field');
const miniBtn = document.querySelector('#mini-button');
const warningWindow = document.querySelector('#warning-window');
const storageContainer = document.querySelector('#storage-container');
let newName = false;
let position = -60;
let gallery = [];


function actionListeners(){

  logoutBtn.onclick = () => {
    console.log('logout');
    const data = {
      url: 'php/storage.php?action=logout-user',
      method: 'GET',
      body: 'none'
    }

    doRequest(data);
  };  // ----- logout button listener -------------

  deleteUserBtn.onclick = () => {
    let confirmDelete = confirm('Czy napewno chcesz usunąć konto?');

    if(confirmDelete){
      const data = {
        url: 'php/storage.php?action=delete-user',
        method: 'GET',
        body: 'none'
      }
  
      doRequest(data);
    }
  };  // ----- delete user button listener -------------


  uploadInput.onchange = (e) => {
    showFilesCounter(uploadInput.files.length);
    uploadBtn.classList.remove('disabled');
  } // ----- upload input listener ----------------

  uploadForm.onsubmit = (e) => {
    e.preventDefault();
    if(uploadInput.files.length > 0){
      const filteredData = Array.from(uploadInput.files).filter((a) => {return a.type==="image/jpeg" || a.type==="image/png"});
      saveUploaded(filteredData);
      uploadForm.reset();
    };
  };  // ----- upload files listener -------------

  dropField.addEventListener('dragover', (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  });
  dropField.addEventListener('drop', (e) => {
    e.stopPropagation();
    e.preventDefault();
    saveDropped(e);
  }); // ----- drop files listeners --------------------------


  let open = false;
  miniBtn.onclick = () => {
    
    if(!open){
      actionBar.classList.add('menu-down');
      miniBtn.firstElementChild.classList.add('menu-open');
      actionBar.classList.remove('menu-up');
      miniBtn.firstElementChild.classList.remove('menu-close');
      open = !open;
    }
    else{
      actionBar.classList.add('menu-up');
      miniBtn.firstElementChild.classList.add('menu-close');
      actionBar.classList.remove('menu-down');
      miniBtn.firstElementChild.classList.remove('menu-open');
      open = !open;
    }
  };  // ----- mini menu button listener -----------------------

  uploadInput.onmouseenter = () => {
    fileInputBtn.classList.add('hover');
  }
  uploadInput.onmouseleave = () => {
    fileInputBtn.classList.remove('hover');
  }

} // ----- actionListeners function ---------------------



function doRequest(data, thiss){
  
  if(data.body === "none"){
    fetch(data.url, {method: data.method}).then(response => {
      return response.text();
    }).then((resp) => { 

      if(/^loaded/.test(resp) && resp.length > 7){
        const user = resp.slice(6);
        loadPictures();
        welcomeMsg.innerHTML = `Witaj ${user}!`;
      }
      else if(resp === 'logout-user-success'){
        logoutUser();
      }
      else if(/^delete-image-/.test(resp)){
        // console.log(resp);
        deleteImage(thiss);
      }
      else if(/^json-/.test(resp)){
        const response = resp.slice(5);

        if(JSON.parse(response)){
          showPictures(JSON.parse(response));
        }
        else {
          // console.log(response);
        }
      }
      else{
        // console.log(resp);
      }

    });
  } else {
    fetch(data.url, {method: data.method, body: data.body}).then(response => {
      return response.text();
    }).then((resp) => {
      
      if(resp === 'readyToLoad'){
        loadPictures();
      }
      else if(resp === 'edit-name-success'){
        editImgName('', '');
      }
      else if(resp === 'logout-user-success'){
        logoutUser();
      }
      else if(resp === 'too-many-images'){
        showWarning("Limit obrazków - 12!<br>Przepraszamy.");
      }
      else {
        // console.log(resp);
      }
    });

  }

} // ----- doRequest function -------------------

let isTouchDevice = function() {  
  try {  
    document.createEvent("TouchEvent");  
    return true;  
  } catch (e) {  
    return false;  
  }  
} // ----- isTouchDevice function -------------


function loadAccount(){
  const data = {
    url: 'php/storage.php?action=load-account',
    method: 'GET',
    body: 'none'
  };

  doRequest(data);

} // ----- loadAccount function --------------------

function loadPictures(){
  const data = {
    url: 'php/storage.php?action=load-pictures',
    method: 'GET',
    body: 'none'
  };

  doRequest(data);

} /// ----- loadPictures function -----------------

function logoutUser(){
  const expireDate = new Date();
  const location = window.location;
  document.cookie = 'PHPSESSID=logout;domain='+location.hostname+';path=/;expires='+expireDate.toUTCString();
  location.replace(location.href.slice(0,-12));
} // ----- logoutUser function -------------


function saveDropped(e){
  let files = Array.from(e.dataTransfer.files);
  let x = 0;
  let formData = new FormData();
  
  for (let i=0; i<files.length; i++) {
    if (files[i].size < 5242880){
      let reader = new FileReader();
      let element = {
        name: files[i].name,
        size: files[i].size,
        type: files[i].type
      };
      
      reader.onload = function(event) {
        if(element.type == 'image/jpeg'){
          element.path = event.target.result.slice(23);
        }
        else if(element.type == 'image/png'){
          element.path = event.target.result.slice(22);
        }
        
        formData.append(x, JSON.stringify(element));
        x++;
      }
      
      reader.readAsDataURL(files[i]);
    }
  }
  
  setTimeout(() => {
    showFilesCounter(x);
    uploadBtn.classList.remove('disabled');

    const data = {
      url: 'php/storage.php',
      method: 'POST',
      body: formData
    };

    uploadBtn.addEventListener('click', () => {
      doRequest(data);
      filesCounter.innerText = 'Nie wybrano obrazka';
      uploadBtn.classList.add('disabled');
    }, {once: true});
  }, 100);

} // -----saveDropped function --------------------

function saveUploaded(files){
  if(files.length > 0){
    filesCounter.innerText = 'Nie wybrano obrazka';
    const formData = new FormData();
    let x = 0;

    for(let i=0; i<files.length; i++){
      if(files[i].size < 5242880){
        formData.append('images[]', files[i]);
        x++;
      }
    }

    if(x){

      const data = {
        url: 'php/storage.php',
        method: 'POST',
        body: formData
      };
  
      doRequest(data);
      uploadBtn.classList.add('disabled');
    }

  }
  else {
    console.log('no pictures chosen');
  }
  
} // ----- savePictures function -----------------


function editImgName(id, extension){
  if(!newName){
    const element = document.querySelector(`[data-id="${id}"] .img-name`);
    newName = {};
    newName.id = id;
    newName.extension = extension;
    newName.name = prompt('Wpisz nową nazwę', element.innerText);

    if(!newName.name){
      newName.name = element.innerText;
    }

    const formData = new FormData();
    formData.append('id', id);
    formData.append('new-name', newName.name + extension);
    const data = {
      url: `php/storage.php`,
      method: 'POST',
      body: formData
    };

    doRequest(data);
  }
  else {
    const element = document.querySelector(`[data-id="${newName.id}"] .img-name`);
    element.innerText = newName.name;
    newName = false;
  }
} // ----- editImgName function -------------------

function deleteImage(thiss){
  const imgcontainer = thiss.parentNode.parentNode;
  let x = storageContainer.removeChild(imgcontainer);
}; // ----- deleteImage function -------------


function showWarning(data){
  warningWindow.innerHTML = data;
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


function showFilesCounter(files){
  if(files > 0){
    let message = 'Wybrano ';
    if(files == 1){
      message += '1 zdjęcie.';
    }
    else if(files > 1 && files < 5 ){
      message += files + ' zdjęcia.';
    }
    else if(files > 4){
      message += files + ' zdjęć.';
    }
    filesCounter.innerText = message;
  }
  else {
    filesCounter.innerText = 'Nie wybrano zdjęć.';
  }
}

function showPictures(data){
  storageContainer.innerHTML = "";

  for(let i=0; i<data.length; i++){
    const newContainer = document.createElement('div');
    newContainer.classList.add('img-container');
    newContainer.setAttribute("data-id", data[i]["id"]);

    const newImg = document.createElement('img');
    newImg.classList.add('image');
    newImg.setAttribute("src", "data:image;base64,"+data[i]["img"]);

    gallery.push(data[i]["img"]);

    const newLayout = document.createElement('div');
    newLayout.classList.add("layout");

    const options = [];

    const newDloadBtn = document.createElement('a');
    newDloadBtn.classList.add("download-img-button");
    newDloadBtn.setAttribute("href", "data:image;base64,"+data[i]["img"]);
    newDloadBtn.setAttribute("download", data[i]["img_name"]);
    newDloadBtn.setAttribute("title", "Pobierz obrazek");
    options.push(newDloadBtn);

    const newDloadIcon = document.createElement('i');
    newDloadIcon.classList.add('fa-download');
    newDloadIcon.classList.add('fas');

    newDloadBtn.appendChild(newDloadIcon);

    const newDeleteBtn = document.createElement('button');
    newDeleteBtn.classList.add("delete-img-button");
    newDeleteBtn.id = "delete-img-button";
    newDeleteBtn.setAttribute("title", "Usuń obrazek");
    options.push(newDeleteBtn);

    const newDeleteIcon = document.createElement('i');
    newDeleteIcon.classList.add('fa-trash-alt');
    newDeleteIcon.classList.add('fas');

    newDeleteBtn.appendChild(newDeleteIcon);

    let name = '';
    let extension = '';
    if(/(.jpg|.png)$/.test(data[i]["img_name"])){
      name = data[i]["img_name"].slice(0, -4);
      if(/.jpg$/.test(data[i]["img_name"])){
        extension = '.jpg';
      }
      else if(/.png$/.test(data[i]["img_name"])){
        extension = '.png';
      }
    }
    else if(/.jpeg$/.test(data[i]["img_name"])){
      name = data[i]["img_name"].slice(0, -5);
      extension = '.jpeg';
    }
    const newImgName = document.createElement('h5');
    newImgName.classList.add("img-name");
    newImgName.id = "img-name";
    newImgName.setAttribute("title", name);
    newImgName.innerText = name;
    options.push(newImgName);
    
    const newEditBtn = document.createElement('button');
    newEditBtn.classList.add("edit-img-button");
    newEditBtn.id = "edit-img-button";
    newEditBtn.setAttribute("data-ext", extension);
    newEditBtn.setAttribute("title", "Zmień nazwę obrazka");
    options.push(newEditBtn);

    const newEditIcon = document.createElement('i');
    newEditIcon.classList.add('fa-edit');
    newEditIcon.classList.add('fas');

    newEditBtn.appendChild(newEditIcon);

    for(let i of options){
      newLayout.appendChild(i);
    }

    newContainer.appendChild(newImg);
    newContainer.appendChild(newLayout);

    storageContainer.appendChild(newContainer);
  
  } // ----- for loop -----------------

  optionsListeners();

} // ----- showPictures function -------------------


function optionsListeners(){
  const imgDeleteBtns = document.querySelectorAll('.delete-img-button');
  const imgEditBtns = document.querySelectorAll('.edit-img-button');
  const layouts = document.querySelectorAll('.layout');

  
  imgDeleteBtns.forEach((btn) => {
    const id = btn.parentNode.parentNode.getAttribute("data-id");
    btn.addEventListener('click', function(){

      if(confirm("Usunąć zdjęcie?")){
        const data = {
          url: 'php/storage.php?action=delete-image&imageID=' + id,
          method: 'GET',
          body: 'none'
        }; 
  
        doRequest(data, this);
      }
    });
  });

  imgEditBtns.forEach((btn) => {
    const id = btn.parentNode.parentNode.getAttribute("data-id");
    const extension = btn.getAttribute("data-ext");
    btn.addEventListener('click', function(){
      editImgName(id, extension);
    });
  });


  let isTouch = isTouchDevice();

  layouts.forEach((layout) => {

    layout.onclick = (e) => {
      if(e.target.classList.value == 'layout hover' || e.target.classList.value == 'layout'){
        showGallery(e.target);
      }
    };

    if(isTouch){
      layout.classList.add('hover');
    }
    
  });


} // ----- optionsListeners function ----------------


function showGallery(target){
  const storageModal = document.querySelector('#storage-modal');
  const storageModalImg = document.querySelector('#storage-modal-img');
  const modalLeftBtn = document.querySelector('#modal-left-button');
  const modalRightBtn = document.querySelector('#modal-right-button');
  const modalCloseBtn = document.querySelector('#modal-close-button');
  const src = target.parentNode.firstElementChild.getAttribute("src");
  let currentIndex = null;
  const length = gallery.length;

  for(let i in gallery){
    if(src === "data:image;base64," + gallery[i]){
      currentIndex = i;
    }
  }

  storageModalImg.setAttribute("src", "data:image;base64," + gallery[currentIndex]);
  storageModal.style.display = "flex";
  storageContainer.style.display = "none";

  let move = {};

  if(isTouchDevice()){
    storageModalImg.ontouchstart = (e) => {
      move.sx = e.targetTouches[0].clientX;
    }
    storageModalImg.ontouchend = (e) => {
      move.ex = e.changedTouches[0].clientX;

      if(move.sx > move.ex+100){
        galleryRight();
      }
      else if(move.sx < move.ex-100){
        galleryLeft();
      }
    }

  }

  modalLeftBtn.onclick = () => {
    galleryLeft();
  };
  modalRightBtn.onclick = () => {
    galleryRight();
  };
  modalCloseBtn.onclick = () => {
    modalClose();
  };

  window,onkeydown = (e) => {
    if(e.key === 'ArrowLeft'){
      galleryLeft();
    }
    else if(e.key === 'ArrowRight'){
      galleryRight();
    }
    else if(e.key === 'Escape'){
      modalClose();
    }
  }

  function galleryLeft(){
    currentIndex--;
    if(currentIndex === -1){
      currentIndex = length-1;
    }
    storageModalImg.setAttribute("src", "data:image;base64," + gallery[currentIndex]);
  }

  function galleryRight(){
    currentIndex++;
    if(currentIndex === length){
      currentIndex = 0;
    }
    storageModalImg.setAttribute("src", "data:image;base64," + gallery[currentIndex]);
  }

  function modalClose(){
    storageContainer.style.display = "flex";
    storageModal.style.display="none";
  }

};  // ----- showGallery function ----------------


export {loadAccount, actionListeners};

