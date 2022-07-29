$(document).ready( function () {
    $('#tagList').DataTable();
} );

function edit(e)
{
    let curr = $(e.currentTarget);
    let id = curr.data("edit-book-id");
    $.ajax({
        success: function(x)
            {
                curr[0].outerHTML = "<a href='' class='text-decoration-none text-success text-end fs-4 apply-book' onclick='return false;' data-apply-book-id='" + id + "'>Save and Apply</a>"
                $(".title").replaceWith("<h1 class='my-3 col-6 p-0 ms-3 title'><input type='text' class='form-control form-control-lg' value='" + $.trim($(".title").text()) + "'></h1>")
                $(".author").replaceWith("<a href='/author/" +$.trim($(".author").text()) + "' onclick='return false;' class='text-decoration-none text-info author'><h2 class='ms-3'><input type='text' class='form-control' value='" + $.trim($(".author").text()) + "'></h2></a>")

                $("a.apply-book").click( function(e)
                {
                let curr = $(e.currentTarget);
                let id = curr.data("apply-book-id");
                let bookTitleVal = $(".title input").val();
                let bookAuthorVal = $(".author input").val();
                $.ajax({
                    type : "POST",
                    url: "/applyBook/" + String(id),
                    data: {val1: bookTitleVal, val2: bookAuthorVal},
                    success: function(x)
                    {
                        $("[data-apply-book-id=" + (id) + "]").replaceWith("<a href='' onclick='return false;' class='text-decoration-none text-primary text-end fs-4 edit-book' data-edit-book-id='" + id + "'>Edit Book</a>")
                        $(".title").replaceWith("<h1 class='my-3 col-6 p-0 ms-3 title'>" + bookTitleVal + "</h1>")
                        $(".author").replaceWith("<a href='/author/" + bookAuthorVal + "' class='text-decoration-none text-info author'><h2 class='ms-3'>" + bookAuthorVal + "</h2></a>")
                        
                        $("[data-edit-book-id=" + (id) + "]").click(edit)
                        
                        $(".undone-apply-alert").fadeOut(1)
                        $(".applied-alert").fadeIn(1)
                        $(".applied-alert")[0].classList.remove("d-none");
                        setTimeout( ()=>{
                        $(".applied-alert").fadeOut( ()=>{
                        $(".applied-alert")[0].classList.add("d-none")
                        });
                        }, 5000)
                    },
                error: function(x)
                    {
                        console.log("Applying edits to the book was unsuccesful");
                    }})
                }
                );
                    },
                error: function(x)
                    {
                        console.log("Editing the book was unsuccesful");
                    }})
}

$("a.edit-book").click(edit);

$("a.undo-edit-btn").click(function(e)
{
    let editedBook;
    $.ajax({
        url: "/getEditedBook",
        success: function(x)
        {
            editedBook = x
            $.ajax({
                url: "/undoBookEdit",
                success: function(x)
                    {
                        $(".title").replaceWith("<h1 class='ms-3 title'>" + editedBook[0] + "</h1>")
                        $(".author").replaceWith("<a href='/author/" + editedBook[1] + "' class='text-decoration-none text-info author'><h2 class='ms-3'>" + editedBook[1] + "</h2></a>")
                        
                        $(".applied-alert").fadeOut(1)
                        $(".undone-edit-alert").removeClass("d-none")
                        $(".undone-edit-alert").fadeIn(1)
                        setTimeout( ()=>{ $(".undone-edit-alert").fadeOut(1000); }, 5000)
                    },
                error: function(x)
                    {
                        console.log("Undoing book edits was unsuccesful");
                    }})
        },
        error: function(x)
        {
            console.log("Ajax failed to retrieve data from the server")
        }
    })
}
)