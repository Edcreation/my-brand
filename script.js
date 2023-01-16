let open = false; 
function popContact(x) {
  document.querySelector('#popcontact').style.display = "block";
  document.getElementById('popcontact').innerHTML = x
  setTimeout(() => {
    document.querySelector('#popcontact').style.display = "none";
  }, 2000);
} 
popContact()
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
function getMessage() {
  let Messages = JSON.parse(localStorage.getItem("Messages") || "[]");
  const email = document.getElementById("email").value;
  const name = document.getElementById("name").value;
  const message = document.getElementById("msg").value;
  let id = Math.floor(Math.random() * 999);
  details = {
    id:id,
    email:email,
    name:name,
    message:message
  }
  console.log(details)
  Messages.push(details);
  window.localStorage.setItem("Messages", JSON.stringify(Messages));
  document.getElementById('frm').reset()
  popContact("Message Sent")
  
}

/** ------------------- Authentication-----------*/
function createUser() {
  let Users = JSON.parse(localStorage.getItem("Users") || "[]")
  const users = JSON.parse(window.localStorage.getItem("Users"));
  const email = document.getElementById('email').value;
  const name = document.getElementById('name').value;
  const password = document.getElementById('pass').value;
  if (email === "" || name === "" || password === "") {
    popContact("Please Fill out All Fields.")
  }
  else {
    if ( users.some(item => item.email === email)) {
      popContact("Email Already Exists.");
    }
    else {
      if (password.length < 5) {
        popContact("Password is Too Short")
      } else {
        const userData = {
            email: email,
            name: name,
            password: password,
        };
        Users.push(userData);
        localStorage.setItem('Users', JSON.stringify(Users));
        var element = document.getElementById("frm")
        element.reset()
        popContact("Account Created.")
        
      }
    }

  }
  

}
function loginUser() {
  let users = JSON.parse(localStorage.getItem("Users") || "[]")
  let arr = JSON.parse(localStorage.getItem("Users") || "[]")
  const email = document.getElementById('email').value
  const pass = document.getElementById('pass').value
  if (email === "" || pass === "") {
    popContact("Please Fill out All Fields");
  }
  else {
    if(users.some(item => item.email === email)){
      if (users.some(item => item.password === pass)) {
        let link = "./dashboard/dashboard.html?name=" + email
        window.location.href = link
      } else {
        popContact("Password Incorrect.")
      }
    }
    else {
      popContact("Email Doesn't Exist")
    }
  }
}
/**--------------------------Blogs Using Local Storage------------------------------- */
function createBlog() {
  let Blogs = JSON.parse(localStorage.getItem("Blogs") || "[]");
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
  let Bloga = JSON.parse(localStorage.getItem("Blogs") || "[]");
  Bloga = []
  window.localStorage.removeItem("Blogs");
  location.reload();
}
function deleteBlog(m) {
  let Blogs = JSON.parse(localStorage.getItem("Blogs") || "[]");
  let Blogsa = JSON.parse(localStorage.getItem("Blogs"));
  console.log(m)
  if (m > -1) { // only splice array when item is found
      Blogsa.splice(m, 1); // 2nd parameter means remove one item only
      window.localStorage.setItem("Blogs", JSON.stringify(Blogsa));
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




