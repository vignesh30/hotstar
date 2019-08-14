
document.arrive(".paywallNudge", function() {
    // 'this' refers to the newly created element
  console.log("subscription arrived");
 //chrome.runtime.sendMessage({method: 'refresh'},function(){});
 showButton();
  
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log("sent from tab.id=", sender);
	if(request.method == "reload"){
		
		window.location.reload();
	}
});

$('document').ready(function(){
		console.log("inject loaded2");
		var imgurl =  chrome.extension.getURL("icon64.png");
	var div= '<div id = "freeLive" style=" z-index: 1000;height: 125px; width: 125px; background-color: #000080; border-radius: 50%;display: inline-block; position: fixed;  bottom: 0;right: 0;padding:20px; cursor:pointer;"> <img src = "'+imgurl+'"  style= "margin-left: auto;margin-right: auto;	display: block;"/></div>';
	 
	 $(div).appendTo('body');
	 
	 $('#freeLive').click(function(){
		 
		//window.alert("clicked");
		chrome.runtime.sendMessage({method: 'loadVideo'},function(){});
	 })
})