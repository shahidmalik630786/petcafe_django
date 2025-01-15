var i=0;
$(document).ready(function(){    
    $("#amoutPerDay").change(function(){
        var start = $('#chkIn').val() ;
        var end = $("#chkOut").val() ;
        
        var diff = new Date(end ) - new Date(start ) ;
        
        var days = diff/1000/60/60/24 ;
        
        var amountPerDay = $("#amoutPerDay").val() ;
        var totalAmount = days * amountPerDay ;
        
        $("#total_amount").val(totalAmount) ;
    });

    $("#advance_amount").change(function(){
        var totalAmount = $("#total_amount").val() ;
        var paidAmount = $("#advance_amount").val() ;
        alert(totalAmount + "|" + paidAmount) ;        
        $("#pending_amount").val(balanceAmount) ;
    });
    
    $('#add_more').on('click', function(){
        var colorR = Math.floor((Math.random() * 256));
        var colorG = Math.floor((Math.random() * 256));
        var colorB = Math.floor((Math.random() * 256));
        i++;
        var html ='<div id="append_no_'+i+'" class="animated bounceInLeft">'+
            '<div class="input-group mt-3">'+
            '<div class="input-group-prepend">'+
            '<span class="input-group-text br-15" style="color:rgb('+colorR+','+colorG+','+colorB+'">'+
            '<i class="fas fa-user-graduate"></i></span>'+
            '</div>'+
            '<input type="text" placeholder="Student Name"  class="form-control"/>'+
            '</div>'+
            '<div class="input-group mt-3">'+
            '<div class="input-group-prepend">'+
            '<span class="input-group-text br-15" style="color:rgb('+colorR+','+colorG+','+colorB+'">'+
            '<i class="fas fa-phone-square"></i></span>'+
            '</div>'+
            '<input type="text" placeholder="Student Phone" class="form-control"/>'+
            '</div>'+
            '<div class="input-group mt-3">'+
            '<div class="input-group-prepend">'+
            '<span class="input-group-text br-15" style="color:rgb('+colorR+','+colorG+','+colorB+'">'+
            '<i class="fas fa-at"></i></span>'+
            '</div>'+
            '<input type="email" placeholder="Student Email" class="form-control"/>'+
            '</div></div>';
  
        $('#add_services').append(html);
        $('#remove_more').fadeIn(function(){
             $(this).show();
        });
       });
    
       $('#remove_more').on('click', function(){         
        $('#append_no_'+i).removeClass('bounceInLeft').addClass('bounceOutRight')
           .fadeOut(function(){
               $(this).remove();
           });
           i--;
           if(i==0){
               $('#remove_more').fadeOut(function(){
                   $(this).hide()
               });;
           }  
    });

    $('#ServiceTaken').change(function(){
        alert($('#ServiceTaken').val()) ;
        var service = $('#ServiceTaken').val() ;
        if( service == "boarding"){
            var html = '<div class="form-group">'+
                            '<label>Check-in Date*</label>'+
                            '<input type="date" class="form-control" name="chkIn" id="chkIn" >'+
                        '</div>'+
                        '<div class="form-group">'+
                            '<label>Check-out Date*</label>'+
                            '<input type="date" class="form-control" name="chkOut" id="chkOut" >' +                                       
                        '</div>' +

                        '<div class="form-group mx-sm-3">'+
                            '<label>Amount Per Day *</label>'+
                            '<input type="text" class="form-control" name="amoutPerDay" id="amoutPerDay" placeholder="Amount per Day" >'+
                        '</div>' ;
            $('#service_dynamic').html(html) ;
        } else if( service == "training" ){
            var html = '<div class="form-group">'+
                            '<label>Start Date*</label>'+
                            '<input type="date" class="form-control" name="chkIn" id="chkIn"  >'+
                        '</div>'+
                        '<div class="form-group">'+
                            '<label>End Date*</label>'+
                            '<input type="date" class="form-control" name="chkOut" id="chkOut" >' +                                       
                        '</div>' +

                        '<div class="form-group mx-sm-3">'+
                            '<label>Amount Per Session *</label>'+
                            '<input type="text" class="form-control" name="amoutPerDay" id="amoutPerDay" placeholder="Amount per Day" >'+
                        '</div>' ;
            $('#service_dynamic').html(html) ;
        } else if( service == "grooming"){
            var html = '<div class="form-group mx-sm-3">'+
                            '<label>Scheduled Date*</label>'+
                            '<input type="date" class="form-control" name="chkIn" id="chkIn" >'+
                        '</div>'+
                        '<div class="form-group special">'+
                            '<div class="form-check form-check-inline">'+
                            '<input class="form-check-input" type="radio" name="groomingCharge" id="groomingCharge1" value="1200">'+
                            '<label class="form-check-label" for="groomingCharge1">Friendly Grooming </label>'+
                            '</div>'+
                            '<div class="form-check form-check-inline">'+
                            '<input class="form-check-input" type="radio" name="groomingCharge" id="groomingCharge2" value="1800">'+
                            '<label class="form-check-label" for="groomingCharge2">Premium Grooming </label>'+
                            '</div>'+
                            '<div class="form-check form-check-inline">'+
                            '<input class="form-check-input" type="radio" name="groomingCharge" id="groomingCharge3" value="2000">'+
                            '<label class="form-check-label" for="groomingCharge3">Luxury Grooming </label>'+
                            '</div>'+                                                                  
                        '</div>' +

                        '<div class="form-group mx-sm-3">'+
                            '<label>Amount for Grooming*</label>'+
                            '<input type="text" class="form-control" name="amoutPerDay" id="amoutPerDay" placeholder="Amount per Day" >'+
                        '</div>' ;
            $('#service_dynamic').html(html) ;
        }
    });
    
});

function validate_form(){
    alert("Generating the Invoice...")

}