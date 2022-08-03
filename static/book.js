// Initialize DataTable()
$(document).ready( function () {
    $('#tagList').DataTable();
} );

let tags = []; // List of tags applied to book

$(".id").each(function() {
    tags.push($(this).html().trim());
});

// Initialize Select2 form
$(document).ready(function() {
    $('.tags-apply').select2();
    $(".tags-apply").val(tags).trigger('change');
});

// Ajax function to apply tags to a book
$("button.apply").click(function(e)
{
    let d = $('.tags-apply').val();
    let id = $('.edit-book').data("edit-book-id");
    if (d.length == 0)
    {
        $('.bi-exclamation-triangle').removeClass('d-none');
    }
    if (d.length != 0)
    {
        $('.bi-exclamation-triangle').addClass('d-none');
    }
    $.ajax({
        type: "POST",
        url: "/applyTags",
        data: {values: d, id: id},
        success: function(x)
        {
            tagNamesDescs = x;
            $('#tagList').DataTable().destroy();
            $('#tagList tbody').remove();
            $('#tagList').DataTable().draw();
            for (let i = 0; i < d.length; i++)
            {
                let row = $("<tr>");
            
                let idTD = $("<td>").appendTo(row);
                idTD.html("<a href='/tag/" + d[i] + "' class='text-decoration-none text-info id'>" + d[i] + "</a>");
                let nameTD = $("<td>").appendTo(row);
                nameTD.html("<a href='/tag/" + d[i] + "' class='text-decoration-none text-info'>" + tagNamesDescs[i]['tag_name'] + "</a>");
                let descTD = $("<td>").appendTo(row);
                descTD.html(String(tagNamesDescs[i]['description']));
                let trashTD = $("<td>").appendTo(row);
                trashTD.addClass("trash-tag");
                trashTD.attr('data-tag-id', d[i]);
                trashTD.html("<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' class='bi bi-trash3 text-danger' viewBox='0 0 16 16'><path d='M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z'/></svg>");
                trashTD.click(del);
                trashTD.mouseenter(function (e)
                {
                    $(e.currentTarget).children().attr("width", 25);
                    $(e.currentTarget).children().attr("height", 25);
                }).mouseleave( function(e)
                {
                    $(e.currentTarget).children().attr("width", 20);
                    $(e.currentTarget).children().attr("height", 20);
                })
                
                $('#tagList').DataTable().destroy();
                $("#tagList tbody").prepend(row[0]);
                $('#tagList').DataTable().draw();
            }
            $(".applied-tag-alert").fadeOut(1);
                $(".applied-tag-alert").fadeIn(1);
                $(".applied-tag-alert")[0].classList.remove("d-none");
                setTimeout( ()=>{
                $(".applied-tag-alert").fadeOut( ()=>{
                $(".applied-tag-alert")[0].classList.add("d-none");
                });
                }, 5000);
        },
        error: function(x)
        {
            console.log("Ajax failed to apply tags to the book");
        }
    })
}
)

