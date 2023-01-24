/**---------------Usefull variables---------------------------------------------- */
let open = false; 
let wow = false;
console.log(JSON.parse(localStorage.getItem("Blogs")))
/**--------Check User onload-----------------------------------------------------*/
window.onload = checkUser()
/**----------------------Custom Pop up------------------------------------------ */
function popContact(x,y) {
  document.querySelector('#popcontact').style.display = "block";
  document.getElementById('popcontact').style.backgroundColor = y
  document.getElementById('popcontact').innerHTML = x
  setTimeout(() => {
    document.querySelector('#popcontact').style.display = "none";
  }, 2000);
}
/**---------------------Toggle Menus-------------------------------------------- */
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
};
function displayWow(){
  const w = document.getElementById("wowM")
  if (w.style.display === "flex") {
    w.style.display = "none"
  } else {
    w.style.display = "flex"
  }
};
/**---------------------Messages Using Local Storage------------------------------*/
function getMessage() {
  let Messages = JSON.parse(localStorage.getItem("Messages") || "[]");
  const name = document.getElementById("name").value;
  const message = document.getElementById("msg").value;
  let id = Math.floor(Math.random() * 999);
  if (email === "" || name === "" || message === "") {
    popContact("Please Fill Out All Fields", "red")
  } else {
    details = {
      id:id,
      email: email,
      name:name,
      message:message
    }
    console.log(details)
    Messages.push(details);
    window.localStorage.setItem("Messages", JSON.stringify(Messages));
    document.getElementById('frm').reset()
    popContact("Message Sent","green")
    
  }
  
}
function deleteAllMessages() {
  Messages = []
  window.localStorage.removeItem("Messages");
  popContact("All Messages Deleted")
  setTimeout( () => {
      location.reload();

  } , 1000)
}
function deleteMessage(m) {
  let Messages = JSON.parse(localStorage.getItem("Messages"));

  console.log(m)
  if (m > -1) { // only splice array when item is found
      Messages.splice(m, 1); // 2nd parameter means remove one item only
      window.localStorage.setItem("Messages", JSON.stringify(Messages));
      popContact("Message Deleted")
      setTimeout( () => {
        location.reload();
  
      } , 1000)
  }
}
/** ------------------- Authentication-----------*/
function createUser() {
  let Users = JSON.parse(localStorage.getItem("Users") || "[]");
  const email = document.getElementById('email').value;
  const name = document.getElementById('name').value;
  let image = window.localStorage.getItem("tempImage")
  if ( image == null ) {
    image = "./images/dpicon.png"
  }
  const password = document.getElementById('pass').value;
  function ValidateEmail(inputText)
  {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(inputText.match(mailformat))
    {
      return true;
    }
    else
    {
      return false;
    }
  }
  if (email === "" || name === "" || password === "" ) {
    popContact("Please Fill out All Fields.", "red")
  }
  else {
    if ( ValidateEmail(email) ) {
      if ( Users.some(item => item.email === email)) {
        popContact("Email Already Exists.", "red");
      }
      else {
        if (password.length < 5) {
          popContact("Password is Too Short", "red")
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
          popContact("Account Created.", "green")
          
        }
      }
    } else {
      popContact("Invalid Email","red")
    }

  }
  

}
function loginUser() {
  let users = JSON.parse(localStorage.getItem("Users") || "[]")
  let arr = JSON.parse(localStorage.getItem("Users") || "[]")
  const image = "./images/dp.jpg"
  const email = document.getElementById('email').value
  const pass = document.getElementById('pass').value
  var x = users.findIndex(obj => obj.email == email);
  const lastIndexOfName = name => {
    let index = [...users].reverse().findIndex(obj => obj.password == pass);
    return index >= 0 ? arr.length - 1 - index : index;
  }
  var y = lastIndexOfName(pass);
  if (email === "admin@mail.com" && pass=== "pass") {
    window.location.href = "./dashboard/dashboard.html"
    const admin = {
      email : "admin@mail.com",
      name: "Admin",
      password: "pass",
      image : image
    }
    window.localStorage.setItem("tempLog", JSON.stringify(admin))
  } else {
    if (email === "" || pass === "") {
      popContact("Please Fill out All Fields", "red");
    }
    else {
      for (let i = 0; i < users.length; i++) {
        if (users[i].email == email && users[i].password == pass) {
          window.localStorage.setItem("tempLog", JSON.stringify(users[i]))
          let link = "./index.html"
          window.location.href = link
          break;
        }
      }
      setTimeout(() => {
        popContact("Invalid Credintials", "red")
        
      }, 1000);
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
/**--------------------------Blogs Using Local Storage------------------------------------ */
function createBlog() {
  let Blogs = JSON.parse(localStorage.getItem("Blogs") || "[]");
  const title = document.getElementById('title').value
  const image = window.localStorage.getItem("tempImage")
  const content = quill.root.innerHTML
  //-----------Form Validation----------------
  if (title == "" || content == "<p><br></p>" || image == null ) {
    popContact("Please Fill out All Fields", "red")
  } else {
    if (title.length > 500) {
      popContact(" Title too Long ", "red")
    } else {
      const blogData = {
        title: title,
        image: image,
        content: content,
        likeCount: 0,
        comments: [],
        liked: [],
        date: new Date().toLocaleDateString()
      }
      Blogs.push(blogData);
      localStorage.setItem('Blogs', JSON.stringify(Blogs));
      var element = document.getElementById("frm")
      element.reset()
      popContact("Blog Created", "green")
      window.localStorage.removeItem("tempImage")
      location.reload()
    } 
  }
}
function toeditBlog(id) {
  function navigate(n) {
    let link = "./edit.html?id=" + n
    window.location.href = link;
  }
  navigate(id)
}
function editBlog(id) {
  let Bloge = JSON.parse(window.localStorage.getItem("Blogs"))
  const title = document.getElementById('title').value
  const image = window.localStorage.getItem("tempImage") || Bloge[id].image
  const content = quill.root.innerHTML
  //-----------Form Validation----------------
  if (title === Bloge[id].title && content === Bloge[id].content && image === null ) {
    popContact("Nothing To Edit", "red")
  } else {
    if (title.length > 500) {
      popContact(" Title too Long ", "red")
    } else {
      const blogData = {
        title: title,
        image: image,
        content: content,
        likeCount: Bloge[id].likeCount,
        comments: Bloge[id].comments,
        liked: Bloge[id].liked,
        date: new Date().toLocaleDateString()
      }
      if (id > -1) { // only splice array when item is found
        Bloge.splice(id, 1); // 2nd parameter means remove one item only
        window.localStorage.setItem("Blogs", JSON.stringify(Bloge));
      }
      Bloge.push(blogData);
      localStorage.setItem('Blogs', JSON.stringify(Bloge));
      var element = document.getElementById("frm")
      element.reset()
      popContact("Blog Edited", "green")
      window.localStorage.removeItem("tempImage")
      location.href = "./dashboard.html"
    } 
  }
}
function deleteAllBlogs() {
  let Bloga = JSON.parse(localStorage.getItem("Blogs") || "[]");
  Bloga = []
  window.localStorage.removeItem("Blogs");
  popContact("All Blogs Deleted", "yellow")
  location.reload();
}
function deleteBlog(m) {
  let Blogs = JSON.parse(localStorage.getItem("Blogs") || "[]");
  let Blogsa = JSON.parse(localStorage.getItem("Blogs"));
  console.log(m)
  if (m > -1) { // only splice array when item is found
      Blogsa.splice(m, 1); // 2nd parameter means remove one item only
      window.localStorage.setItem("Blogs", JSON.stringify(Blogsa));
      popContact("Blog Deleted", "yellow")
      location.reload()
  }
}
function addComment(id) {
  let Blogs = JSON.parse(localStorage.getItem("Blogs"));
  let users = JSON.parse(localStorage.getItem("Users"));
  let comment = document.getElementById("ccontent").value
  let cname = JSON.parse(localStorage.getItem("tempLog")).name
  let image = JSON.parse(localStorage.getItem("tempLog")).image
  if (users.some(item => item.name === cname) || cname == "Admin") {
    const tempComment = {
      id : id,
      name : cname,
      comment : comment,
      image: image,
      date: Date.now()
    }
    Blogs[id].comments.push(tempComment);
    localStorage.setItem('Blogs', JSON.stringify(Blogs));
    popContact("Comment Added", "green")
    setTimeout(() => {
      window.location.reload()
    }, 500);
  } else {
    popContact("Please Create Account Before Commenting.", "red")
  }



}
function displayComments(id) {
  com = document.getElementById("com")
  let Blogsd = JSON.parse(localStorage.getItem("Blogs")).sort((a, b) => (a > b ? -1 : 1));
  let output = " <div class=\"comment\">"  + " <div class=\"com-name\"> " + "</div> "
          + " <div class=\"com-content\"> " + "</div> " +
          "<div class=\"com-date\">09/01/2023</div>" + " </div>"
  if (Blogsd[id].comments.length < 1) {
    output = "No Comments"
  } else {
    
  }
  for(let i = Blogsd[id].comments.length; i > 0; i--)
  {
    let m = new Date(Blogsd[id].comments[i-1].date)
    output += " <div class=\"comment\">"  + " <div class=\"com-name\"> "+ "<img src="+ Blogsd[id].comments[i-1].image + " alt=\"image \">" + Blogsd[id].comments[i-1].name +  "</div> "
    + " <div class=\"com-content\"> " + Blogsd[id].comments[i-1].comment + "</div> " +
    "<div class=\"com-date\">" + m.toDateString() + "</div> </div>"
  }
  //console.log(output)
  com.innerHTML = output;
  
}
function getLikes(x) {
  if (wow === true) {
    if (x > -1) {
      let Blogsl = JSON.parse(localStorage.getItem("Blogs"));
      let id = JSON.parse(localStorage.getItem("tempLog")).email
      let likes = Blogsl[x].likeCount;
        if (Blogsl[x].liked.length === 0) {
          likes++
          Blogsl[x].likeCount = likes
          Blogsl[x].liked.push(id)
          localStorage.setItem('Blogs', JSON.stringify(Blogsl));
          location.reload()
        }
        else {

            if ( Blogsl[x].liked.some(item => item == id) ) {
              function removeItemAll(arr, value) {
                var i = 0;
                while (i < arr.length) {
                  if (arr[i] === value) {
                    arr.splice(i, 1);
                  } else {
                    ++i;
                  }
                }
                return arr;
              }
              likes--
              Blogsl[x].likeCount = likes
              const arr = removeItemAll(Blogsl[x].liked, id)
              console.log(arr)
              localStorage.setItem('Blogs', JSON.stringify(Blogsl));
              location.reload()
            }
            else if ( Blogsl[x].liked.some(item => item != id)  ) {
              likes = likes + 1
              Blogsl[x].likeCount = likes
              Blogsl[x].liked.push(id)
              localStorage.setItem('Blogs', JSON.stringify(Blogsl));
              location.reload()
            }
        }
    }
  }
}
/**------------------------ Navigation Done by Buttons------------------------------------- */
function navigate(n) {
  let link = "./blog-detail.html?id=" + n
  window.location.href = link;
}
function tologin() {
  if (!localStorage.getItem("tempLog")) {
    window.location.href = "./login.html"
  }
}
function SignUp(m) {
window.location.href = "./signup.html"
}
function toSignUp() {
  if (!localStorage.getItem("tempLog")) {
    window.location.href = "./signup.html"
  }
}
function toProfile() {
  window.location.href = "./profile.html"
}
function toDashboard() {
  window.location.href = "./dashboard/dashboard.html"
}
function showLoginButton() {
  const p = document.getElementById("profilePic")
  const l = document.getElementById("loginbutton")
  if ( wow === false) {
    p.style.display = "none"
    l.style.display = "block"
  }
}
/**---------------------------Checking Admin Authority ------------------------------------ */
function che() {
  const ano = JSON.parse(window.localStorage.getItem("tempLog"))
  if (wow === true && ano.email === "admin@mail.com" && ano.password === "pass") {

  }
  else {
    const link = "../index.html"
    window.location.href = link
  }
}
function toDashButton() {
  const dashbutton = document.getElementById("dashbutton")
  const ano = JSON.parse(window.localStorage.getItem("tempLog"))
  if (wow === true && ano.email === "admin@mail.com" && ano.password === "pass") {
    dashbutton.style.display = "block"
  }
  else {
    dashbutton.style.display = "none"
  }
}
/**---------------------------Changing The user profile ----------------------------------- */
function changeUser() {
  let Users = JSON.parse(localStorage.getItem("Users") || "[]")
  const myemail = JSON.parse(window.localStorage.getItem("tempLog")).email;
  const myname = JSON.parse(localStorage.getItem("tempLog")).name;
  const myimage = JSON.parse(window.localStorage.getItem("tempLog")).image
  const mypassword = JSON.parse(window.localStorage.getItem("tempLog")).password
  const image = window.localStorage.getItem("tempImage")
  var id = Users.findIndex(obj => obj.email == myemail);
  let name = document.getElementById('name').value;
  let password = document.getElementById('pass').value;
  let password1 = document.getElementById('pass1').value;
  if ( name === "" ) {
    name = myname
  }
  if ( password === "" ) {
    password = mypassword
    password1 = mypassword
  }

  if ( name === myname && password == mypassword && image == myimage && password1 == mypassword ) {
    popContact("Nothing to save.", "red")
  }
  else {
    if (password != mypassword ) {
      popContact("Old Password Is Wrong")
    } else {
      if (password1.length < 5) {
        popContact("New Password is Too Short")
      } else {
        const userData = {
            email: myemail,
            name: name,
            image: image,
            password: password1,
        };
        if (id > -1) { 
          Users.splice(id, 1);
        }
        Users.push(userData);
        localStorage.setItem('Users', JSON.stringify(Users));
        var element = document.getElementById("frm")
        element.reset()
        window.localStorage.removeItem("tempImage")
        popContact("Profile Changed.", "green")
        setTimeout( logOut() , 1000);
        
      }

    }
    }


}

/** ---------------------------Admin Manage User ------------------------------------------ */
function userToTable() {
  const table = document.getElementById("table")
  const users = JSON.parse(window.localStorage.getItem("Users"))
  for (let i = 0; i < users.length; i++) {
    const tr = document.createElement("tr");
    const tdimage = document.createElement("img");
    const tdname = document.createElement("td");
    const tdemail = document.createElement("td");
    const deleteButton = document.createElement("button")
    deleteButton.innerText = "Delete"
    deleteButton.setAttribute("id", "btn")
    const x = "userDelete("+ "'"+ users[i].name+"'" + ")"
    deleteButton.setAttribute("onclick", x)
    tdimage.src = users[i].image;
    tr.appendChild(tdimage);
    tr.appendChild(tdname);
    tr.appendChild(tdemail);
    tr.appendChild(deleteButton);
    table.appendChild(tr);
    tdname.innerText = users[i].name;
    tdemail.innerText = users[i].email;
  }
}
function userDelete(id) {
  const users = JSON.parse(window.localStorage.getItem("Users"))
  for(var i = 0; i <= users.length - 1; i++){
    if(users[i].name == id){
        users.splice(i,1);
        localStorage.setItem('Users', JSON.stringify(users));
        popContact("User Deleted", "yellow")
        setTimeout(() => {
          location.reload()
        }, 1500);
    }
  }
}

/**---------------------------Dashboard Count Users, Blogs, Messages, Comments and Likes-------------*/
function countLikes() {
  let blogLikes = JSON.parse(window.localStorage.getItem("Blogs"));
  let count = 0;
  for (let i = 0; i < blogLikes.length; i++) {
    
    count = blogLikes[i].likeCount + count
  }
  const likes = document.getElementById("likes")
  likes.innerHTML = count + " Total Likes"
}
function countComments() {
  let blogComments = JSON.parse(window.localStorage.getItem("Blogs"));
  let count = 0;
  for (let i = 0; i < blogComments.length; i++) {
    
    count = blogComments[i].comments.length + count
  }
  const likes = document.getElementById("comments")
  likes.innerHTML = count + " Total Comments"
}
function countBlogs() {
  let blogs = JSON.parse(window.localStorage.getItem("Blogs")).length;
  const blogscount = document.getElementById("blogscount")
  blogscount.innerHTML = blogs + " Blogs"
}
function countUsers() {
  let users = JSON.parse(window.localStorage.getItem("Users")).length;
  const blogscount = document.getElementById("visits")
  blogscount.innerHTML = users + " Accounts"
}
function countMessages() {
  let Messages = JSON.parse(window.localStorage.getItem("Messages")).length;
  const messagescount = document.getElementById("msgcount")
  messagescount.innerHTML = Messages
}
