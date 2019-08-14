console.log('bckground loaded');
var azaffid = "amazon-offers-2017-21";
var fkaffid = "vignesh30";
(function (i, s, o, g, r, a, m) {
	i.GoogleAnalyticsObject = r;
	i[r] = i[r] || function () {
		(i[r].q = i[r].q || []).push(arguments)
	}, i[r].l = 1 * new Date();
	a = s.createElement(o), m = s.getElementsByTagName(o)[0];
	a.async = 1;
	a.src = g;
	m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');
ga('create', 'UA-136823610-1', 'auto');
ga('set', 'checkProtocolTask', null);
ga('require', 'displayfeatures');

var clearCache = function (minutes, callback) {
      
      var millisecondsPerWeek = 1000 * 60 * 60 * 24 * 7
	  var millisecondsPer15Min = 1000 * 60 * minutes;
      var minutesAgo = (new Date()).getTime() - millisecondsPer15Min;
      chrome.browsingData.remove({
        "since": minutesAgo
      }, {
		"appcache": true,
        "cache": true,
        "cacheStorage": true,
        "cookies": true,
        "downloads": true,
        "fileSystems": true,
        "formData": true,
        "history": true,
        "indexedDB": true,
        "localStorage": true,
        "pluginData": true,
        "passwords": true,
        "serviceWorkers": true,
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
		var tempTab;
		
		chrome.tabs.create({'active' : false}, function(tab){
			tempTab = tab.id;
			
			chrome.tabs.remove(tabid, function(){
				console.log("refresh..");
				setTimeout(function(){ 
					clearCache(20,function(){						
						console.log("cache cleared");
						setTimeout(function(){ 
							chrome.tabs.create({'url' : urlToOpen, 'active' : true}, function(tab){
								console.log("tab opened");
								chrome.tabs.remove(tempTab, function(){ });
							});
						
						},200);						
					});
				}, 500);
			});
		});

		return true;		
	}
	if(request.method == "clearCache")
	{	
		clearCache(43800,function(){
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			  var currTab = tabs[0];
			  if (currTab) { // Sanity check
				chrome.tabs.sendMessage(tabs[0].id, {method: "reload"}, function(response) {});  
				sendResponse(true);
			  }
			});
		
		});
		
		return true;
	}
	
	if(request.method == "loadVideo"){
		
		chrome.tabs.create({'url': chrome.extension.getURL('hotstar.html')}, function(tab) {
			// Tab opened.
		  });
		return true;
	}
	if(request.method == "trackPage"){
		
		pageTrack(request.page);
		return true;
	}

 });
 
 chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
	if (info.status === 'complete') {
		console.log("inside tab loaded");
		if (tab.url.includes("flipkart.com")) {
			sendGA("flipkart");
			console.log("flipkart added")
		} else if (tab.url.includes("amazon.in")) {
			console.log("amazon added");
			sendGA("amazon")
		}
	}
});

function sendGA(site) {
	ga('send', 'event', site, 'added tag');
}

function pageTrack(page){
	ga('send', 'pageview', page);
	
}
 chrome.runtime.onInstalled.addListener(function (details) {
            if (details.reason == "install") {
               ga('send', 'event', "installed", chrome.runtime.getManifest().version);
            } else if(details.reason == "update") {
                ga('send', 'event', "update", chrome.runtime.getManifest().version);
				//refresh hotstar web pageX
				chrome.tabs.query({url : "https://www.hotstar.com/*"}, function(tabs) {
				  for(var i=0; i < tabs.length ; i++){
					  
					  chrome.tabs.update(tabs[i].id, {url: tabs[i].url});
				  }
				});
            }
        });

chrome.webRequest.onBeforeRequest.addListener(function (details) {
	
		if (getHostName(details.url).includes("flipkart")) {
			return {			
				redirectUrl : updateQueryStringParameter(details.url, "affid" ,fkaffid )
			}
		} else if (getHostName(details.url).includes("amazon")) {
			return {
				redirectUrl : updateQueryStringParameter(details.url, "tag" ,azaffid )
			}
		}	
}, {
	urls: ["*://www.amazon.in/*", "*://www.flipkart.com/*"]
}, ["blocking"]);

function updateQueryStringParameter(uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)){
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }else {
    return uri + separator + key + "=" + value;
  }
}

function checkNquery(url) {
	var matches = url.match(/[a-z\d]+=[a-z\d]+/gi);
	return matches ? matches.length : 0
}

function getHostName(url) {
	return (new URL(url)).hostname
}

function isTagPresent(url) {
	if (getHostName(url).includes("flipkart"))
		if (url.indexOf("affid=") > -1)
			return !0;
		else return !1;
	else if (getHostName(url).includes("amazon"))
		if (url.indexOf("tag=") > -1)
			return !0;
		else return !1
}


chrome.browserAction.onClicked.addListener(function () {
	chrome.tabs.create({'url' : 'https://www.hotstar.com/sports/cricket/tournament/vivo-ipl-2019-830', 'active' : true}, function(tab){
								
							});
})

 chrome.storage.sync.set({"currentStream": ""}, function() { 
        });	
chrome.webRequest.onBeforeRequest.addListener(
			function(details) {

			if (details.url.endsWith('.m3u8') ) {
				 chrome.storage.sync.set({"currentStream": details.url}, function() { 
				});
				return {cancel:false};	
			}
			else {
				 return {cancel:false};
			}

		},
	{urls: ["*://*.hotstar.com/*/*","*://*.akamaihd.net/*","*://*.akamai.com/*","*://*.hotstar-cdn.net/*"]},
	["blocking"]);