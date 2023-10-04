

const path="https://tarmeezacademy.com/api/v1/";
let currentPage=1;
let lastPage=1;

// ****************** infinite scroll ***********************************
window.addEventListener("scroll",() => {
  
  const endOfPage=window.innerHeight+2 +window.pageYOffset >= document.body.scrollHeight;
  console.log(window.innerHeight ,window.pageYOffset,document.body.scrollHeight)

 if(endOfPage && currentPage < lastPage){
  currentPage =currentPage+1;

console.log()
  getPosts(currentPage,false);
 }
}
)






function postclicked(id){
  // document.getElementById(id).hrf="./postPage.html"
  window.location.href=`postPage.html?postId=${id}`
  axios.get(`${path}posts/${id}`)
  .then(function (response) {
    // handle success
    console.log(response)
  })
  
  // console.log(postsPage)
}


  //********************** login request************************
  function loginbuttonclicked(){
    let UserName=document.getElementById("user-name").value;
    let Password=document.getElementById("password-text").value;

    axios.post(`${path}login`, {
      username: UserName,
      password: Password
    })
    .then(function (response) {
      
      localStorage.setItem("token",response.data.token)
      localStorage.setItem("currentUser",JSON.stringify(response.data.user));
      const modal=document.getElementById("Login-modal");
      const instance=bootstrap.Modal.getInstance(modal)
      instance.hide();
     setupui();
     usernamepost=response.data.user.username;
     alert("Nice, Logged in successfully","success");


     
   
    })
    // .catch(function (error) {
    //   console.log(error);
    // });
    
  }
  


  //*******************register request**************************
  function registerbuttonclicked()
  {
    showLoader(true)
    const name=document.getElementById("register-name").value;
    const username=document.getElementById("register-user-name").value;
    const password=document.getElementById("register-password").value;
    const PersonalPhoto=document.getElementById("personalImage-register-input").files[0];

    const forrmData=new FormData();
    forrmData.append("username",username);
    forrmData.append("password",password);
    forrmData.append("name",name);
    forrmData.append("image",PersonalPhoto);

    
    const url=`${path}register`
    axios.post(url,forrmData)
    .then(function (response) {
      
      localStorage.setItem("token",response.data.token)
      localStorage.setItem("currentUser",JSON.stringify(response.data.user));
      alert("nice,successfully registered " ,"success");

      const modal=document.getElementById("register-modal");
      const instance=bootstrap.Modal.getInstance(modal)
      instance.hide();
      setupui()
      console.log(response)
      
     

    }).catch((e) => {
      console.log(e)
    }
    ).finally(() => {
      showLoader(false);
    }
    )
    
  }


  //***************************** logout request********************************
  function Logout(){
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  setupui();
  alert("Signed out successfully!","danger");


  }
  

  //*************************************Alerts********************** */
  function alert(massage,typealert){
    const alertPlaceholder = document.getElementById("successAlert")
    const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
    `<div class="alert alert-${type} alert-dismissible" role="alert">`,
    `   <div>${message}</div>`,
    '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
    '</div>'
    ].join('');

    alertPlaceholder.append(wrapper);
}

  
    appendAlert(`${massage}`, `${typealert}`);
  setTimeout(() => {
  const alert = bootstrap.Alert.getOrCreateInstance('#successAlert')
  alert.close()
  }
  ,3000)
  }


  // setup ui
  function setupui(){
    const token=localStorage.getItem("token");
    const loginbutton=document.getElementById("loginbutton");
    const registerbtn=document.getElementById("registerbtn");
     const blusPostButton=document.getElementById("blusPost");
     const divLogOut=document.getElementById("log-out-div");
     const addComment=document.getElementById("add-comment");

     

    if(token==null){  //user is guest (not logged in)
     
     if(blusPostButton !=null){
      blusPostButton.style.display="none";


     }
     if(addComment !=null){
      addComment.style.display="none";
      

     }
     
      loginbutton.style.display="inline-block";
      registerbtn.style.display="inline-block";
      divLogOut.style.setProperty("display","none","important");



      
    }
    else{
      
      if(blusPostButton !=null){
      blusPostButton.style.display="inline-block"
        
  
       }
       if(addComment !=null){
        addComment.style.display="block";
        
  
       }
      loginbutton.style.display="none"
      registerbtn.style.display="none"
      divLogOut.style.setProperty("display","flex","important");
     const user=GetCurrentUser();

      document.getElementById("username-nav").innerHTML=user.username;
      document.getElementById("user-profile-image").src=user.profile_image;      ;
      
      




    }
  }
  function GetCurrentUser(){
    let user =null;
    let storgeuser=localStorage.getItem("currentUser");
    if (storgeuser!=null){
      user=JSON.parse(storgeuser);
      
      }
    return user;
  }


  // profile btn
  function profileClicked(){
     const userid=GetCurrentUser().id;
     window.location=`profile.html?userid=${userid}`

  }
  setupui();
 

 function showLoader(show=true){
  if(show){
    document.getElementById("loader").style.visibility= "visible";
  }
  else{
    document.getElementById("loader").style.visibility="hidden"

  }

 }