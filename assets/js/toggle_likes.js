//create a class to toggle likes when a link is clicked , using ajax

class ToggleLike{
    constructor(toggleElement){
        this.toggler=toggleElement;
        this.toggleLike();
    }


    toggleLike(){

        $(this.toggler).click(function(e){
            e.preventDefault();

            let self=this;
            
            //new way of writing ajax, looks like promises
            $.ajax({
                type:'POST',
                url:$(self).attr('href')
            })
            .done(function(data){

                let likesCount=parseInt($(self).attr('data-likes'));

                console.log(likesCount);

                if(data.data.deleted==true){
                    likesCount-=1;
                }else{
                    likesCount+=1;
                }


                $(self).attr('data-likes',likesCount);
                $(self).html(`${likesCount} Likes`);
            })
            .fail(function(errData){
                console.log('Error in completin the request',err);
            });
        });
    }
}