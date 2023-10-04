
getUser();
getpostuser();

// get user id
function getUserId(){
    const  urlParams=new URLSearchParams(window.location.search);
    const userId=urlParams.get("userid");
    return userId
    
}


// get user 
function getUser(){
  showLoader(true)
    const id=getUserId();
    
    axios.get(`${path}users/${id}`)
    .then(function (response) {

        const user=response.data.data;
        document.getElementById("profile-image").src=user.profile_image;
        document.getElementById("email-user").innerHTML=user.email;
        document.getElementById("name-user").innerHTML=user.name
        document.getElementById("username").innerHTML=user.username;
        document.getElementById("post-count").innerHTML=user.posts_count;
        document.getElementById("comment-count").innerHTML=user.comments_count;
        console.log(user)

    }).catch(() => {
      
    }
    ).finally(() => {
      showLoader(false);
    }
    )
}
// get posts that own this user
function getpostuser(){
  showLoader(true);
    const id=getUserId();
    axios.get(`${path}users/${id}/posts`)
    .then(function (response) {
   
        const posts=response.data.data;
        let card =''
 
   for (post of posts) {
       // let srcuser="./image/user/user-"+i+".jpg";
       // let srcpost="./image/posts/post-"+i+".jpg";

       let postTitle=" ";
       if(post.title!=null){
         postTitle=post.title;
       }
       let currentuser=GetCurrentUser();
       let Postismy=post.author.id==currentuser.id &&currentuser !=null ;
       let editButton=``
       let Deletebutton=``
       if(Postismy){
         editButton=` <button class="btn btn-secondary my-2 " style="float: right;"   onclick="editPostBtnClicked('${encodeURIComponent(JSON.stringify(post))}')">Edit</button>`
        Deletebutton=` <button class="btn btn-danger my-2 me-2 " style="float: right;" onclick="DeletePost(${post.id})">Delete</button>`

       }
       card =`
       <div class="card shadow" id=${post.id}>
               <div class="card-header">
                <span onclick="userClicked()"style="cursor:pointer;" >
                <img src=${post.author.profile_image} alt="" style="width: 50px ; height: 50px;" class="rounded-circle border border-3">
                <b > ${post.author.username}</b>
                </span>
                 ${editButton}
                 ${Deletebutton}
                 

               </div>
               <div class="card-body p-0" style="curser:pointer;"  onclick="postclicked(${post.id})">
                 <img src=${post.image} alt="" style="width: 100%; height: 400px;">
               <div class=" p-3">
               <h6 class="text-secondary mt-1 ">${post.created_at}</h6>
               <h5 class="">${postTitle}</h5>
               <p class="">${post.body}</p>
               <hr>
               <div class="">
                 <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                   <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                 </svg>
                 <span class="ms-2">${post.comments_count}</span>
                 <span class="ms-2" id="post-tages-${post.id}">
                

                 </span>
               </div>
               </div>
               </div>
             </div>
       `
       document.getElementById('posts-user').innerHTML+=card;
       const currentPstTage=`post-tages-${post.id}`
       document.getElementById(currentPstTage).innerHTML="";
       for(tage of post.tags){
         let tageContent=`
         <button class="btn btn-sm rounded-5"style="background-color:gray;color:white">${tage.name}</button>
         
         `
         document.getElementById(currentPstTage).innerHTML+=tageContent;
       }
       
   }


  

    }).catch((e) => {
      console.log(e)
    }
    ).finally(() => {
      showLoader(false);
    }
    )
}



