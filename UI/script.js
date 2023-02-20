/**---------------Usefull variables---------------------------------------------- */
let open = false; 
let wow = false;
/**--------Check User onload-----------------------------------------------------*/
window.onload = checkUser()
/**----------------------Custom Pop up------------------------------------------ */
function popContact(x,y) {
  document.querySelector('#popcontact').style.display = "block";
  document.getElementById('popcontact').style.backgroundColor = y
  document.getElementById('popcontact').innerHTML = x
  setTimeout(() => {
    document.querySelector('#popcontact').style.display = "none";
  }, 5000);
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
}
/**---------------------Messages Using Local Storage------------------------------*/
async function getMessage() {

  const email = document.getElementById("email").value;
  const name = document.getElementById("name").value;
  const message = document.getElementById("msg").value;

  if (email === "" || name === "" || message === "") {
    popContact("Please Fill Out All Fields", "red")
  } else {
    details = {
      email: email,
      name: name,
      message: message
    }
    const rawResponse = await fetch('https://my-brand-production.up.railway.app/messages/send', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(details)
  });
  const content = await rawResponse.json();
  if (content.Error) {
    popContact(content.Error,"red")
  } else {
    popContact(content.message,"green")
    document.getElementById('frm').reset()
    }
    
  }
  
}
function deleteMessage(m) {
  let Messages = JSON.parse(localStorage.getItem("Messages"));
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
async function createUser() {
  let Users = JSON.parse(localStorage.getItem("Users") || "[]");
  const email = document.getElementById('email').value;
  const name = document.getElementById('name').value;
  const password = document.getElementById('pass').value;
  const details = {
    username: name,
    email: email,
    password: password,
  }
  let image = window.localStorage.getItem("tempImage");
  let id = Math.floor(Math.random() * 1000000) + 100000000;
  if ( image == null ) {
    image = "./images/dpicon.png"
  }
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
      const rawResponse = await fetch('https://my-brand-production.up.railway.app/users/signup', {
        method: 'POST',
        headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(details)
      });
      const content = await rawResponse.json();
      console.log(details)
      if (content.Error) {
        popContact(content.Error,"red")
      } else if(content.message) {
        popContact(content.message ,"green")
      }
      } else {
        popContact("Invalid Email","red")
      }
  }
  

}
async function loginUser() {

  const email = document.getElementById('email').value
  const pass = document.getElementById('pass').value
  const details = {
    email: email,
    password: pass
  }
  if (email === "" || pass === "") {
    popContact("Please Fill out All Fields", "red");
  }
  else {
    const rawResponse = await fetch('https://my-brand-production.up.railway.app/users/login', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(details)
    });
    const content = await rawResponse.json();
    const userId = content.userId
    const userAlpha = await fetch(`https://my-brand-production.up.railway.app/users/u/${userId}`)
    const user = await userAlpha.json();
    console.log(content)
    if (content.Error) {
      popContact(content.Error,"red")
    } else if(content.message) {
      popContact(content.message ,"red")
      document.getElementById('frm').reset()
    }
    else {
      localStorage.setItem("tempLog", JSON.stringify(user.data))
      console.log(user.data)
      localStorage.setItem("cooltoken", content.token)
      location.href = "./index.html"
    }
  }
}
function checkUser() {
  
  if (localStorage.getItem("cooltoken")) {
    wow = true
  }
  else{
    wow = false
  }
}
function logOut() {
  window.localStorage.removeItem("cooltoken")
  window.localStorage.removeItem("tempLog")
  wow = false
  location.reload()
}
/**--------------------------Blogs Using Local Storage------------------------------------ */
async function createBlog() {
  const title = document.getElementById('title').value
  const image = document.getElementById('image')
  const blogcontent = tinymce.activeEditor.getContent();
  const token = localStorage.getItem("cooltoken")
  //-----------Form Validation----------------
  if (title == "" || content == "<p><br></p>" || image.value == "" ) {
    popContact("Please Fill out All Fields", "red")
  } else {
    if (title.length > 500) {
      popContact(" Title too Long ", "red")
    } else {
      var data = new FormData()
      data.append('blogImage', image.files[0])
      data.append('content', blogcontent)
      data.append('title', title)
      const rawResponse = await fetch('https://my-brand-production.up.railway.app/blogs/create', {
        method: 'POST',
        body: data,
        headers: {
        'Authorization' : `Bearer ${token}`
        }
      });
      const content = await rawResponse.json();
      
      if (content.Error) {
        popContact(content.Error,"red")
      } else if(content.message) {
        popContact(content.message ,"green")
        var element = document.getElementById("frm")
        element.reset()
        localStorage.removeItem("tempImage")
        quill.root.innerHTML = ""
      }
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
async function editBlog(id) {

  const title = document.getElementById('title').value
  const image = document.getElementById('image')
  const blogcontent = tinymce.activeEditor.getContent();
  const token = localStorage.getItem("cooltoken")
  if (title.length > 500 || image.value == "") {
    if (image.value == "") {
      popContact(" Please provide Image ", "red")
    }
    else {
      popContact(" Title too Long ", "red")
    }
  } else {
    var data = new FormData()
    data.append('blogImage', image.files[0])
    data.append('content', blogcontent)
    data.append('title', title)
    const rawResponse = await fetch(`https://my-brand-production.up.railway.app/blogs/edit/${id}`, {
      method: 'PUT',
      body: data,
      headers: {
      'Authorization' : `Bearer ${token}`
      }
    });
    const content = await rawResponse.json();
    
    if (content.Error) {
      popContact(content.Error,"red")
    } else if(content.message) {
      popContact(content.message ,"green")
      var element = document.getElementById("frm")
      element.reset()
      localStorage.removeItem("tempImage")
      quill.root.innerHTML = ""
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
async function deleteBlog(id) {
  const token = localStorage.getItem("cooltoken")
  const rawResponse = await fetch(`https://my-brand-production.up.railway.app/blogs/delete/${id}`, {
    method: 'DELETE',
    headers: {
    'Authorization' : `Bearer ${token}`
  }
  });
  const content = await rawResponse.json();
  
  if (content.Error) {
    popContact(content.Error,"red")
  } else if(content.message) {
    popContact(content.message ,"green")
    location.reload()
  }
}
async function addComment(id) {
  if (wow) {
    const comment = document.getElementById("ccontent").value
    const token = localStorage.getItem("cooltoken")
    if (comment == "") {
      popContact("Please Fillout", "red")
    } else {
      const tempComment = {
        comment : comment,
      }
      const rawResponse = await fetch(`https://my-brand-production.up.railway.app/blogs/b/${id}/c`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body:  JSON.stringify(tempComment)
        })
        const response = await rawResponse.json();
        if (response.Error) {
          popContact(response.Error,"red")
        } else if(response.message) {
          location.reload()
        }
    }
  } else {
    location.href = "./login.html"
  }

}
async function displayComments(id) {
  com = document.getElementById("com")
  
  const url = `https://my-brand-production.up.railway.app/blogs/b/${id}/c`
  const data= await fetch(url);
  var comment = await data.json(); 
  var comments =comment.Comments
  let output = " <div class=\"comment\">"  + " <div class=\"com-name\"> " + "</div> "
          + " <div class=\"com-content\"> " + "</div> " +
          "<div class=\"com-date\">09/01/2023</div>" + " </div>"
  if (comments.length < 1) {
    output = "No Comments"
  } else {
    
  }
  for(let i = 0; i < comments.length; i++)
  {
    const userUrl = `https://my-brand-production.up.railway.app/users/u/${comments[i]._userId}`
    const userdata= await fetch(userUrl);
    var userdetails = await userdata.json();
    var user = userdetails.data
    output += " <div class=\"comment\">"  + " <div class=\"com-name\"> "+ "<img src="+ user.imageUrl + " alt=\"image \">" + user.username +  "</div> "
    + " <div class=\"com-content\"> " + comments[i].comment + "</div> " +
    "<div class=\"com-date\">" + "" + "</div> </div>"
  }
  com.innerHTML = output;
  
}
async function getLikes(x) {
  if (wow === true) {
    const token = localStorage.getItem("cooltoken")
    const rawResponse = await fetch(`https://my-brand-production.up.railway.app/blogs/b/${x}/like`, {
      method: 'PUT',
      headers: {
      'Authorization' : `Bearer ${token}`
    }
    }).then(res => location.reload() );
    const content = await rawResponse.json();
    
    if (content.Error) {
      popContact(content.Error,"red")
    } else if(content.message) {
      popContact(content.message ,"green")
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
  if (wow === true && ano.admin === true) {

  }
  else {
    const link = "../login.html"
    window.location.href = link
  }
}
function toDashButton() {
  const dashbutton = document.getElementById("dashbutton")
  const ano = JSON.parse(window.localStorage.getItem("tempLog"))
  if (wow === true && ano.admin == true) {
    dashbutton.style.display = "block"
  }
  else {
    dashbutton.style.display = "none"
  }
}
/**---------------------------Changing The user profile ----------------------------------- */
async function changeusername() {
  const token = localStorage.getItem("cooltoken")
  const username = {
    username: document.getElementsByName("username")[0].value
  }
  const rawResponse = await fetch(`https://my-brand-production.up.railway.app/users/edit/username`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body:  JSON.stringify(username)
    })
    const response = await rawResponse.json();
  console.log(username)
    if (response.Error) {
      popContact(response.Error,"red")
    } else if(response.message) {
      const word = ", changes will be applicable on next login.👍"
      popContact(`${response.message} ${word}`,"green")
    }
}
async function changepassword() {
  const token = localStorage.getItem("cooltoken")
  const password = {
    password: document.getElementsByName("password")[0].value
  }
  const rawResponse = await fetch(`https://my-brand-production.up.railway.app/users/edit/password`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body:  JSON.stringify(password)
    })
    const response = await rawResponse.json();
    if (response.Error) {
      popContact(response.Error,"red")
    } else if(response.message) {
      const word = ", changes will be applicable on next login.👍"
      popContact(`${response.message} ${word}`,"green")
    }
}
async function changeprofilepic() {
  const token = localStorage.getItem("cooltoken")
  const image = document.getElementById("image")
  var data = new FormData()
    data.append('profile_pic', image.files[0])
  const rawResponse = await fetch(`https://my-brand-production.up.railway.app/users/edit/profilepic`, {
    method: 'PUT',
    body:  data,
    headers: {
      'Authorization': `Bearer ${token}`
    }
    })
    const response = await rawResponse.json();
    console.log(image)
    if (response.Error) {
      popContact(response.Error,"red")
    } else if(response.message) {
      const word = ", changes will be applicable on next login.👍"
      popContact(`${response.message} ${word}`,"green")
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
    const x = "userDelete("+ "'"+ users[i].id+"'" + ")"
    deleteButton.setAttribute("onclick", x)
    tdimage.src = users[i].image;
    tr.appendChild(tdimage);
    tr.appendChild(tdname);
    tr.appendChild(tdemail);
    tr.appendChild(deleteButton);
    table.appendChild(tr);
    tdname.innerText = users[i].name;
    tdemail.innerText = users[i].id;
  }
}
function userDelete(id) {
  const users = JSON.parse(window.localStorage.getItem("Users"))
  for(var i = 0; i <= users.length - 1; i++){
    if(users[i].id == id){
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
async function countLikes() {
  const url = "https://my-brand-production.up.railway.app/blogs"

  const data= await fetch(url);
  var blogs = await data.json();
  const Blogs = blogs.Blogs
  let likes = 0

  for (let i = 0; i < Blogs.length; i++) {
    likes = likes + Blogs[i].liked.length
  }
  document.getElementById("likes").innerHTML = `${likes} Total Likes`
}
async function countComments() {
  const url = "https://my-brand-production.up.railway.app/blogs"
  const data= await fetch(url);
  var blogs = await data.json();
  const Blogs = blogs.Blogs
  document.getElementById("blogscount").innerHTML = `${Blogs.length} Total Blogs`
}
async function countUsers() {
  const token = localStorage.getItem("cooltoken")
  const url = "https://my-brand-production.up.railway.app/users"
  const data= await fetch(url,{
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  var users = await data.json();
  const Users = users.Users
  document.getElementById("visits").innerHTML = `${Users.length} Users`
}
async function countMessages() {
  const token = localStorage.getItem("cooltoken")
  const url = "https://my-brand-production.up.railway.app/messages"
  const data= await fetch(url,{
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  var msg = await data.json();
  const Msg = msg.Messages
  document.getElementById("msgcount").innerHTML = `${Msg.length} Message(s)`
}


