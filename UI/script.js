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
      location.href = "./dashboard/dashboard.html"
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
  const contentx = quill.root.innerHTML
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
      data.append('content', contentx)
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
function editBlog(id) {
  let Bloge = JSON.parse(window.localStorage.getItem("Blogs"))
  var idx = Bloge.findIndex(function(item, i){
    return item._id == id
  });
  const title = document.getElementById('title').value
  const image = window.localStorage.getItem("tempImage") || Bloge[idx].image
  const content = quill.root.innerHTML
  //-----------Form Validation----------------
  if (title === Bloge[idx].title && content === Bloge[idx].content && image === null ) {
    popContact("Nothing To Edit", "red")
  } else {
    if (title.length > 500) {
      popContact(" Title too Long ", "red")
    } else {
      const blogData = {
        _id: id,
        title: title,
        image: image,
        content: content,
        likeCount: Bloge[idx].likeCount,
        comments: Bloge[idx].comments,
        liked: Bloge[idx].liked,
        date: new Date().toLocaleDateString()
      }
      if (idx > -1) { // only splice array when item is found
        Bloge.splice(idx, 1); // 2nd parameter means remove one item only
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
    location.reload()
  }
}
async function addComment(id) {
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
        popContact(response.message ,"red")
      }
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
    const rawResponse = await fetch(`https://my-brand-production.up.railway.app/blogs/b/${id}/like`, {
      method: 'PUT',
      headers: {
      'Authorization' : `Bearer ${token}`
    }
    });
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
function changeUser() {
  let Users = JSON.parse(localStorage.getItem("Users") || "[]")
  const myemail = JSON.parse(window.localStorage.getItem("tempLog")).email;
  const myname = JSON.parse(localStorage.getItem("tempLog")).name;
  const myimage = JSON.parse(window.localStorage.getItem("tempLog")).image
  const mypassword = JSON.parse(window.localStorage.getItem("tempLog")).password
  const myid = JSON.parse(window.localStorage.getItem("tempLog")).id
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
      popContact("Old Password Is Wrong", "red")
    } else {
      if (password1.length < 5) {
        popContact("New Password is Too Short", "red")
      } else {
        const userData = {
            id: myid,
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
        function maintain() {
          const data = {
            id: myid,
            email: myemail,
            name: name,
            image: image,
            password: password1
          }
          localStorage.setItem("tempLog", JSON.stringify(data))
          location.reload();
        }
        popContact("Profile Changed.", "green")
        setTimeout( maintain() , 5000);
        
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
