let open = false;    
function toggleNav(){
  var myImage = document.getElementById('ig');
  myImage.onclick = function() {
    var mySrc = myImage.getAttribute('src');
    if(mySrc === './images/open.png') {
        myImage.setAttribute ('src','./images/close.png');
    } else {
        myImage.setAttribute ('src','./images/open.png');
    }
  if(open==false){
    navUl = document.getElementById("actions");
      navUl.style.display="block";
      //navUl.style.animation = 	"animation: slideInFromLeft .8s;"
      open = true;
    }else{
      navUl = document.getElementById("actions");
      //navUl.style.animation = 	"slide-out-left 0.5s cubic-bezier(0.550, 0.085, 0.680, 0.530) both"
      navUl.style.display="none";
      open = false; 
    }
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