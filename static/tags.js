$(document).ready( function () {
    $('#tagList').DataTable();
} );

if (document.referrer.toString().includes("tagDelete"))
{
    document.getElementsByClassName("deleted-alert")[0].classList.remove("d-none");
    setTimeout( ()=>{
        $(".deleted-alert").fadeOut( ()=>{
            document.getElementsByClassName("deleted-alert")[0].classList.add("d-none")
        });
    }, 3000)
}

if (document.referrer.toString().includes("undoTagDelete"))
{
    document.getElementsByClassName("undone-alert")[0].classList.remove("d-none");
    setTimeout( ()=>{
        $(".undone-alert").fadeOut( ()=>{
            document.getElementsByClassName("undone-alert")[0].classList.add("d-none")
        });
    }, 3000)
}
function del(e)
{

    let curr = $(e.currentTarget);
    let row = curr.parent()
    let id = curr.data("tag-id");
    $.ajax({
        url: "/delTag/" + String(id),
        success: function(x)
            {
                let len = row[0].children.length
                for (let i = 0; i < len; i++)
                {
                    row[0].children[i].classList.add("bg-danger");
                }
                $(row[0]).fadeOut(5000);
                setTimeout(function() {
                    $('#tagList').DataTable().destroy();
                    $(row[0]).remove()
                    $('#tagList').DataTable().draw();
                }, 5000)

                $(".undone-alert").fadeOut(1)
                $(".deleted-alert").fadeIn(1)
                $(".deleted-alert")[0].classList.remove("d-none");
                setTimeout( ()=>{
                $(".deleted-alert").fadeOut( ()=>{
                $(".deleted-alert")[0].classList.add("d-none")
                });
                }, 5000)
            },
        error: function(x)
            {
                console.log("Deleting the tag was unsuccesful");
            }})
}


$("td.trash-tag").click(del);

$("a.undo-btn").click( function(e)
{
    let curr = $(e.currentTarget);
    let deletedTag;
    let deletedBookTags;
    $.ajax({
        url: "/getTags",
        success: function(x)
        {
            deletedTag = x
            $.ajax({
                url: "/undoTagDel",
                success: function(x)
                    {
                        let row = $("<tr>");
        
                        let idTD = $("<td>").appendTo(row)
                        idTD.html("<a href='/tag/" + deletedTag['tag_id'] + "' class='text-decoration-none text-info'>" + String(deletedTag['tag_id']) + "</a>")
                        let nameTD = $("<td>").appendTo(row)
                        nameTD.html("<a href='/tag/" + deletedTag['tag_id'] + "' class='text-decoration-none text-info'>" + String(deletedTag['tag_name']) + "</a>")
                        let descTD = $("<td>").appendTo(row)
                        descTD.html(String(deletedTag['description']))
                        let trashTD = $("<td>").appendTo(row)
                        trashTD.addClass("trash-tag")
                        trashTD.attr('data-tag-id', deletedTag['tag_id'])
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
                        editTD.addClass("edit-tag");
                        editTD.attr('data-edit-tag-id', deletedTag['tag_id']);
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
                        $('#tagList').DataTable().destroy();
                        $("#tagList tbody").prepend(row[0])
                        $('#tagList').DataTable().draw();
                        
                        $(".deleted-alert").fadeOut(1)
                        $(".undone-alert").removeClass("d-none")
                        $(".undone-alert").fadeIn(1)
                        setTimeout( ()=>{ $(".undone-alert").fadeOut(1000); }, 5000)
                    },
                error: function(x)
                    {
                        console.log("Undoing tag deletion was unsuccesful");
                    }})
        },
        error: function(x)
        {
            console.log("Ajax failed to retrieve data from the server")
        }
    })
}
);

$("td.trash-tag").mouseenter(function (e)
{
    $(e.currentTarget).children().attr("width", 25)
    $(e.currentTarget).children().attr("height", 25)
}).mouseleave( function(e)
{
    $(e.currentTarget).children().attr("width", 20)
    $(e.currentTarget).children().attr("height", 20)
})

