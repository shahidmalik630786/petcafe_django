$('#get_started').click(function(e){
  e.preventDefault() ; 
  var name = $('#name').val() ;
  var phNum = $('#phonenum').val() ;
  var email = $('#emailaddrs').val() ;
  var message = $('#comment').val() ;  
  $.ajax({    
    type: 'GET',
    //dataType: "html",
    data: {
        "Name": name,        
        "phNum" : phNum,
        "email" : email,
        "message" : message,
        //"CSRF": getCSRFTokenValue(),   
    },
    url: "/message",
    success: function(result){ 
        
        if( result == "") {            
            alert("Update not successful.") ;
        }else {
          $('#contactpage')[0].reset() ;
          $("#status").html("Successfully Sent...") ;
        } 
        //location.reload() ;
    },
    error: function(request, result){
        alert(result + request.status + request.respnseText) ;
    }
  });
  
});

$('#submit_vet').click(function(e){
  e.preventDefault() ;
  var CName = $('#fname').val() ;
  var CPhNumber = $('#phonenum').val() ;
  var cDate = $('#schedule_date').val() ;
  var cTime = $('#schedule_time').val() ;
  var petCheck = $('#pets_check').val() ;
  $.ajax({    
    type: 'GET',
    //dataType: "html",
    data: {
        "Name": CName,        
        "phNum" : CPhNumber,
        "Date" : cDate,
        "Time" : cTime,
        "petCheck" : petCheck
        //"CSRF": getCSRFTokenValue(),   
    },
    url: "/schedule_vet",
    success: function(result){         
        if( result == "") {            
            alert("Update not successful.") ;
        }else {
          $('#vetSchedule')[0].reset() ;
          $("#status").html("Successfully Scheduled...") ;
        } 
        //location.reload() ;
    },
    error: function(request, result){
        alert(result + request.status + request.respnseText) ;
    }
  });
});
