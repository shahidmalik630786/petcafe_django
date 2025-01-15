
$(document).ready(function(){     
    $("#bookingOpt").change(function(){
        var service = $('#bookingOpt').val() ;
        if( service == "boarding"){
            var html = '<div class="form-group">'+
                            '<label>Check-in Date*</label>'+
                            '<input type="date" class="form-control" name="chkIn" id="chkIn" >'+
                        '</div>'+
                        '<div class="form-group">'+
                            '<label>Check-out Date*</label>'+
                            '<input type="date" class="form-control" name="chkOut" id="chkOut" >' +                                       
                        '</div>' +
                        '<div class="form-group special" id="feedingInfo">'+
                            '<label>Feeding Instructions*</label>'+
                            '<input type="text" class="form-control" name="feedInfo" id="feedInfo" placeholder="Feeding Info">'+
                        '</div>';                                                 
            $('#service_dynamic').html(html) ;
        } else if( service == "training"){
            var html = '<div class="form-group">'+
                            '<label>Start Date*</label>'+
                            '<input type="date" class="form-control" name="chkIn" id="chkIn"  >'+
                        '</div>'+
                        '<div class="form-group">'+
                            '<label>End Date*</label>'+
                            '<input type="date" class="form-control" name="chkOut" id="chkOut" >' +                                       
                        '</div>' ;                        
            $('#service_dynamic').html(html) ;
        } else if( service == "grooming" ){
            var html = '<div class="form-group mx-sm-3">'+
                            '<label>Scheduled Date*</label>'+
                            '<input type="date" class="form-control" name="chkIn" id="chkIn" >'+
                        '</div>'+
                        '<div class="form-group special">'+
                            '<div class="form-check form-check-inline">'+
                            '<input class="form-check-input" type="radio" name="groomingCharge" id="groomingCharge1" value="friend">'+
                            '<label class="form-check-label" for="groomingCharge1">Friendly Grooming </label>'+
                            '</div>'+
                            '<div class="form-check form-check-inline">'+
                            '<input class="form-check-input" type="radio" name="groomingCharge" id="groomingCharge2" value="premium">'+
                            '<label class="form-check-label" for="groomingCharge2">Premium Grooming </label>'+
                            '</div>'+
                            '<div class="form-check form-check-inline">'+
                            '<input class="form-check-input" type="radio" name="groomingCharge" id="groomingCharge3" value="luxury">'+
                            '<label class="form-check-label" for="groomingCharge3">Luxury Grooming </label>'+
                            '</div>'+                                                                  
                        '</div>' ;                         
            $('#service_dynamic').html(html) ;
        }
    });

    
});


function edit_details(id){    
    //url = location.protocol + '//' + location.host + location.pathname ;
    url = location.protocol + '//' + location.host + "/editPetDetails" ;    
    window.location.href = url + "/" + id ;
}