// Ajax function to edit book title and author
function edit(e)
{
    let curr = $(e.currentTarget);
    let id = curr.data("edit-book-id");
    $.ajax({
        success: function(x)
            {
                curr[0].outerHTML = "<a href='' class='text-decoration-none text-success text-end fs-4 apply-book' onclick='return false;' data-apply-book-id='" + id + "'>Save and Apply</a>";
                $(".title").replaceWith("<h1 class='my-3 col-6 p-0 ms-3 title'><input type='text' class='form-control form-control-lg' value='" + $.trim($(".title").text()) + "'></h1>");
                $(".author").replaceWith("<a href='/author/" +$.trim($(".author").text()) + "' onclick='return false;' class='text-decoration-none text-info author'><h2 class='ms-3'><input type='text' class='form-control' value='" + $.trim($(".author").text()) + "'></h2></a>");

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
                        $("[data-apply-book-id=" + (id) + "]").replaceWith("<a href='' onclick='return false;' class='text-decoration-none text-primary text-end fs-4 edit-book' data-edit-book-id='" + id + "'>Edit Book</a>");
                        $(".title").replaceWith("<h1 class='my-3 col-6 p-0 ms-3 title'>" + bookTitleVal + "</h1>");
                        $(".author").replaceWith("<a href='/author/" + bookAuthorVal + "' class='text-decoration-none text-info author'><h2 class='ms-3'>" + bookAuthorVal + "</h2></a>");
                        
                        $("[data-edit-book-id=" + (id) + "]").click(edit);
                        
                        $(".undone-edit-alert").fadeOut(1);
                        $(".applied-alert").fadeIn(1);
                        $(".applied-alert").removeClass("d-none");
                        setTimeout( ()=>{
                        $(".applied-alert").fadeOut( ()=>{
                        $(".applied-alert").addClass("d-none");
                        });
                        }, 5000);
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

// Undo edits of book title and author
$("a.undo-edit-btn").click(function(e)
{
    let editedBook;
    $.ajax({
        url: "/getEditedBook",
        success: function(x)
        {
            editedBook = x;
            $.ajax({
                url: "/undoBookEdit",
                success: function(x)
                    {
                        $(".title").replaceWith("<h1 class='ms-3 title'>" + editedBook[0] + "</h1>");
                        $(".author").replaceWith("<a href='/author/" + editedBook[1] + "' class='text-decoration-none text-info author'><h2 class='ms-3'>" + editedBook[1] + "</h2></a>");
                        
                        $(".applied-alert").fadeOut(1);
                        $(".undone-edit-alert").removeClass("d-none");
                        $(".undone-edit-alert").fadeIn(1);
                        setTimeout( ()=>{ $(".undone-edit-alert").fadeOut(1000); }, 5000);
                    },
                error: function(x)
                    {
                        console.log("Undoing book edits was unsuccesful");
                    }})
        },
        error: function(x)
        {
            console.log("Ajax failed to retrieve data from the server");
        }
    })
}
)

// Ajax function to delete book and redirect librarian to Book Tags
function del(e)
{
    let curr = $(e.currentTarget);
    let row = curr.parent();
    let id = curr.data("tag-id");
    let renId = $(".edit-book").data("edit-book-id");
    $.ajax({
        url: "/delTagFromBook/" + String(id) + "/" + String(renId),
        success: function(x)
            {
                let len = row[0].children.length;
                for (let i = 0; i < len; i++)
                {
                    row[0].children[i].classList.add("bg-danger");
                }
                $(row[0]).fadeOut(5000);
                setTimeout(function() {
                    $('#tagList').DataTable().destroy();
                    $(row[0]).remove();
                    $('#tagList').DataTable().draw();
                    if (! $("#tagList").DataTable().data().any())
                    {
                        $('.bi-exclamation-triangle').removeClass('d-none');
                    }
                    tags = [];
                    $(".id").each(function() {
                    tags.push($(this).html().trim());
                    });
                    $(".tags-apply").val(tags).trigger('change');
                }, 5000);

                $(".undone-alert").fadeOut(1);
                $(".deleted-alert").fadeIn(1);
                $(".deleted-alert").removeClass("d-none");
                setTimeout( ()=>{
                $(".deleted-alert").fadeOut( ()=>{
                $(".deleted-alert").addClass("d-none");
                });
                }, 5000);
            },
        error: function(x)
            {
                console.log("Deleting the tag from the book was unsuccesful");
            }})
}


$("td.trash-tag").click(del);

// Undo deletion of book
$("a.undo-btn").click( function(e)
{
    let deletedTag;
    $.ajax({
        url: "/getTagsWithBook",
        success: function(x)
        {
            deletedTag = x;
            $.ajax({
                url: "/undoTagDelFromBook",
                success: function(x)
                    {
                        let row = $("<tr>");
        
                        let idTD = $("<td>").appendTo(row);
                        idTD.html("<a href='/tag/" + deletedTag['tag_id'] + "' class='text-decoration-none text-info id'>" + String(deletedTag['tag_id']) + "</a>");
                        let nameTD = $("<td>").appendTo(row);
                        nameTD.html("<a href='/tag/" + deletedTag['tag_id'] + "' class='text-decoration-none text-info'>" + String(deletedTag['tag_name']) + "</a>");
                        let descTD = $("<td>").appendTo(row);
                        descTD.html(String(deletedTag['description']));
                        let trashTD = $("<td>").appendTo(row);
                        trashTD.addClass("trash-tag");
                        trashTD.attr('data-tag-id', deletedTag['tag_id']);
                        trashTD.html("<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' class='bi bi-trash3 text-danger' viewBox='0 0 16 16'><path d='M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z'/></svg>");
                        trashTD.click(del);
                        trashTD.mouseenter(function (e)
                        {
                            $(e.currentTarget).children().attr("width", 25);
                            $(e.currentTarget).children().attr("height", 25);
                        }).mouseleave( function(e)
                        {
                            $(e.currentTarget).children().attr("width", 20);
                            $(e.currentTarget).children().attr("height", 20);
                        });
                        
                        $('#tagList').DataTable().destroy();
                        $("#tagList tbody").prepend(row[0]);
                        $('#tagList').DataTable().draw();
                        if ($("#tagList").DataTable().data().any())
                        {
                            $('.bi-exclamation-triangle').addClass('d-none');
                        }
                        tags = [];
                        $(".id").each(function() {
                        tags.push($(this).html().trim());
                        });
                        $(".tags-apply").val(tags).trigger('change');
                        
                        $(".deleted-alert").fadeOut(1);
                        $(".undone-alert").removeClass("d-none");
                        $(".undone-alert").fadeIn(1);
                        setTimeout( ()=>{ $(".undone-alert").fadeOut(1000); }, 5000);
                    },
                error: function(x)
                    {
                        console.log("Undoing tag deletion from book was unsuccesful");
                    }})
        },
        error: function(x)
        {
            console.log("Ajax failed to retrieve data from the server");
        }
    })
}
);

// Expand trash can icon when hover over it
$("td.trash-tag").mouseenter(function (e)
{
    $(e.currentTarget).children().attr("width", 25);
    $(e.currentTarget).children().attr("height", 25);
}).mouseleave( function(e)
{
    $(e.currentTarget).children().attr("width", 20);
    $(e.currentTarget).children().attr("height", 20);
});

$("td.edit-tag").click(edit);

// Expand edit icon when user hovers over it
$("td.edit-tag").mouseenter(function (e)
{
    $(e.currentTarget).children().attr("width", 25);
    $(e.currentTarget).children().attr("height", 25);
}).mouseleave( function(e)
{
    $(e.currentTarget).children().attr("width", 20);
    $(e.currentTarget).children().attr("height", 20);
});