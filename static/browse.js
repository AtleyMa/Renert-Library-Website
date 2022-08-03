$(document).ready( function () {
    $('#bookList').DataTable();
} );
let ogTable = [];
$(document).ready(function() {
    $('.tags-search').select2();
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
                <td class="id">
                    <a href="/book/` + all[i]['renert_id'] + `" class="text-decoration-none text-info id">` + all[i]['renert_id'] + `</a>
                </td>
                <td>
                    <a href="/book/` + all[i]['renert_id'] + `" class="text-decoration-none text-info">` + all[i]['title'] + `</a>
                </td>
                <td>
                    <a href="/author/` + all[i]['author'] + `" class="text-decoration-none text-info"> ` + all[i]['author'] + ` </a>
                </td>
                </tr>`
                $("#bookList").DataTable().row.add($(tr))
            }
            $("#bookList").DataTable().draw()
            ogTable = $("#bookList").DataTable().$("tr");
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