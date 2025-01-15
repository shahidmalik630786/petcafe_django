let servicesTable;

var service_id = localStorage.getItem('service_id', )
console.log(service_id)

function updateEntityId(name){
    localStorage.setItem("entity_id", name)
}

function loadList() {
    if ($.fn.DataTable.isDataTable('#servicesTable')) {
        servicesTable.destroy();
    }

    servicesTable = $('#servicesTable').DataTable({
        processing: true,
        serverSide: true,
        ajax: {
            url: `/accounts/get-service-details/${service_id}/`,
            type: "GET",
            data: function (d) {
                return {
                    page: (d.start / d.length) + 1,
                    page_size: d.length,
                    search: d.search.value,
                    order_column: d.order[0].column,
                    order_dir: d.order[0].dir,
                    status: $('#partnershipStatus').val(),
                    draw: d.draw
                };
            },
            dataSrc: function (response) {
                return response.data;
            }
        },
        columns: [
            { 
                data: "id",
                visible: false,
                orderable: false
            },
            { 
                data: "Parent_Name",
                orderable: true,
                render: function(data, type, row) {
                    return `<a class="text-dark" href="/accounts/entity-detail/" 
                            onclick="updateEntityId('${row.Parent_Name}')" 
                            style="text-decoration:none;font-weight:400!important;">
                            ${row.name || data}</a>`;
                }
            },
            { data: "Pet_Name", 
              orderable: false,
              render: function(data) {
                return data || '';
            }
             },
            { data: "Phone_Number", 
              orderable: false,
              render: function(data) {
                return data || '';
              }
            },
            { data: "Pet_checkIn", 
              orderable: false,
              render: function(data) {
                return data || '';
              }
             },
            { data: "Pet_checkOut", 
              orderable: false,
              render: function(data) {
                return data || '';
              }
             },
            { data: "payment_status",
              orderable: false,
            "render": function(data, type, row){
                return data ? '<center><input  type="checkbox" checked /></center>' :'<center><input type="checkbox" disabled /></center>';
                }
             }
        ],
        order: [[1, 'asc']],
        pageLength: 10,
        language: {
            processing: "Loading...",
            zeroRecords: "No matching records found"
        }
    });

    $.fn.dataTable.ext.errMode = 'none';
}



$(document).ready(function() {
    loadList();
    
    $('#partnershipStatus').on('change', function() {
        loadList();
    });
});


$('#partnershipStatus').change(function () {
    $('#servicesTable').DataTable().ajax.reload(null, true);  
});