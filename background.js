console.log('bckground loaded');

var clearCache = function (callback) {
      
      var millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7
	  var millisecondsPer15Min = 1000 * 60 * 15;
      var minutesAgo = (new Date()).getTime() - millisecondsPer15Min;
      chrome.browsingData.remove({
        "since": minutesAgo
      }, {
        "appcache": true,
        "cache": true,
        "cookies": true,
        "fileSystems": true,
        "formData": true,
        "history": true,
        "indexedDB": true,
        "localStorage": true,
        "pluginData": true,
        "webSQL": true
      }, callback);
	  
}  
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    //console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");		
	if(request.method == "refresh")
	{		
		var tabid = sender.tab.id;
		var urlToOpen = sender.url;
		
		chrome.tabs.remove(tabid, function(){
			console.log("refresh..");
			setTimeout(function(){ 
				clearCache(function(){
					
					console.log("cache cleared");
					chrome.tabs.create({'url' : urlToOpen, 'active' : true}, function(){
						console.log("tab opened");
					});
					
				});
			}, 500);
		});
		
			
			
	
		return true;		
	}

 });
 