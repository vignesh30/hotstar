$(document).ready(function() { 
	loadExistingForm();

	$('#save').click(function(){
		saveFormValues();
		$('#successAlert').show();
		ga('send', 'event', 'Save Button', 'Clicked');
	});
	
	$('#reset').click(function(){
		Clean();
		$('#successAlert').hide();
		chrome.runtime.sendMessage({ method: 'clearform'}, function(response) {
			  ga('send', 'event', 'Reset Button', 'Clicked');
			});
	});

	ga('send', 'pageview', '/options.html');

 });
 
 
function saveFormValues(){
	var form = document.getElementById("railways");
	var formdata= [];
    for (i = 0; i < form.length; i++) {
		var row =[];
		
			
      var type = form.elements[i].type;
      var val = form.elements[i].value;
      var name = form.elements[i].name;
	  if(type=="checkbox")
	  {
		  val = form.elements[i].checked;
	  }
	  
	  row.push(name,type,val);
	  formdata.push(row);
	
	}	
	chrome.runtime.sendMessage({data: formdata, method: 'storeform'}, function(response) {
			  console.log(response.data);
			});
	
}


function Clean(){
	document.getElementById("railways").reset();
	if (typeof(Storage) !== 'undefined') localStorage.clear();
}

function loadExistingForm(){
	var form = document.getElementById("railways");
	chrome.runtime.sendMessage({method: 'getform'}, function(result) {
			  console.log('inside load existing form');
			  var array = result.data? result.data:[];
			  for (i = 0; i < array.length; i++) {
				var row =[];
				row = array[i];
				console.log("name "+row[0]+" type "+row[1]+" value "+row[2]);
				if(row[1] == "checkbox"){
					if(row[2]==true)
						form[row[0]].checked = true;
					else
						form[row[0]].checked = false;
				}else{
					form[row[0]].value = row[2];
				}
			}
			  
		});
}