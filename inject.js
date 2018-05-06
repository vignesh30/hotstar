document.addEventListener('DOMContentLoaded', function() {	
	console.log("inject loaded2");
	
});
		
document.arrive(".paywallNudge", function() {
    // 'this' refers to the newly created element
  console.log("subscription arrived");
 chrome.runtime.sendMessage({method: 'refresh'},function(){});
  
});