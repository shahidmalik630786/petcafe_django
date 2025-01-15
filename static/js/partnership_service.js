

function loadList() {
    try {
        partnershipTable = $('#partnershipTable').DataTable({
            "processing": true,
            "serverSide": true,  
            "ajax": {
                "url": "/accounts/api/partnership/service/",
                "type": "GET",
                "data": function (d) {
                    return {
                        "page": (d.start / d.length) + 1,  
                        "page_size": d.length,  
                        "search[value]": d.search.value,
                        "order[0][column]": d.order[0].column,
                        "order[0][dir]": d.order[0].dir,
                        "status": $('#partnershipStatus').val(),
                        "draw": d.draw
                    };
                },
                "dataSrc": function (response) {
                    return response.data;  
                }
            },
            "columns": [
                { 
                    "data": "id", 
                    "visible": false,
                    "orderable": false 
                },

                { 
                    "data": "Parent_Name", 
                    "orderable": false,
                },

                { 
                    "data": "Pet_Name", 
                    "orderable": false 
                },


                { 
                    "data": "Phone_Number", 
                    "orderable": false 
                },

                { 
                    "data": "Pet_Breed", 
                    "orderable": false 
                },

                // { 
                //     "data": "Pet_DOB", 
                //     "orderable": false 
                // },

                { 
                    "data": "Pet_checkIn", 
                    "orderable": false 
                },

                { 
                    "data": "Pet_checkOut", 
                    "orderable": false 
                },

                {
                    "data": "total_amount",
                    "orderable": false,
                    "className": "text-center",
                },
            ],
            "order": [[1, 'asc']],  
            "paging": true,
            "pageLength": 10,
            "serverMethod": "GET"
        });
    } catch (error) {
        console.error("DataTable initialization error:", error);
    }
}


$(document).ready(function() {
    if ($('#partnershipTable').length > 0) {
     loadList();
    }
});

$('#partnershipStatus').change(function () {
    const partnershipStatus = $('#partnershipStatus').val();
    sessionStorage.setItem('partnershipStatus', partnershipStatus);
    $('#partnershipTable').DataTable().ajax.reload(null, true);  // true to reset to first page
});


(() => {
    'use strict'
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new bootstrap.Tooltip(tooltipTriggerEl)
    })
  })()