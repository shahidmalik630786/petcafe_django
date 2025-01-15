function loadList() {
    // Check if DataTables is available
        try {
            $('#cafeTable').DataTable({
                "processing": true,
                "serverSide": true,
                "ajax": {
                    "url": "/accounts/get-cafe",
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
                    { "data": "id", "visible": false },
                    { "data": "Pet_Name", "orderable": false},
                    { "data": "Parent_Name", "orderable": false},
                    { "data": "Phone_Number", "orderable": false},
                    { "data": "Pet_Breed", "orderable": false},
                    { "data": "Pet_checkIn", "orderable": false},
                    { "data": "Pet_checkOut", "orderable": false},
                    { "data": "boarding_status", "orderable": false},
                    { "data": null, 
                      "orderable": false,
                      "className": "custom_colour text-center",
                        "render": function(data, type, row) {
                        
                            if (row.state_of_board.trim() === "InHouse" && row.advance_amount === 0) {
                                return '<span class="dot_cyan"></span>';
                            }
                            if (row.pending_amount === 0 && row.total_amount === row.advance_amount && row.total_amount > 0) {
                                return '<span class="dot_green"></span>';
                            }
                            if (row.pending_amount === row.total_amount && row.advance_amount === 0 && row.state_of_board.trim() !== "InHouse") {
                                return '<span class="dot_red"></span>';
                            }
                            if (row.advance_amount > 0 && row.advance_amount < row.total_amount) {
                                return '<span class="dot_yellow"></span>';
                            }
                        return '';
                        }
                    },
                    { 
                        "data": null, 
                        "render": function(data, type, row){
                            return`<center><a href="/editPetDetails/${row.id}"><i class="bi bi-pencil-square"></i></a></center>`;
                        },
                        'width':"60px"
                    },
                ],
                "order": [[1, 'asc']],
                "paging": true,
                "pageLength": 10,
                "serverMethod": "GET",
                "createdRow": function(row, data, dataIndex) {
                // Add class based on Booking_Option
                if (data.Booking_Option === "training") {
                    $(row).addClass('training_row');
                } else if ((data.boarding_status).trim() === "BOOKED") {
                    $(row).addClass('boarding_row');
                }
            }
            });
        } catch (error) {
            console.error("DataTable initialization error:", error);
        }

}

// Ensure DOM is fully loaded
$(document).ready(function() {
    loadList();
});

$('#partnershipStatus').change(function () {
    $('#cafeTable').DataTable().ajax.reload(null, true);  
});