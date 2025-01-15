$(document).ready(function(){
    
    /*$("#pickup_check").click(function(){
        if($(this).is(":checked")){
            
            var html="<div class='form-group'><label>PickUp / Drop Charge*</label><input type='text' class='form-control' name='pick_up_charge' id='pick_up_charge' ></div>" ;
            $("#enter_pickup_charge").html(html) ;
        } else {
            
            $("#enter_pickup_charge").html("") ;
        }
    });
    $("#grooming_check").click(function(){
        if($(this).is(":checked")){
            var html="<div class='form-group'><label>Grooming Charge*</label><input type='text' class='form-control' name='grooming_charge' id='grooming_charge' ></div>" ;
            $("#enter_grooming_charge").html(html) ;
        } else {
            $("#enter_grooming_charge").html("") ;
        }
    });*/
    $("#per_day_charge").blur(function(){
        var inDate = $("#chkIn").val() ;
        var outDate = $("#chkOut").val() ;
        var date1 = new Date(inDate) ;
        var date2 = new Date(outDate);
        var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24), 10);
        var perDayCharge = $("#per_day_charge").val() ;
        if(!perDayCharge){perDayCharge=0; }
        var pndCharge = 0 ;
        if($("#pickup_check").is(":checked")){
            pndCharge = $("#pick_up_charge").val() ;
            //alert(pndCharge) ;
        }
        var groomingCharge = 0 ;
        if($("#grooming_check").is(":checked")){
            groomingCharge = $("#grooming_charge").val() ;
        }
        var total_price = (diffDays * perDayCharge) + eval(pndCharge) + eval(groomingCharge) ;
        //alert(total_price) ;
        $("#total_amount").val(total_price) ;
        
    }) ;
    $("#advance_amount").blur(function(){
        var total_amount = $("#total_amount").val() ;
        var paid_amount = $(this).val() ;
        var pending_amount = total_amount - paid_amount ;
        $("#pending_amount").val(pending_amount) ;
    });

    $("#pick_up_charge").blur(function(){
        var pndCharge = $("#pick_up_charge").val() ;
        if( !pndCharge){pndCharge=0; }
        var inDate = $("#chkIn").val() ;
        var outDate = $("#chkOut").val() ;
        var date1 = new Date(inDate) ;
        var date2 = new Date(outDate);
        var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24), 10);
        var perDayCharge = $("#per_day_charge").val() ;
        var grooming_charge = $("#grooming_charge").val() ;
        if( !grooming_charge ){
            grooming_charge = 0 ;
        }
        if( ! perDayCharge ){
            perDayCharge = 0 ;
        }
        var total_price = (diffDays * perDayCharge) + eval(pndCharge) + eval(grooming_charge) ;
        $("#total_amount").val(total_price) ;
        
        /*
        
        var pndCharge = 0 ;
        if($("#pickup_check").is(":checked")){
            pndCharge = $("#pick_up_charge").val() ;
            alert(pndCharge) ;
        }
        var total_price = (diffDays * perDayCharge) + eval(pndCharge)  ;
        alert(total_price) ;
        $("#total_amount").val(total_price) ;*/
    });
    $("#grooming_charge").blur(function(){
        var grooming_charge = $("#grooming_charge").val() ;
        if(!grooming_charge){ grooming_charge=0 ;}
        var inDate = $("#chkIn").val() ;
        var outDate = $("#chkOut").val() ;
        var date1 = new Date(inDate) ;
        var date2 = new Date(outDate);
        var diffDays = parseInt((date2 - date1) / (1000 * 60 * 60 * 24), 10);
        var perDayCharge = $("#per_day_charge").val() ;
        var pndCharge = $("#pick_up_charge").val() ;
        if( !pndCharge ){
            pndCharge = 0 ;
        }
        if( !perDayCharge ){
            perDayCharge = 0 ;
        }
              
        var total_price = (diffDays * perDayCharge) + eval(pndCharge) + eval(grooming_charge) ;
        $("#total_amount").val(total_price) ;
    })

});

function validate_form(){    
    var totalamount = $('#total_amount').val() ;
    var paidAmount = $('#advance_amount').val() ;
    var boardingStat = $('#boardingStat').val() ;
    //var pending_amount = $("#pending_amount").val() ;    
    
    if( boardingStat == "checkedout"){
        if(paidAmount != totalamount && totalamount  != 0 ){
            alert("Payment has not cleared !") ;
        }else {
            $('#edit_entry').submit() ;
            //alert("Submitting");
        }
    } else {
        $('#edit_entry').submit() ;
        //alert("Submitting");
    }  
}

