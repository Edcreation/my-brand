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
  document.getElementById('frm').reset()
  
  function popContact() {
    document.getElementById('popcontact').style.display = "block";
  }
  popContact()
}
function deleteMessage(x) {
      const index = Messages.indexOf(x);
      if (index > -1) { // only splice array when item is found
      formDetails.splice(index, 1); // 2nd parameter means remove one item only
  }
}
/** ------------------- Authentication-----------*/
let Users = JSON.parse(localStorage.getItem("Users") || "[]")
function createUser() {
  const userData = {
      email: document.getElementById('email').value,
      name: document.getElementById('name').value,
      password: document.getElementById('pass').value
  };
  Users.push(userData);
  localStorage.setItem('Users', JSON.stringify(Users));
  hide()
  var element = document.getElementById("frm")
  element.reset()
}
function loginUser() {
  
  const name = document.getElementById('name').value
  const pass = document.getElementById('pass').value
  if (localStorage.getItem('Users')) {
      const data = JSON.parse(localStorage.getItem('Users'))
      console.log(data[0].name)
      for (let i = 0; i < data.length; i++) {
        if (name === data[i].name && pass === data[i].password) {
          location.replace("http://127.0.0.1:3000/dashboard/dashboard.html");
          continue;
        }
        else{
          hide();
        }
      }
  } else {
      console.log('Not a registered user')
  }
}
/**--------------------------Blogs Using Local Storage------------------------------- */
let Blogs = JSON.parse(localStorage.getItem("Blogs") || "[]");
function createBlog() {
  const blogData = {
    title: document.getElementById('title').value,
    image: document.getElementById('image').value,
    content: document.getElementById('content').value,
    likeCount: 0,
  }
  Blogs.push(blogData);
  localStorage.setItem('Blogs', JSON.stringify(Blogs));
  hide()
  var element = document.getElementById("frm")
  element.reset()
}
function deleteAllBlogs() {
  Blogs = []
  window.localStorage.removeItem("Blogs");
  location.reload();
}
function deleteBlog(m) {
  console.log(m)
  if (m > -1) { // only splice array when item is found
      Blogs.splice(m, 1); // 2nd parameter means remove one item only
      window.localStorage.setItem("Blogs", JSON.stringify(Blogs));
      location.reload()
  }
}
function getLikes(x) {
  if (x > -1) {
    let likes = Blogs[x].likeCount;
    likes = likes + 1
    Blogs[x].likeCount = likes
    localStorage.setItem('Blogs', JSON.stringify(Blogs));
    console.log(Blogs[x].likeCount)
    console.log(Blogs)
    l = document.getElementById("l")
    l.classList.remove("l");
    l.classList.add("l1");
    location.reload()
    
  }
}
function navigate(n) {
  let link = "blog-detail.html?id=" + n
  window.location.href = link;
  console.log(n)
}



