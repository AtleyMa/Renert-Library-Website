$(document).ready( function () {
    $('#bookList').DataTable();
} );

let books = []

$(".id").each(function() {
    books.push($(this).html().trim())
})

$(document).ready(function() {
    $('.books-apply').select2();
    $(".books-apply").val(books).trigger('change')
});

$("button.apply").click(function(e)
{
    let d = $('.books-apply').val();
    let id = $('.edit-tag').data("edit-tag-id");
    if (d.length == 0)
    {
        $('.bi-exclamation-triangle').removeClass('d-none')
    }
    if (d.length != 0)
    {
        $('.bi-exclamation-triangle').addClass('d-none')
    }
    $.ajax({
        type: "POST",
        url: "/applyBooks",
        data: {values: d, id: id},
        success: function(x)
        {
            bookTA = x
            $('#bookList').DataTable().destroy();
            $('#bookList tbody').remove()
            $('#bookList').DataTable().draw();
            for (let i = 0; i < d.length; i++)
            {
                let row = $("<tr>");
        
                let renIdTD = $("<td>").appendTo(row)
                renIdTD.html("<a href='/book/" + d[i] + "' class='text-decoration-none text-info id'> " + d[i] + " </a>")
                let titleTD = $("<td>").appendTo(row)
                titleTD.html("<a href='/book/" + d[i] + "' class='text-decoration-none text-info'>" + bookTA[i]['title'] + "</a>")
                let authorTD = $("<td>").appendTo(row)
                authorTD.html("<a href='/author/" + bookTA[i]['author'] + "' class='text-decoration-none text-info'> " + bookTA[i]['author'] + " </a>")
                let trashTD = $("<td>").appendTo(row)
                trashTD.addClass("trash-book")
                trashTD.attr('data-ren-id', d[i])
                trashTD.html("<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' class='bi bi-trash3 text-danger' viewBox='0 0 16 16'><path d='M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z'/></svg>")
                trashTD.click(del);
                trashTD.mouseenter(function (e)
                {
                    $(e.currentTarget).children().attr("width", 25)
                    $(e.currentTarget).children().attr("height", 25)
                }).mouseleave( function(e)
                {
                    $(e.currentTarget).children().attr("width", 20)
                    $(e.currentTarget).children().attr("height", 20)
                })
                
                $('#bookList').DataTable().destroy();
                $("#bookList tbody").prepend(row[0])
                $('#bookList').DataTable().draw();
            }
            $(".applied-book-alert").fadeOut(1)
                $(".applied-book-alert").fadeIn(1)
                $(".applied-book-alert")[0].classList.remove("d-none");
                setTimeout( ()=>{
                $(".applied-book-alert").fadeOut( ()=>{
                $(".applied-book-alert")[0].classList.add("d-none")
                });
                }, 5000)
        },
        error: function(x)
        {
            console.log("Ajax failed to apply tags to the book")
        }
    })
}
)

function edit(e)
{
    let curr = $(e.currentTarget);
    let id = curr.data("edit-tag-id");
    $.ajax({
        success: function(x)
            {
                curr[0].outerHTML = "<a href='' class='text-decoration-none text-success text-end fs-4 apply-tag' onclick='return false;' data-apply-tag-id='" + id + "'>Save and Apply</a>"
                $(".name").replaceWith("<h1 class='my-3 col-6 p-0 ms-3 name'><input type='text' class='form-control form-control-lg' value='" + $.trim($(".name").text()) + "'></h1>")
                
                $("a.apply-tag").click( function(e)
                {
                let curr = $(e.currentTarget);
                let id = curr.data("apply-tag-id");
                let tagNameVal = $(".name input").val();
                $.ajax({
                    type : "POST",
                    url: "/applyTagName/" + String(id),
                    data: {val1: tagNameVal},
                    success: function(x)
                    {
                        $("[data-apply-tag-id=" + (id) + "]").replaceWith("<a href='' class='text-decoration-none text-primary text-end fs-4 edit-tag' data-edit-tag-id='" + id + "'>Edit Tag Name</a>")
                        $(".name").replaceWith("<h1 class='my-3 col-6 p-0 ms-3 name'>" + tagNameVal + "</h1>")
                        
                        $("[data-edit-tag-id=" + (id) + "]").click(edit)
                        
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
                        console.log("Applying edits to the tag name was unsuccesful");
                    }})
                }
                );
                    },
                error: function(x)
                    {
                        console.log("Editing the tag name was unsuccesful");
                    }})
}

