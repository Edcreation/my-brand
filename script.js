let open = false; 
let wow = false;

function displayWow(){
  const w = document.getElementById("wowM")
  if (w.style.display === "flex") {
    w.style.display = "none"
  } else {
    w.style.display = "flex"
  }
  

}
window.onload = checkUser()
function popContact(x) {
  document.querySelector('#popcontact').style.display = "block";
  document.getElementById('popcontact').innerHTML = x
  setTimeout(() => {
    document.querySelector('#popcontact').style.display = "none";
  }, 2000);
}

function toggleNav(){
  var myImage = document.getElementById('ig');
  if(open==false){
    var mySrc = myImage.getAttribute('src');
    navUl = document.getElementById("actions");
    myImage.setAttribute ('src','./images/close.png');
      navUl.style.display="flex";
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
  if (email === "" || name === "" || message === "") {
    popContact("Please Fill Out All Fields")
  } else {
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
  
}
/** ------------------- Authentication-----------*/
function createUser() {
  let Users = JSON.parse(localStorage.getItem("Users") || "[]")
  const users = JSON.parse(window.localStorage.getItem("Users") || "[]");
  const email = document.getElementById('email').value;
  const name = document.getElementById('name').value;
  const image = window.localStorage.getItem("tempImage")
  const password = document.getElementById('pass').value;
  if (email === "" || name === "" || password === "" ) {
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
            image: image,
            password: password,
        };
        Users.push(userData);
        localStorage.setItem('Users', JSON.stringify(Users));
        var element = document.getElementById("frm")
        element.reset()
        window.localStorage.removeItem("tempImage")
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
  if (email === "admin@mail.com" && pass=== "pass") {
    window.location.href = "./dashboard/dashboard.html"
    const admin = {
      email : "admin@mail.com",
      name: "Admin",
      password: "pass"
    }
    window.localStorage.setItem("tempLog", JSON.stringify(admin))
  } else {
    if (email === "" || pass === "") {
      popContact("Please Fill out All Fields");
    }
    else {
      if(users.some(item => item.email === email)){
        if (users.some(item => item.password === pass)) {
          let link = "./index.html"
          for (let i = 0; i < arr.length; i++) {
            if (users[i].email === email) {
              window.localStorage.setItem("tempLog", JSON.stringify(users[i]))
            }
            
          }
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
}
function checkUser() {
  if (localStorage.getItem("tempLog")) {
    wow = true
  }
  else{
    wow = false
  }
}
function logOut() {
  window.localStorage.removeItem("tempLog")
  wow = false
  location.reload()
}
/**--------------------------Blogs Using Local Storage------------------------------- */


function createBlog() {
  let Blogs = JSON.parse(localStorage.getItem("Blogs") || "[]");
  const title = document.getElementById('title').value
  const image = window.localStorage.getItem("tempImage")
  const content = document.getElementById('content').value
  // -----------Form Valodarion----------------
  if (title === "" || content === "" || image === "") {
    popContact("Please Fill out All Fields")
  } else {
    if (title.length > 500) {
      popContact(" Title too Long ")
    } else {
      const blogData = {
        title: title,
        image: image,
        content: content,
        likeCount: 0,
        comments: [],
        date: new Date().toLocaleDateString()
      }
      Blogs.push(blogData);
      localStorage.setItem('Blogs', JSON.stringify(Blogs));
      var element = document.getElementById("frm")
      element.reset()
      popContact("Blog Created")
      window.localStorage.removeItem("tempImage")
    } 
  }
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

function addComment(id) {
  let Blogs = JSON.parse(localStorage.getItem("Blogs"));
  let users = JSON.parse(localStorage.getItem("Users"));
  let comment = document.getElementById("ccontent").value
  let cname = JSON.parse(localStorage.getItem("tempLog")).name
  let image = JSON.parse(localStorage.getItem("tempLog")).image
  if (users.some(item => item.name === cname)) {
    const tempComment = {
      id : id,
      name : cname,
      comment : comment,
      image: image,
      date: Date.now()
    }
    console.log(cname)
    Blogs[id].comments.push(tempComment);
    localStorage.setItem('Blogs', JSON.stringify(Blogs));
    popContact("Comment Added")
    setTimeout(() => {
      window.location.reload()
    }, 3000);
  } else {
    //popContact("Please Create Account Before Commenting.")
    // alert("Please Create Account Before Commenting.")
    popContact("Please Create Account Before Commenting.")
  }



}
function getLikes(x) {
  if (wow === true) {
    if (x > -1) {
      let Blogsl = JSON.parse(localStorage.getItem("Blogs"));
      let likes = Blogsl[x].likeCount;
      likes = likes + 1
      Blogsl[x].likeCount = likes
      localStorage.setItem('Blogs', JSON.stringify(Blogsl));
      l = document.getElementById("l")
      // l.classList.remove("l");
      // l.classList.add("l1");
      location.reload()
      
    }
  }
}
function navigate(n) {
  let link = "./blog-detail.html?id=" + n
  window.location.href = link;
  console.log(n)
}
function displayComments(id) {
  com = document.getElementById("com")
  let Blogsd = JSON.parse(localStorage.getItem("Blogs")).sort((a, b) => (a > b ? -1 : 1));
  let output = " <div class=\"comment\">"  + " <div class=\"com-name\"> " + "</div> "
          + " <div class=\"com-content\"> " + "</div> " +
          "<div class=\"com-date\">09/01/2023</div> </div>"
  if (Blogsd[id].comments.length < 1) {
    output = "No Comments"
  } else {
    
  }
  for(let i = Blogsd[id].comments.length; i > 0; i--)
  {
    let m = new Date(Blogsd[id].comments[i-1].date)
    output += " <div class=\"comment\">"  + " <div class=\"com-name\"> "+ "<img src="+ Blogsd[id].comments[i-1].image + " alt=\"image \">" + Blogsd[id].comments[i-1].name + "</div> "
    + " <div class=\"com-content\"> " + Blogsd[id].comments[i-1].comment + "</div> " +
    "<div class=\"com-date\">" + m.toDateString() + "</div> </div>"
  }
  //console.log(output)
  com.innerHTML = output;
  
}


function showLoginButton() {
  const p = document.getElementById("profilePic")
  const l = document.getElementById("loginbutton")
  if ( wow === false) {
    p.style.display = "none"
    l.style.display = "block"
  }
}
function che() {
  const ano = JSON.parse(window.localStorage.getItem("tempLog"))
  if (wow === true && ano.email === "admin@mail.com" && ano.password === "pass") {
  }
  else {
    const link = "../index.html"
    window.location.href = link
  }
}