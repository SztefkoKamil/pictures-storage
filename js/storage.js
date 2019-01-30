
const welcomeMsg = document.querySelector('#welcome-message');
const logoutBtn = document.querySelector('#logout-button');
const deleteUserBtn = document.querySelector('#delete-user-button');
const uploadBtn = document.querySelector('#upload-button');
const uploadForm   = document.querySelector('#upload-form');
const uploadInput   = document.querySelector('#upload-input');

const storageContainer = document.querySelector('#storage-container');


function actionListeners(){
  logoutBtn.onclick = () => {
    console.log('logout');
  };
  
  deleteUserBtn.onclick = () => {
    console.log('delete user');
  };
  
  uploadBtn.onclick = () => {
    console.log('upload picture');
  };

  uploadForm.onsubmit = (e) => {
    e.preventDefault();
    savePictures(uploadInput.files);
  };

} // ----- actionListeners function ---------------------


function savePictures(data){
  const formData = new FormData();

  for(let i=0; i<data.length; i++){
    let file = data[i];
    formData.append('images[]', file);
  }

  const url = '../php/storage.php'
  const newXHR = new XMLHttpRequest();

  newXHR.onreadystatechange = function(){
    if (this.readyState === 4 && this.status === 200) {

        console.log(this.response);

        if(this.response === 'readyToLoad'){
          loadPictures();
        }

    }
  };

  newXHR.open("POST", url, true);
  newXHR.send(formData);
} // ----- savePictures function -----------------


function loadAccount(){
  const newXHR = new XMLHttpRequest();
  const url = '../php/storage.php?action=loadAccount'

  newXHR.onreadystatechange = function(){
    if (this.readyState === 4 && this.status === 200) {
      // console.log(this.response);

      if(/^loaded/.test(this.response) && this.response.length > 10){
        const user = this.response.slice(6);
        loadPictures();
        welcomeMsg.innerHTML = `Witaj ${user}!<br> Dodaj zdjęcie do swojej kolekcji.`;
      }
    }
  };

  newXHR.open("GET", url, true);
  newXHR.send();

} // ----- loadAccount function --------------------


function loadPictures(){

  const newXHR = new XMLHttpRequest();
  const url = '../php/storage.php?action=loadPictures'

  newXHR.onreadystatechange = function(){
    if (this.readyState === 4 && this.status === 200) {
      // console.log(this.response);
      showPictures(JSON.parse(this.response));
    }
  };

  newXHR.open("GET", url, true);
  newXHR.send();
} /// ----- loadPictures function -----------------


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

    const newDloadBtn = document.createElement('button');
    newDloadBtn.classList.add("download-img-button");
    newDloadBtn.id = "download-img-button";
    newDloadBtn.innerText = "DL";
    options.push(newDloadBtn);

    const newDeleteBtn = document.createElement('button');
    newDeleteBtn.classList.add("delete-img-button");
    newDeleteBtn.id = "delete-img-button";
    newDeleteBtn.innerText = "DE";
    options.push(newDeleteBtn);
    
    const newImgName = document.createElement('h5');
    newImgName.classList.add("img-name");
    newImgName.id = "img-name";
    newImgName.innerText = "Nazwa zdjęcia";
    options.push(newImgName);

    const newEditBtn = document.createElement('button');
    newEditBtn.classList.add("edit-img-button");
    newEditBtn.id = "edit-img-button";
    newEditBtn.innerText = "E";
    options.push(newEditBtn);

    for(let i of options){
      newLayout.appendChild(i);
    }

    newContainer.appendChild(newImg);
    newContainer.appendChild(newLayout);

    storageContainer.appendChild(newContainer);
  
  }

} // ----- showPictures function -------------------

function doRequest(data){

  // fetch().then()

}



export {loadAccount, actionListeners};

