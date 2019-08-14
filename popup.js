console.log("options page loaded");

$( document ).ready(function() {
    console.log( "ready!" );
	     chrome.storage.sync.get(["quality"], function(res) { 
			
			$("input[name=quality][value='" + res.quality + "']").prop('checked', true);
        });		
	
	$("#clearCache").click(function(){
		chrome.runtime.sendMessage({method: 'clearCache'},function(){
			
			window.close();
		});
		
	});
	
	$("input[name='quality']").change(function(e){
     chrome.storage.sync.set({"quality": e.target.value}, function() { 
        });		
	});
});