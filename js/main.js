(function timer(){
  setInterval(function(){
    var time = 0;
    $rootScope.$broadCast('TimeChange');
    time += 1000;
  }.1000);
})();

var synergyApiKey = "";

var eventBriteKey = "";

window.onload = function(){
  /*chrome.power.requestKeepAwake('display');
    chrome.storage.local.get('eventBriteKey', function (result) {
        eventBriteKey = result.eventBriteKey;
    });


    chrome.storage.local.get('synergyKey', function (result) {
        keywords = result.keywords;
        $("#keywords").val(keywords);
    }); */
}

chrome.power.requestKeepAwake('display');

fixScale = function(doc) {

	var addEvent = 'addEventListener',
	    type = 'gesturestart',
	    qsa = 'querySelectorAll',
	    scales = [1, 1],
	    meta = qsa in doc ? doc[qsa]('meta[name=viewport]') : [];

	function fix() {
		meta.content = 'width=device-width,minimum-scale=' + scales[0] + ',maximum-scale=' + scales[1];
		doc.removeEventListener(type, fix, true);
	}

	if ((meta = meta[meta.length - 1]) && addEvent in doc) {
		fix();
		scales = [.25, 1.6];
		doc[addEvent](type, fix, true);
	}

};