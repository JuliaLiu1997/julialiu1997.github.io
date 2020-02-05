$(".discover a").click(function(e){
	e.preventDefault();
	var myClass=$(this).attr("id");
	$(".dis-content ."+myClass).toggle('slow');
});

$(document).ready(function(){
    $("button").click(function(){
        var numberOfResult = 0;
        var sort = "";
        var resultNumberField = document.getElementById("result-number");
        var input = document.getElementById("tag");
        var fromdate = Math.round(new Date().getTime()/1000)-7*86400;
        var targeturl = 'https://api.stackexchange.com/2.2/questions?fromdate='+fromdate+'&order=desc&sort=';
        var radioButtons = document.getElementsByName("type");
        document.getElementById("result").innerHTML = "";
        if (input.value == '')
        {
            resultNumberField.innerHTML = "Result: 0 - Please enter a tag";
            return;
        }

        for(var i = 0; i < radioButtons.length; i ++) {
            if (radioButtons[i].checked) {
                sort = radioButtons[i].value;
                targeturl += sort;
            }
        }
        targeturl += '&tagged='+input.value+'&site=stackoverflow&filter=!iCF4LoRm6FXfS9mZ15yq(1';
        
        $.getJSON(targeturl, function(data) {

             $.each(data, function(i, field){
                $.each(field, function(j, result){
                    
                    if (numberOfResult == 10){
                        return false;
                     }
                    addElement(result);
                    numberOfResult++;
                });
                
            });
            resultNumberField.innerHTML = "Result: "+numberOfResult+" - tag: "+input.value+", sort: "+ sort;
        });  
       
        
    });
});

function addElement(object){
    var htmlResult = "";
   
    htmlResult += '<div class = dis-Question>';
    htmlResult += '<h3>'+object.title+'</h3>';
    htmlResult += '<div class = dis-content>';
    htmlResult += object.body;
    htmlResult += '</div></div>';
    document.getElementById("result").innerHTML += htmlResult;

}