function edit(e)
{
    let curr = $(e.currentTarget);
    let row = curr.parent()
    let id = curr.data("edit-tag-id");
    $.ajax({
        success: function(x)
            {
                $("[data-edit-tag-id=" + (id) + "]").replaceWith("<td class='apply-tag' data-apply-tag-id='" + id + "'><svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' class='bi bi-check2-all, text-success' viewBox='0 0 16 16'><path d='M12.354 4.354a.5.5 0 0 0-.708-.708L5 10.293 1.854 7.146a.5.5 0 1 0-.708.708l3.5 3.5a.5.5 0 0 0 .708 0l7-7zm-4.208 7-.896-.897.707-.707.543.543 6.646-6.647a.5.5 0 0 1 .708.708l-7 7a.5.5 0 0 1-.708 0z'/><path d='m5.354 7.146.896.897-.707.707-.897-.896a.5.5 0 1 1 .708-.708z'/></svg>")
                row[0].children[1].outerHTML = "<td><input type='text' class='form-control' value='" + row[0].children[1].children[0].innerHTML.trim() + "'></td>"
                row[0].children[2].outerHTML = "<td><input type='text' class='form-control' value='" + row[0].children[2].innerHTML.trim() + "'></td>"
                $("td.apply-tag").mouseenter(function (e)
                        {
                            $(e.currentTarget).children().attr("width", 25)
                            $(e.currentTarget).children().attr("height", 25)
                        }).mouseleave( function(e)
                        {
                            $(e.currentTarget).children().attr("width", 20)
                            $(e.currentTarget).children().attr("height", 20)
                        })
                $("td.apply-tag").click( function(e)
                {
                let curr = $(e.currentTarget);
                let row = curr.parent();
                let id = curr.data("apply-tag-id");
                let tagNameVal = row[0].children[1].children[0].value;
                let tagDescVal = row[0].children[2].children[0].value;
                $.ajax({
                    type : "POST",
                url: "/applyTag/" + String(id),
                data: {val1: tagNameVal, val2: tagDescVal},
                success: function(x)
                    {
                        $("[data-apply-tag-id=" + (id) + "]").replaceWith("<td class='edit-tag' data-edit-tag-id='" + id + "'><svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='currentColor' class='bi bi-pencil-square text-primary' viewBox='0 0 16 16'><path d='M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z'/><path fill-rule='evenodd' d='M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z'/></svg></td>")
                        row[0].children[1].outerHTML = "<td class=''><a href='/tag/" + id + "' class='text-decoration-none text-info'> " + tagNameVal + " </a></td>"
                        row[0].children[2].outerHTML = "<td class=''> " + tagDescVal + "</td>"
                        
                        $("[data-edit-tag-id=" + (id) + "]").click(edit)
                        $("[data-edit-tag-id=" + id + "]").mouseenter(function (e)
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
                        $(".applied-alert")[0].classList.remove("d-none");
                        setTimeout( ()=>{
                        $(".applied-alert").fadeOut( ()=>{
                        $(".applied-alert")[0].classList.add("d-none")
                        });
                        }, 5000)
                    },
                error: function(x)
                    {
                        console.log("Applying edits to the tag was unsuccesful");
                    }})
                }
                );
                    },
                error: function(x)
                    {
                        console.log("Editing the tag was unsuccesful");
                    }})
}

$("td.edit-tag").click(edit);

$("a.undo-edit-btn").click(function(e)
{
    let editedTag;
    $.ajax({
        url: "/getEditedTag",
        success: function(x)
        {
            editedTag = x
            let curr = $("[data-edit-tag-id=" + (editedTag[2]) + "]")
            let row = curr.parent()
            $.ajax({
                url: "/undoTagEdit",
                success: function(x)
                    {
                        row[0].children[1].outerHTML = "<td class=''><a href='/tag/" + editedTag[2] + "' class='text-decoration-none text-info'>" + editedTag[0] + "</a></td>"
                        row[0].children[2].innerHTML = editedTag[1]

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

$("td.edit-tag").mouseenter(function (e)
{
    $(e.currentTarget).children().attr("width", 25)
    $(e.currentTarget).children().attr("height", 25)
}).mouseleave( function(e)
{
    $(e.currentTarget).children().attr("width", 20)
    $(e.currentTarget).children().attr("height", 20)
})