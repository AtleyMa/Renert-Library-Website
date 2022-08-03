if (document.referrer.toString().includes("bookDelete"))
{
    document.getElementsByClassName("deleted-alert")[0].classList.remove("d-none");
    setTimeout( ()=>{
        $(".deleted-alert").fadeOut( ()=>{
            document.getElementsByClassName("deleted-alert")[0].classList.add("d-none")
        });
    }, 6000)
}

if (document.referrer.toString().includes("undoBookDelete"))
{
    document.getElementsByClassName("undone-alert")[0].classList.remove("d-none");
    setTimeout( ()=>{
        $(".undone-alert").fadeOut( ()=>{
            document.getElementsByClassName("undone-alert")[0].classList.add("d-none")
        });
    }, 6000)
}

$("td.edit-book").mouseenter(function (e)
{
    $(e.currentTarget).children().attr("width", 25)
    $(e.currentTarget).children().attr("height", 25)
}).mouseleave( function(e)
{
    $(e.currentTarget).children().attr("width", 20)
    $(e.currentTarget).children().attr("height", 20)
})

$("td.trash-book").mouseenter(function (e)
{
    $(e.currentTarget).children().attr("width", 25)
    $(e.currentTarget).children().attr("height", 25)
}).mouseleave( function(e)
{
    $(e.currentTarget).children().attr("width", 20)
    $(e.currentTarget).children().attr("height", 20)
})

$(document).ready( function() {
    $.ajax({
        url: "/loadRestOfBooksTags",
        success: function(x)
        {
            all = x
            $("#bookList").DataTable().destroy()
            $("#bookList").DataTable().rows().remove()
            for (let i = 0; i < all[0].length; i++)
            {
                if (all[1].includes(all[0][i]['id']))
                {
                    tr = `<tr>
                    <td style="background-color: #ffffcc">
                        <a href="/book/` + all[0][i]['renert_id'] + `" class="text-decoration-none text-info">` + all[0][i]['renert_id'] + `</a>
                    </td>
                    <td style="background-color: #ffffcc">
                        <a href="/book/` + all[0][i]['renert_id'] + `" class="text-decoration-none text-info">` + all[0][i]['title'] + `</a>
                    </td>
                    <td style="background-color: #ffffcc">
                        <a href="/author/` + all[0][i]['author'] + `" class="text-decoration-none text-info"> ` + all[0][i]['author'] + ` </a>
                    </td>
                    <td class="trash-book" data-ren-id="` + all[0][i]['renert_id'] + `" style="background-color: #ffffcc">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3 text-danger" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                        </svg>
                    </td>
                    <td class="edit-book" data-edit-ren-id="` + all[0][i]['renert_id'] + `" style="background-color: #ffffcc">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square text-primary" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                        </svg>
                    </td>
                    </tr>`
                }
                else
                {
                    tr = `<tr>
                    <td>
                        <a href="/book/` + all[0][i]['renert_id'] + `" class="text-decoration-none text-info">` + all[0][i]['renert_id'] + `</a>
                    </td>
                    <td>
                        <a href="/book/` + all[0][i]['renert_id'] + `" class="text-decoration-none text-info">` + all[0][i]['title'] + `</a>
                    </td>
                    <td>
                        <a href="/author/` + all[0][i]['author'] + `" class="text-decoration-none text-info"> ` + all[0][i]['author'] + ` </a>
                    </td>
                    <td class="trash-book" data-ren-id="` + all[0][i]['renert_id'] + `">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3 text-danger" viewBox="0 0 16 16">
                            <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                        </svg>
                    </td>
                    <td class="edit-book" data-edit-ren-id="` + all[0][i]['renert_id'] + `">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square text-primary" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                        </svg>
                    </td>
                    </tr>`
                }
                $("#bookList").DataTable().row.add($(tr))
            }
            $("#bookList").DataTable().draw()
            $("#bookList").DataTable().rows().every( function(i)
            {
                let trashCell = $("#bookList").DataTable().cell(i, 3).node()
                let editCell = $("#bookList").DataTable().cell(i, 4).node()
                $(trashCell).mouseenter(function (e)
                {
                    $(this).children().attr("width", 25)
                    $(this).children().attr("height", 25)
                }).mouseleave( function(e)
                {
                    $(this).children().attr("width", 20)
                    $(this).children().attr("height", 20)
                })
                $(editCell).mouseenter(function (e)
                {
                    $(this).children().attr("width", 25)
                    $(this).children().attr("height", 25)
                }).mouseleave( function(e)
                {
                    $(this).children().attr("width", 20)
                    $(this).children().attr("height", 20)
                })
                $(trashCell).click(del);
                $(editCell).click(edit);
            })
        },
        error: function(x)
        {
            console.log("Ajax failed to load the rest of the books")
        }
    })
})

function del(e)
{
    let curr = $(e.currentTarget);
    let row = curr.parent()
    let id = curr.data("ren-id");
    $.ajax({
        url: "/delBook/" + String(id),
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
                }, 5000)

                $(".deleted-alert").fadeIn(1)
                $(".deleted-alert").removeClass("d-none");
                setTimeout( ()=>{
                $(".deleted-alert").fadeOut( ()=>{
                $(".deleted-alert").addClass("d-none")
                });
                }, 3000)
            },
        error: function(x)
            {
                console.log("Deleting the book was unsuccesful");
            }})
}

$("td.trash-book").click(del);