$("a.edit-tag").click(edit);

function descEdit(e)
{
    let curr = $(e.currentTarget);
    let row = curr.parent()
    let id = curr.data("edit-desc-id");
    $.ajax({
        success: function(x)
            {
                curr[0].outerHTML = "<td class='apply-tag' data-apply-tag-id='" + id + "'><svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' class='bi bi-check2-all, text-success' viewBox='0 0 16 16'><path d='M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z'/><path d='m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708z'/></svg>"
                row[0].children[1].outerHTML = "<td><input type='text' class='form-control' value='" + row[0].children[1].innerHTML.trim() + "'></td>"
                
                $("td.apply-tag").click( function(e)
                {
                let curr = $(e.currentTarget);
                let row = curr.parent();
                let id = curr.data("apply-tag-id");
                let tagDescVal = row[0].children[1].children[0].value;
                $.ajax({
                    type : "POST",
                    url: "/applyTagDesc/" + String(id),
                    data: {val1: tagDescVal},
                    success: function(x)
                    {
                        $("[data-apply-tag-id=" + (id) + "]").replaceWith("<td class='edit-tag' data-edit-desc-id='" + id + "'><svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' class='bi bi-pencil-square text-primary' viewBox='0 0 16 16'><path d='M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z'/><path fill-rule='evenodd' d='M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z'/></svg></td>")
                        row[0].children[1].outerHTML = "<td class=''> " + tagDescVal + "</td>"
                        
                        $("[data-edit-desc-id=" + (id) + "]").click(descEdit)
                        
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
                        console.log("Applying edits to the tag description was unsuccesful");
                    }})
                }
                );
                    },
                error: function(x)
                    {
                        console.log("Editing the tag description was unsuccesful");
                    }})
}

$("td.edit-tag").click(descEdit);

$("a.undo-edit-btn").click(function(e)
{
    let editedTag;
    $.ajax({
        url: "/getEditedTag",
        success: function(x)
        {
            editedTag = x
            let curr = $("td [data-edit-desc-id=" + (editedTag[2]) + "]")
            let row = $(".desc-row")
            $.ajax({
                url: "/undoTagEdit",
                success: function(x)
                    {
                        $(".name").replaceWith("<h1 class='my-3 col-6 p-0 ms-3 name'>" + editedTag[0] + "</h1>")
                        row[0].children[1].innerHTML = editedTag[1]
                        
                        $(".applied-alert").fadeOut(1)
                        $(".undone-edit-alert").removeClass("d-none")
                        $(".undone-edit-alert").fadeIn(1)
                        setTimeout( ()=>{ $(".undone-edit-alert").fadeOut(1000); }, 5000)
                    },
                error: function(x)
                    {
                        console.log("Undoing tag edits was unsuccesful");
                    }})
        },
        error: function(x)
        {
            console.log("Ajax failed to retrieve data from the server")
        }
    })
}
)

