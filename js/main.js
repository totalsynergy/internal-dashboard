var synergyApiKey = "";

var eventBriteKey = "";





chrome.power.requestKeepAwake('display');


var chartData2 =   [
  {x: 1, y: 1},
  {x: 2, y:2}
  ];
/*
$(document).ready(function() {  
        var idleMouseTimer;
        var forceMouseHide = false;
 
        $("body").css('cursor', 'none');
 
        $("#wrapper").mousemove(function(ev) {
                if(!forceMouseHide) {
                        $("body").css('cursor', '');
 
                        clearTimeout(idleMouseTimer);
 
                        idleMouseTimer = setTimeout(function() {
                                $("body").css('cursor', 'none');
 
                                forceMouseHide = true;
                                setTimeout(function() {
                                        forceMouseHide = false;
                                }, 200);
                        }, 1000);
                }
        }); 
});
*/