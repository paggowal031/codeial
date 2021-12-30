
{     
    
    // method to submit the form data for new post using AJAX
    let createPost = function () {

        let newPostForm = $('#new-post-form');

        newPostForm.submit(function (e) {

            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function (data) {
                    console.log("data",data)
                    let newPost = newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));

                
                    // call the create comment class
                    
                    new PostComments(data.data.post._id);

                    //enable the functionality of the toggle like button on the new post
                    new ToggleLike($(' .toggle-like-button',newPost));
                    

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function (error) {
                    console.log(error.responseText);
                }

            });
        });
    }


    // method to create a post in DOM

    let newPostDom = function (post) {
        console.log(post.user.name)
        return $(`
        <li id="post-${post._id}" class="li-post">
        <p>
            <button>
                <a href="/users/profile/${post.user._id}">
                    <img src="${post.user.avatar}" height="30px" width="30px" style="border-radius:25px;">
                    ${post.user.name}
                </a>
            </button>
        <div>
            ${post.content}
        </div>

        <!-- display the likes of this post  -->
        <small>
            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post" >
                        0 Likes
                        
            </a>
        </small>
    
    
        </p>
        <div class="post-comments">
          
                <form action="/comments/create" method="POST" id="new-comment-form">
                    <input type="text" name="content" placeholder="Add a comment..." required>
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Add Comment">
                </form>
    
             
    
                    <div class="post-comments-list">
                        <ul id="post-comments-${post._id}">
                          
                    </div>
        </div>
    
        
        <div id="delete-button-div">
        <small>
            <form  action="">
                <button type="submit" name="destroy-post" id="destroy-post" >
                    <i class="fas fa-eraser"></i>
                    <a class="delete-post-button" href="/posts/destroy/${post._id}">
                        Delete post
                    </a>
                </button>
            </form>
        </small>
    </div>
    
    </li>`)
    }


    // method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }

  // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
  let convertPostsToAjax = function(){
    $('#posts-list-container>ul>li').each(function(){
        let self = $(this);
        let deleteButton = $(' .delete-post-button', self);
        deletePost(deleteButton);

        // get the post's id by splitting the id attribute
        let postId = self.prop('id').split("-")[1];
       new  PostComments(postId);
    });
}



createPost();
convertPostsToAjax();
}