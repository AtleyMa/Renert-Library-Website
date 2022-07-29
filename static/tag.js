$(document).ready( function () {
    $('#bookList').DataTable();
} );

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