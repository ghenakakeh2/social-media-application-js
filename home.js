
// ************************** request to get all posts and show it . *****************************

function getPosts(page=1,reload=true){
  showLoader(true);
    axios.get(`${path}posts?limit=5&page=${page}`)
    .then(function (response) {
      // handle success
      lastPage=response.data.meta.last_page;
      let card =''
      const data=response.data.data;
      if(reload){
        document.getElementById('posts').innerHTML="";
      }
      console.log(response.data.data);
      console.log(data.length)
      for (post of data) {
          // let srcuser="./image/user/user-"+i+".jpg";
          // let srcpost="./image/posts/post-"+i+".jpg";
  
          let postTitle=" ";
          if(post.title!=null){
            postTitle=post.title;
          }
          let currentuser=GetCurrentUser()
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
                   <span onclick="userClicked(${post.author.id})"style="cursor:pointer;" >
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
          document.getElementById('posts').innerHTML+=card;
          const currentPstTage=`post-tages-${post.id}`
          document.getElementById(currentPstTage).innerHTML="";
          for(tage of post.tags){
            console.log(tage.name);
            let tageContent=`
            <button class="btn btn-sm rounded-5"style="background-color:gray;color:white">${tage.name}</button>
            
            `
            document.getElementById(currentPstTage).innerHTML+=tageContent;
          }
          
      }
  
     
    })
  
    .catch(function (error) {
      // handle error
      
    }).finally(() => {
      showLoader(false);
    }
    )
  }
  


    // ************************ Creat or update the post ****************************
 function CraetORupdatePost(){
  showLoader(true);
  let postId=document.getElementById("post-id-input").value;
  let isCreat= postId==null || postId =="";
  console.log(isCreat)

  let title=document.getElementById("post-title-input").value;
  let body=document.getElementById("Post-body-input").value;
  let image=document.getElementById("post-image-input").files[0];
  const formData=new FormData();
  formData.append("title",title);
  formData.append("body",body);
  formData.append("image",image);

 
  const token=localStorage.getItem("token");
  const headers={
    "Content-Type":"multipart/form-data",
    "authorization":`Bearer ${token}`
  }
  let url=``;
     if(isCreat){
      url=`${path}posts`
      axios.post(url,formData,{
        headers:headers
      })
      .then(function (response) {
       getPosts();
       alert("new post has been created ","success");
    
        const modal=document.getElementById("create-post-modal");
        const instance=bootstrap.Modal.getInstance(modal)
        instance.hide();
       console.log(response)
    getPosts(currentPage)

      
    
       
     
      }).catch(e=>{
        const massage = e.response.data.message;
          const modal=document.getElementById("create-post-modal");
          const instance=bootstrap.Modal.getInstance(modal)
          instance.hide();
          alert("successAlert",massage,"danger");
      }).finally(() => {
        showLoader(false);
      }
      )
    }
    else{
      url=`${path}posts/${postId}`
      formData.append("_method","put")
      axios.post(url,formData,{
        headers:headers
      })
      .then(function (response) {
       getPosts(currentPage);
       alert("edit post successfly ","success");
    
        const modal=document.getElementById("create-post-modal");
        const instance=bootstrap.Modal.getInstance(modal)
        instance.hide();
       console.log(response)
    getPosts(currentPage)

       
      
    
       
     
      }).catch(e=>{
        // const massage = e.response.data.message;
        //   const modal=document.getElementById("create-post-modal");
        //   const instance=bootstrap.Modal.getInstance(modal)
        //   instance.hide();
        //   alert("successAlert",massage,"danger");
      }).finally(() => {
        showLoader(false);
      }
      )
    }
  
 
 }
getPosts(currentPage);
// *************************Edit button*****************************
function editPostBtnClicked(objPost){

  let postClicked=JSON.parse(decodeURIComponent(objPost))
  document.getElementById("post-id-input").value=postClicked.id;
  document.getElementById("post-title-model").innerHTML="Edit post"
  document.getElementById("post-title-input").value=postClicked.title
  document.getElementById("Post-body-input").value=postClicked.body
  


 
  
  let postModal=new bootstrap.Modal(document.getElementById("create-post-modal"));
  postModal.toggle();
  

  
}
// **********************Add a new post ****************************
function addPstBtn(){
  document.getElementById("post-id-input").value="";
  document.getElementById("post-title-model").innerHTML="Creat A New Post"
  document.getElementById("post-title-input").value=""
  document.getElementById("Post-body-input").value=""
  


 
  
  let postModal=new bootstrap.Modal(document.getElementById("create-post-modal"));
  postModal.toggle();
  
}
// ************************Delete the post ******************************
function DeletePost(id){
  document.getElementById("idPostDelete").value=id;
  let postModal=new bootstrap.Modal(document.getElementById("delete-post-modal"));
  postModal.toggle();
  


}

function configDelete(){
  const idPost=document.getElementById("idPostDelete").value;
  const token=localStorage.getItem("token")
  let url=`${path}posts/${idPost}`
  const headers={
    
    "authorization":`Bearer ${token}`
  }
  axios.delete(url,{
    headers:headers
  })
  .then(function (response) {
    console.log(response)
    const modal=document.getElementById("delete-post-modal");
    const instance=bootstrap.Modal.getInstance(modal)
    instance.hide();
    getPosts(currentPage)
  

  })
}
function userClicked(userid){
 
  window.location=`./profile.html?userid=${userid}`
}