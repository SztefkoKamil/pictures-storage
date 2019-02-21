
const welcomeMsg = document.querySelector('#welcome-message');
const logoutBtn = document.querySelector('#logout-button');
const deleteUserBtn = document.querySelector('#delete-user-button');
const uploadForm = document.querySelector('#upload-form');
const uploadInput = document.querySelector('#upload-input');
const uploadBtn = document.querySelector('#upload-button');
const dropField = document.querySelector('#drop-field');
const dropFieldCounter = document.querySelector('#drop-field-counter');
const warningWindow = document.querySelector('#warning-window');
const storageContainer = document.querySelector('#storage-container');
let newName = false;
let position = -60;


function actionListeners(){
  logoutBtn.onclick = () => {
    console.log('logout');
    const data = {
      url: '../php/storage.php?action=logout-user',
      method: 'GET',
      body: 'none'
    }

    doRequest(data);
  };
  
  deleteUserBtn.onclick = () => {
    // console.log('delete user');
    let confirmDelete = confirm('Czy napewno chcesz usunąć konto?');

    if(confirmDelete){
      const data = {
        url: '../php/storage.php?action=delete-user',
        method: 'GET',
        body: 'none'
      }
  
      doRequest(data);
    }
  };

  uploadForm.onsubmit = (e) => {
    e.preventDefault();
    if(uploadInput.files.length > 0){
      const filteredData = Array.from(uploadInput.files).filter((a) => {return a.type==="image/jpeg" || a.type==="image/png"});
      // console.log(filteredData);
      saveUploaded(filteredData);
      uploadForm.reset();
    };
  };  // ----- upload files listener -------------


  dropField.addEventListener('dragover', (e) => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    // console.log('e');
    // console.log(e.dataTransfer);
    // console.log(e);
  });
  dropField.addEventListener('drop', (e) => {
    e.stopPropagation();
    e.preventDefault();
    saveDropped(e);
    
    // console.log(e.dataTransfer.files);
    // console.log(e);

  }); // ----- drop files listener --------------------------



} // ----- actionListeners function ---------------------


