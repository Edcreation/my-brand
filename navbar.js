let open = false;    
function toggleNav(){
  if(open==false){
      navUl = document.getElementById("actions");
      navUl.style.display="block";
      open = true;
  }else{
        navUl = document.getElementById("actions");
        navUl.style.display="none";
        open = false; 
  }
}
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