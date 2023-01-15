let open = false;    
function toggleNav(){
  var myImage = document.getElementById('ig');
  if(open==false){
    var mySrc = myImage.getAttribute('src');
    navUl = document.getElementById("actions");
    myImage.setAttribute ('src','./images/close.png');
      navUl.style.display="block";
      //navUl.style.animation = 	"animation: slideInFromLeft .8s;"
      open = true;
    }else{
      myImage.setAttribute ('src','./images/open.png');
      navUl = document.getElementById("actions");
      //navUl.style.animation = 	"slide-out-left 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both"
      navUl.style.display="none";
      open = false; 
    }
  
};
function toggleDashNav() {
  if(open==false){
    navUl = document.getElementById("dash-nav");
    navUl.style.display="flex";
    open = true;
}else{
      navUl = document.getElementById("dash-nav");
      navUl.style.display="none";
      open = false; 
}
}

//---------------------Messages Using Local Storage-----------------/

function contact() {
  var formData = readContact();
  insertItem(formData);
}
function readContact() {
  var formData = {};
  formData["email"] = document.getElementById("email").value;
  formData["name"] = document.getElementById("name").value;
  formData["Message"] = document.getElementById("msg").value;
  return formData;
}
let Messages = JSON.parse(localStorage.getItem("Messages") || "[]");
function insertItem(details) {
  const email = document.getElementById("email").value;
  const name = document.getElementById("name").value;
  const message = document.getElementById("msg").value;

  let id = Math.floor(Math.random() * 999);
  details = {id:id,email,name:name,message:message}
  Messages.push(details);
  window.localStorage.setItem("Messages", JSON.stringify(Messages));
  alert("Message Sent");
  location.reload();
}
function deleteMessage(x) {
      const index = Messages.indexOf(x);
      if (index > -1) { // only splice array when item is found
      formDetails.splice(index, 1); // 2nd parameter means remove one item only
  }
}
function checkUser() {
  if (window.localStorage.getItem(document.getElementById('email').value === window.localStorage.getItem("formDetail") )) {
      console.log("ok")      
  }
  else {
      for (let i = 0; i < localStorage.length; i++) {
          console.log(localStorage.getItem(localStorage.key(i)));
      } 
  }
}