function optionsListeners(){
  // const imgDloadBtns = document.querySelectorAll('.download-img-button');
  const imgDeleteBtns = document.querySelectorAll('.delete-img-button');
  const imgEditBtns = document.querySelectorAll('.edit-img-button');

  
  imgDeleteBtns.forEach((btn) => {
    const id = btn.parentNode.parentNode.getAttribute("data-id");
    btn.addEventListener('click', function(){
      // console.log('delete image id: '+id);

      if(confirm("Usunąć zdjęcie?")){
        const data = {
          url: '../php/storage.php?action=delete-image&imageID=' + id,
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


} // ----- optionsListeners function ----------------


function doRequest(data, thiss){

  if(data.body === "none"){
    fetch(data.url, {method: data.method}).then(response => {
      return response.text();
    }).then((resp) => { 
      // console.log(resp);

      if(/^loaded/.test(resp) && resp.length > 10){
        const user = resp.slice(6);
        loadPictures();
        welcomeMsg.innerHTML = `Witaj ${user}!<br> Dodaj zdjęcie do swojej kolekcji.<br>Limit zdjęć - 12, maksymalny rozmiar 5MB.`;
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
          console.log(response);
        }
      }
      else{
        console.log(resp);
      }

     });
  } else {
    fetch(data.url, {method: data.method, body: data.body}).then(response => {
      return response.text();
    }).then((resp) => {
      // console.log(resp);
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
        // console.log('pictures limit 12');
        showWarning("Limit obrazków - 12!<br>Przepraszamy.");
      }
      else {
        console.log(resp);
      }
    });

  }

} // ----- doRequest function -------------------


function loadAccount(){
  const data = {
    url: '../php/storage.php?action=load-account',
    method: 'GET',
    body: 'none'
  };

  doRequest(data);

} // ----- loadAccount function --------------------


function logoutUser(){
  const expireDate = new Date();
  const location = window.location;
  document.cookie = 'PHPSESSID=logout;domain='+location.hostname+';path=/;expires='+expireDate.toUTCString();
  // console.log(document.cookie);
  location.replace(location.href.slice(0,-17));
}


function loadPictures(){
  const data = {
    url: '../php/storage.php?action=load-pictures',
    method: 'GET',
    body: 'none'
  };

  doRequest(data);

} /// ----- loadPictures function -----------------


function saveDropped(e){

  
  let files = Array.from(e.dataTransfer.files); // Array of all files
  // console.log(files);
  
  let x = 0;
  let formData = new FormData();
  
  for (let i=0; i<files.length; i++) {
    // console.log(files[i].size);
    if (files[i].size < 5242880){
      // console.log(files[i].size);
      let reader = new FileReader();
      let element = {
        name: files[i].name,
        size: files[i].size,
        type: files[i].type
      };
      
      reader.onload = function(event) {
        // finished reading file data.
        
        if(element.type == 'image/jpeg'){
          element.path = event.target.result.slice(23);
        }
        else if(element.type == 'image/png'){
          element.path = event.target.result.slice(22);
        }
        
        formData.append(x, JSON.stringify(element));
        x++;
        // console.log(formData.length);
      }
      
      reader.readAsDataURL(files[i]); // start reading the file data.
    }
  }
  
  setTimeout(() => {
    // console.log(formData);
    // dropFieldCounter.innerText = '';
    
    if(x > 0){
      let message = 'Wybrano ';
      if(x == 1){
        message += '1 obrazek.';
      }
      else if(x > 1 && x < 5 ){
        message += x + ' obrazki.';
      }
      else if(x > 4){
        message += x + ' obrazków.';
      }
      dropFieldCounter.innerText = message;
    }
    else {
      dropFieldCounter.innerText = 'Nie wybrano obrazka';
    }

    const data = {
      url: '../php/storage.php',
      method: 'POST',
      body: formData
    };

    uploadBtn.addEventListener('click', () => {
      // console.log(data);
      doRequest(data);
      dropFieldCounter.innerText = 'Nie wybrano obrazka';
    }, {once: true});
    

  }, 100);

} // -----saveDropped function --------------------


function saveUploaded(files){

  // console.log(files);
  
  if(files.length > 0){
    const formData = new FormData();

    for(let i=0; i<files.length; i++){
      // console.log(files[i].size + " - " + files[i].name);
      if(files[i].size < 5242880){
        formData.append('images[]', files[i]);
      }
    }

    const data = {
      url: '../php/storage.php',
      method: 'POST',
      body: formData
    };

    doRequest(data);
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
      url: `../php/storage.php`,
      method: 'POST',
      body: formData
    };

    doRequest(data);
  }
  else {
    // console.log(newName);
    const element = document.querySelector(`[data-id="${newName.id}"] .img-name`);
    element.innerText = newName.name;
    newName = false;
  }
} // ----- editImgName function -------------------


function deleteImage(thiss){
  const imgcontainer = thiss.parentNode.parentNode;
  let x = storageContainer.removeChild(imgcontainer);
};


function showWarning(data){
  warningWindow.innerHTML = data;
  requestAnimationFrame(slideDown);
  setTimeout(() => {
    requestAnimationFrame(slideUp);
  }, 10000);
}

function slideDown(){
  if(position < 0){
    position += 2;
    warningWindow.style.top = position + 'px';
  
    if(position <= -2){
      requestAnimationFrame(slideDown);
    }
  }
}

function slideUp(){
  if(position > -60){
    position -= 2;
    warningWindow.style.top = position + 'px';
  
    if(position >= -58){
      requestAnimationFrame(slideUp);
    }
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
    // console.log(newImg.width);

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



export {loadAccount, actionListeners};