$("a.undo-btn").click( function(e)
{
    let deletedBook;
    $.ajax({
        url: "/getBook",
        success: function(x)
        {
            deletedBook = x
            $.ajax({
                url: "/undoBookDel",
                success: function(x)
                    {
                        let row = $("<tr>");
        
                        let renIdTD = $("<td>").appendTo(row)
                        renIdTD.html("<a href='/book/" + String(deletedBook['renert_id']) + "' class='text-decoration-none text-info'> " + String(deletedBook['renert_id']) + " </a>")
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
                        let editTD = $("<td>").appendTo(row)
                        editTD.addClass("edit-book");
                        editTD.attr('data-edit-ren-id', deletedBook['renert_id']);
                        editTD.html("<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' class='bi bi-pencil-square text-primary' viewBox='0 0 16 16'><path d='M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z'/><path fill-rule='evenodd' d='M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z'/></svg>")
                        editTD.click(edit)
                        editTD.mouseenter(function (e)
                        {
                            $(e.currentTarget).children().attr("width", 25)
                            $(e.currentTarget).children().attr("height", 25)
                        }).mouseleave( function(e)
                        {
                            $(e.currentTarget).children().attr("width", 20)
                            $(e.currentTarget).children().attr("height", 20)
                        })
                        
                        $("[data-ren-id=" + deletedBook['renert_id'] + "]").fadeOut(1);
                        $('#bookList').DataTable().destroy();
                        $("#bookList tbody").prepend(row[0])
                        $('#bookList').DataTable().draw();
                        
                        $(".deleted-alert").fadeOut(1)
                        $(".undone-alert").removeClass("d-none")
                        $(".undone-alert").fadeIn(1)
                        setTimeout( ()=>{ $(".undone-alert").fadeOut(1000); }, 5000)
                    },
                error: function(x)
                    {
                        console.log("Undoing book deletion was unsuccesful");
                    }})
        },
        error: function(x)
        {
            console.log("Ajax failed to retrieve data from the server")
        }
    })
}
);

function edit(e)
{
    let curr = $(e.currentTarget);
    let row = curr.parent()
    let id = curr.data("edit-ren-id");
    $.ajax({
        success: function(x)
            {
                $("[data-edit-ren-id=" + (id) + "]").replaceWith("<td class='apply-book' data-apply-ren-id='" + id + "'><svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' class='bi bi-check2-all, text-success' viewBox='0 0 16 16'><path d='M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z'/><path d='m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708z'/></svg>")
                row[0].children[1].outerHTML = "<td><input type='text' class='form-control' value='" + row[0].children[1].children[0].innerHTML.trim() + "'></td>"
                row[0].children[2].outerHTML = "<td><input type='text' class='form-control' value='" + row[0].children[2].children[0].innerHTML.trim() + "'></td>"
                $("td.apply-book").click( function(e)
                {
                let curr = $(e.currentTarget);
                let row = curr.parent();
                let id = curr.data("apply-ren-id");
                let bookTitleVal = row[0].children[1].children[0].value;
                let bookAuthorVal = row[0].children[2].children[0].value;
                $.ajax({
                    type : "POST",
                url: "/applyBook/" + String(id),
                data: {val1: bookTitleVal, val2: bookAuthorVal},
                success: function(x)
                    {
                        $("[data-apply-ren-id=" + (id) + "]").replaceWith("<td class='edit-book' data-edit-ren-id='" + id + "'><svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' class='bi bi-pencil-square text-primary' viewBox='0 0 16 16'><path d='M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z'/><path fill-rule='evenodd' d='M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z'/></svg></td>")
                        row[0].children[1].outerHTML = "<td class=''><a href='/book/" + id + "' class='text-decoration-none text-info'> " + bookTitleVal + " </a></td>"
                        row[0].children[2].outerHTML = "<td class=''><a href='/author/" + row[0].children[2].children[0].innerHTML + "' class='text-decoration-none text-info'> " + bookAuthorVal + " </a></td>"
                        
                        $("[data-edit-ren-id=" + (id) + "]").click(edit)
                        $("[data-edit-ren-id=" + id + "]").mouseenter(function (e)
                        {
                            $(e.currentTarget).children().attr("width", 25)
                            $(e.currentTarget).children().attr("height", 25)
                        }).mouseleave( function(e)
                        {
                            $(e.currentTarget).children().attr("width", 20)
                            $(e.currentTarget).children().attr("height", 20)
                        })
                        
                        $(".undone-apply-alert").fadeOut(1)
                        $(".applied-alert").fadeIn(1)
                        $(".applied-alert").removeClass("d-none");
                        setTimeout( ()=>{
                        $(".applied-alert").fadeOut( ()=>{
                        $(".applied-alert").addClass("d-none")
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

$("td.edit-book").click(edit);

$("a.undo-edit-btn").click(function(e)
{
    let editedBook;
    $.ajax({
        url: "/getEditedBook",
        success: function(x)
        {
            editedBook = x
            let curr = $("[data-edit-ren-id=" + (editedBook[2]) + "]")
            let row = curr.parent()
            $.ajax({
                url: "/undoBookEdit",
                success: function(x)
                    {
                        row[0].children[1].outerHTML = "<td class=''><a href='/book/" + editedBook[2] + "' class='text-decoration-none text-info'>" + editedBook[0] + "</a></td>"
                        row[0].children[2].outerHTML = "<td class=''><a href='/author/" + editedBook[1] + "' class='text-decoration-none text-info'>" + editedBook[1] + "</a></td>"
                        
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