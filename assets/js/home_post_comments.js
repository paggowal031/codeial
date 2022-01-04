// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX


class PostComments {
    
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId) {
        this.postId = postId;
        //console.log("@@@@@",postId);
        this.postContainer = $(`#post-${postId}`);
       // console.log("this.postContainer",this.postContainer);
        this.newCommentForm = $(`#post-${postId}-comments-form`);
       // console.log("this.newCommentForm",this.newCommentForm)
       // console.log("inside create")

        this.createComment(postId);
        
        let self = this;
       // console.log("self: ",self)
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function () {
            self.deleteComment($(this));
        });
    }


    createComment(postId) {
        let pSelf = this;
        this.newCommentForm.submit(function (e) {
            e.preventDefault();
            console.log("Inside Comment")
            let self = this;

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function (data) {
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    pSelf.deleteComment($('.delete-comment-button', newComment));

                    //enable the functionality of toggle like button on the new comment
                    new ToggleLike($(' .toggle-like-button',newComment));

                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
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


    newCommentDom(comment) {
        // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
        return $(`<li id="comment-${comment._id}">
        <p>
        <small>
            <form action="">
                <button type="submit" >
                 <i class="fas fa-eraser"></i>
                 <a class="delete-comment-button" href="/comments/destroy/${comment._id}">
                     Delete comment
                 </a>
                </button>
            </form>
        </small>   
        ${comment.content}
        <br>
        <small>
            ${comment.user.name}
        </small>

        <!--display the likes of this comment-->
        <small>
            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment" >
                      0 Likes
            </a>
        </small>
    </p>    
 
                </li>`);
    }


    deleteComment(deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted",
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
}    