function del(e)
{
    let curr = $(e.currentTarget);
    let row = curr.parent()
    let id = curr.data("ren-id");
    let tagId = $(".edit-tag").data("edit-tag-id")
    $.ajax({
        url: "/delBookFromTag/" + String(id) + "/" + String(tagId),
        success: function(x)
            {
                let len = row[0].children.length
                for (let i = 0; i < len; i++)
                {
                    row[0].children[i].classList.add("bg-danger");
                }
                $(row[0]).fadeOut(5000);
                setTimeout(function() {
                    $('#bookList').DataTable().destroy();
                    $(row[0]).remove()
                    $('#bookList').DataTable().draw();
                    if (! $("#bookList").DataTable().data().any())
                    {
                        $('.bi-exclamation-triangle').removeClass('d-none')
                    }
                    books = []
                    $(".id").each(function() {
                    books.push($(this).html().trim())
                    })
                    console.log(books)
                    $(".books-apply").val(books).trigger('change')
                    console.log($(".books-apply").val())
                }, 5000)

                $(".undone-alert").fadeOut(1)
                $(".deleted-alert").fadeIn(1)
                $(".deleted-alert")[0].classList.remove("d-none");
                setTimeout( ()=>{
                $(".deleted-alert").fadeOut( ()=>{
                $(".deleted-alert")[0].classList.add("d-none")
                });
                }, 3000)
            },
        error: function(x)
            {
                console.log("Deleting the tag from the book was unsuccesful");
            }})
}

$("td.trash-book").click(del);

$("a.undo-btn").click( function(e)
{
    let deletedBook;
    $.ajax({
        url: "/getBookWithTag",
        success: function(x)
        {
            deletedBook = x
            $.ajax({
                url: "/undoBookDelFromTag",
                success: function(x)
                    {
                        let row = $("<tr>");
        
                        let renIdTD = $("<td>").appendTo(row)
                        renIdTD.html("<a href='/book/" + String(deletedBook['renert_id']) + "' class='text-decoration-none text-info id'> " + String(deletedBook['renert_id']) + " </a>")
                        let titleTD = $("<td>").appendTo(row)
                        titleTD.html("<a href='/book/" + String(deletedBook['renert_id']) + "' class='text-decoration-none text-info'>" + String(deletedBook['title']) + "</a>")
                        let authorTD = $("<td>").appendTo(row)
                        authorTD.html("<a href='/author/" + String(deletedBook['author']) + "' class='text-decoration-none text-info'> " + String(deletedBook['author']) + " </a>")
                        let trashTD = $("<td>").appendTo(row)
                        trashTD.addClass("trash-book")
                        trashTD.attr('data-ren-id', deletedBook['renert_id'])
                        trashTD.html("<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' class='bi bi-trash3 text-danger' viewBox='0 0 16 16'><path d='M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z'/></svg>")
                        trashTD.click(del);
                        trashTD.mouseenter(function (e)
                        {
                            $(e.currentTarget).children().attr("width", 25)
                            $(e.currentTarget).children().attr("height", 25)
                        }).mouseleave( function(e)
                        {
                            $(e.currentTarget).children().attr("width", 20)
                            $(e.currentTarget).children().attr("height", 20)
                        })
                        
                        $('#bookList').DataTable().destroy();
                        $("#bookList tbody").prepend(row[0])
                        $('#bookList').DataTable().draw();
                        if ($("#bookList").DataTable().data().any())
                        {
                            $('.bi-exclamation-triangle').addClass('d-none')
                        }
                        books = []
                        $(".id").each(function() {
                        books.push($(this).html().trim())
                        })
                        $(".books-apply").val(books).trigger('change')
                        
                        $(".deleted-alert").fadeOut(1)
                        $(".undone-alert").removeClass("d-none")
                        $(".undone-alert").fadeIn(1)
                        setTimeout( ()=>{ $(".undone-alert").fadeOut(1000); }, 5000)
                    },
                error: function(x)
                    {
                        console.log("Undoing book deletion from tag was unsuccesful");
                    }})
        },
        error: function(x)
        {
            console.log("Ajax failed to retrieve data from the server")
        }
    })
}
);

$("td.trash-book").mouseenter(function (e)
{
    $(e.currentTarget).children().attr("width", 25)
    $(e.currentTarget).children().attr("height", 25)
}).mouseleave( function(e)
{
    $(e.currentTarget).children().attr("width", 20)
    $(e.currentTarget).children().attr("height", 20)
})

$("td.edit-tag").mouseenter(function (e)
{
    $(e.currentTarget).children().attr("width", 25)
    $(e.currentTarget).children().attr("height", 25)
}).mouseleave( function(e)
{
    $(e.currentTarget).children().attr("width", 20)
    $(e.currentTarget).children().attr("height", 20)
})