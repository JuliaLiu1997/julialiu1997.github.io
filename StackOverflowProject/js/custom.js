
$(document).ready(function(){
    
    $("#result").on("click","a",function(e){
        if ($(this).attr("class")!="q-title"){
            window.open(this.attr("href"),'_blank')
            return;
        }
        e.preventDefault();
        var myClass=$(this).attr("id");
        $(".dis-content ."+myClass).toggle('slow');
    });
    


    $("button").click(function(){
        var numberOfResult = 0;
        var sort;
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
                sort = radioButtons[i];
                targeturl += sort.value;
            }
        }
        targeturl += '&tagged='+input.value+'&site=stackoverflow&filter=!iCF4LoRm6FXfS9mZ15yq(1';
        
        $.getJSON(targeturl, function(data) {

             $.each(data, function(i, field){
                $.each(field, function(j, result){
                    
                    if (numberOfResult == 10){
                        return false;
                     }
                    addElement(result, numberOfResult);
                    numberOfResult++;
                });
                
            });
            resultNumberField.innerHTML = "Result: "+numberOfResult+" - tag: "+input.value+",  sort: "+ sort.value;
        });  
       
        
    });
});

function addElement(object, id){
    var htmlResult = "";
   
    htmlResult += '<div class="dis-question">';
    htmlResult += '<div class="dis-title"><a href="#" id='+id+' class="q-title"><h4>'+object.title+'</h4></a></div>';
    htmlResult += '<div class="dis-content"><div class='+id+' ">';
    htmlResult += object.body;
    htmlResult += '<br><p><b> Original Website: <a href="'+object.link+'" target="_blank">'+object.link+'</a></b></p>';
    htmlResult += '</div></div></div>';
    document.getElementById("result").innerHTML += htmlResult;

}

