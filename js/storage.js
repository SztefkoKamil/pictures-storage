
const welcomeMsg = document.querySelector('#welcome-message');
const logoutBtn = document.querySelector('#logout-button');
const deleteUserBtn = document.querySelector('#delete-user-button');
const uploadBtn = document.querySelector('#upload-button');
const uploadForm   = document.querySelector('#upload-form');
const uploadInput   = document.querySelector('#upload-input');

const storageContainer = document.querySelector('#storage-container');
let newName = false;


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
    console.log('delete user');
    const data = {
      url: '../php/storage.php?action=delete-user',
      method: 'GET',
      body: 'none'
    }

    doRequest(data);
  };

  uploadForm.onsubmit = (e) => {
    e.preventDefault();
    savePictures(uploadInput.files);
  };

} // ----- actionListeners function ---------------------


function optionsListeners(){
  // const imgDloadBtns = document.querySelectorAll('.download-img-button');
  const imgDeleteBtns = document.querySelectorAll('.delete-img-button');
  const imgEditBtns = document.querySelectorAll('.edit-img-button');

  
  imgDeleteBtns.forEach((btn) => {
    const id = btn.parentNode.parentNode.getAttribute("data-id");
    btn.addEventListener('click', function(){
      // console.log('delete image id: '+id);
      const data = {
        url: '../php/storage.php?action=delete-image&imageID=' + id,
        method: 'GET',
        body: 'none'
      }; 

      doRequest(data, this);
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
        welcomeMsg.innerHTML = `Witaj ${user}!<br> Dodaj zdjęcie do swojej kolekcji.`;
      }
      else if(resp === 'logout-user-success'){
        window.location.replace(window.location.href.slice(0,-17));
      }
      else if(/^delete-image-/.test(resp)){
        // console.log(resp);
        deleteImage(thiss);
      }
      else if(resp === 'delete-user-success'){
        console.log('user deleted');
      }
      else {
        if(JSON.parse(resp)){
          showPictures(JSON.parse(resp));
        }
        else {
          console.log(resp);
        }
      }

     });
  } else {
    fetch(data.url, {method: data.method, body: data.body}).then(response => {
      return response.text();
    }).then((resp) => {
      console.log(resp);
      if(resp === 'readyToLoad'){
        loadPictures();
      }
      else if(resp === 'edit-name-success'){
        editImgName('', '');
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


function loadPictures(){
  const data = {
    url: '../php/storage.php?action=load-pictures',
    method: 'GET',
    body: 'none'
  };

  doRequest(data);

} /// ----- loadPictures function -----------------


function savePictures(files){

  if(files.length > 0){
    const formData = new FormData();

    for(let i=0; i<files.length; i++){
      let file = files[i];
      formData.append('images[]', file);
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
    newName.name = prompt('Wpisz nową nazwę', element.innerText);
    newName.id = id;
    newName.extension = extension;

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
    console.log(newName);
    const element = document.querySelector(`[data-id="${newName.id}"] .img-name`);
    element.innerText = newName.name;
    newName = false;
  }
} // ----- editImgName function -------------------


function deleteImage(thiss){
  const imgcontainer = thiss.parentNode.parentNode;
  let x = storageContainer.removeChild(imgcontainer);
};


function showPictures(data){
  storageContainer.innerHTML = "";

  for(let i=0; i<data.length; i++){
    const newContainer = document.createElement('div');
    newContainer.classList.add('img-container');
    newContainer.setAttribute("data-id", data[i]["id"]);

    const newImg = document.createElement('img');
    newImg.classList.add('image');
    newImg.setAttribute("src", "data:image;base64,"+data[i]["img"]);

    const newLayout = document.createElement('div');
    newLayout.classList.add("layout");

    const options = [];

    const newDloadBtn = document.createElement('a');
    newDloadBtn.classList.add("download-img-button");
    // newDloadBtn.id = "download-img-button";
    newDloadBtn.setAttribute("href", "data:image;base64,"+data[i]["img"]);
    newDloadBtn.setAttribute("download", data[i]["img_name"]);
    newDloadBtn.innerText = "DL";
    options.push(newDloadBtn);

    const newDeleteBtn = document.createElement('button');
    newDeleteBtn.classList.add("delete-img-button");
    newDeleteBtn.id = "delete-img-button";
    newDeleteBtn.innerText = "DE";
    options.push(newDeleteBtn);

    let name = '';
    let extension = '';
    if(/(.jpg|.png|.gif)$/.test(data[i]["img_name"])){
      name = data[i]["img_name"].slice(0, -4);
      if(/.jpg$/.test(data[i]["img_name"])){
        extension = '.jpg';
      }
      else if(/.png$/.test(data[i]["img_name"])){
        extension = '.png';
      }
      else if(/.gif$/.test(data[i]["img_name"])){
        extension = '.gif';
      }
    }
    else if(/.jpeg$/.test(data[i]["img_name"])){
      name = data[i]["img_name"].slice(0, -5);
      extension = '.jpeg';
    }
    const newImgName = document.createElement('h5');
    newImgName.classList.add("img-name");
    newImgName.id = "img-name";
    newImgName.innerText = name;
    options.push(newImgName);
    
    const newEditBtn = document.createElement('button');
    newEditBtn.classList.add("edit-img-button");
    newEditBtn.id = "edit-img-button";
    newEditBtn.setAttribute("data-ext", extension);
    newEditBtn.innerText = "E";
    options.push(newEditBtn);

    for(let i of options){
      newLayout.appendChild(i);
    }

    newContainer.appendChild(newImg);
    newContainer.appendChild(newLayout);

    storageContainer.appendChild(newContainer);
  
  }

  optionsListeners();

} // ----- showPictures function -------------------



export {loadAccount, actionListeners};

