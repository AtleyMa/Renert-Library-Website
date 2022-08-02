$(document).ready( function () {
    $('#bookList').DataTable();
} );
let ogTable = [];
$(document).ready(function() {
    $('.tags-search').select2();
    ogTable = $("#bookList").DataTable().$("tr");
});

$(document).ready( function() {
    $.ajax({
        url: "/loadRestOfBooksBrowse",
        success: function(x)
        {
            all = x
            $("#bookList").DataTable().destroy()
            $("#bookList").DataTable().rows().remove()
            for (let i = 0; i < all.length; i++)
            {
                tr = `<tr>
                <td>
                    <a href="/book/` + all[i]['renert_id'] + `" class="text-decoration-none text-info">` + all[i]['renert_id'] + `</a>
                </td>
                <td>
                    <a href="/book/` + all[i]['renert_id'] + `" class="text-decoration-none text-info">` + all[i]['title'] + `</a>
                </td>
                <td>
                    <a href="/author/` + all[i]['author'] + `" class="text-decoration-none text-info"> ` + all[i]['author'] + ` </a>
                </td>
                <td class="trash-book" data-ren-id="` + all[i]['renert_id'] + `">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3 text-danger" viewBox="0 0 16 16">
                        <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"/>
                    </svg>
                </td>
                <td class="edit-book" data-edit-ren-id="` + all[i]['renert_id'] + `">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-pencil-square text-primary" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                    </svg>
                </td>
                </tr>`
                $("#bookList").DataTable().row.add($(tr))
            }
            $("#bookList").DataTable().draw()
        },
        error: function(x)
        {
            console.log("Ajax failed to load the rest of the books")
        }
    })
})

$("button.show").click(function(e)
{
    $("#bookList").DataTable().destroy();
    $("#bookList").DataTable().rows().remove()
    for (let a = 0; a < ogTable.length; a++)
    {
        $("#bookList").DataTable().row.add($(ogTable[a]))
    }
    $("#bookList").DataTable().draw();
    let d = $('.tags-search').val();
    $.ajax({
        type: "POST",
        url: "/searchByTag",
        data: {values: d},
        success: function(x)
        {
            if (d != [])
            {
                filtered = x;
                list = []
                $("#bookList").DataTable().rows().every( function(i) {
                    let string = $("#bookList").DataTable().row(i).data()[0]
                    let final = $(string).filter(".id")[0]
                    final = $(final).text()
                    count = 0;
                    if (filtered.some(e => e.renert_id == String(final).trim()))
                    {
                        count +=1
                    }
                    if (count == 0)
                    {
                        list.push(i)
                    }
                })
                $("#bookList").DataTable().destroy();
                for (let z = list.length-1; z > -1; z--)
                {
                    $("#bookList").DataTable().row(list[z]).remove();
                }
                $("#bookList").DataTable().draw();
            }
        },
        error: function(x)
        {
            console.log("Ajax failed filter books")
        }
    })
}
)