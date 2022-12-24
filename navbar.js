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