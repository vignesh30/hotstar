myStorage = window["localStorage"];
var currentUrl = window["location"]["href"];
console.log(currentUrl);
var streamId=null;
var res = currentUrl.split("/");
  res.reverse();
if(res[0].length==10){
streamId = res[0];
console.log(streamId);
}

localStorage["setItem"]("nofreeluncheon", "");
var mainKey = null;
function isTrialEnded() {
    var timer1 = setInterval(() => {
        var freelunch = localStorage["getItem"]("nofreeluncheon");
        if (freelunch) {
            timeDataParsed = JSON["parse"](JSON["parse"](freelunch));
			console.log(freelunch);
			
            keys = Object["keys"](timeDataParsed);
            if (mainKey || (keys[0] && timeDataParsed[keys[0]])) {
                if (!mainKey) {
                    mainKey = keys[0]
                };
                var eventReached = timeDataParsed[mainKey]["firedReachedPaywallEvent"];
                if (eventReached) {
					window.location.href = chrome.extension.getURL('hotstar.html');

                   // location["reload"]();
                    clearInterval(timer1)
                }
            }
        }
    }, 1000)
}
function replaceTvlogo() {
    var tvlogo = setInterval(() => {
        var timerElement = document["getElementsByClassName"]("info-wrapper");
        if (timerElement && timerElement[0]) {
			
            $(timerElement[0])["html"]("Hotstar free live stream");
            clearInterval(tvlogo)
        }
    }, 50)
}
//replaceTvlogo();
isTrialEnded();

if (streamId) {
    localStorage["setItem"]("isRefresh", "false");
    $(document)["ready"](function() {
		
    })
}
