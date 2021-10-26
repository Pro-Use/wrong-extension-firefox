
//Background comms
 var port = chrome.extension.connect({
      name: "RTC_Comms"
 });

buttons = document.querySelectorAll('.send');

buttons.forEach(function(currentBtn){
  currentBtn.onclick = () =>  {
      port.postMessage(currentBtn.id);
      window.close();
  };
});

//launch live || all artists
var trigger_counter = 0;
var refresh_counter = 0;

document.addEventListener('keydown', logKey);

function logKey(e) {
  if (e.code === "KeyN"){
      trigger_counter += 1;
      if (trigger_counter > 3) {
           port.postMessage("next_popup");
           trigger_counter = 0;
      }
  } else if (e.code === "KeyR"){
      refresh_counter += 1;
      if (refresh_counter > 3) {
           port.postMessage("refresh");
           window.close();
      }
  }
}

//pause state
var pause_button = document.getElementById("pause");

chrome.storage.local.get(['paused'], function(result) {
    let paused = result.paused;
    console.log("paused state:" + paused);
    if (paused === null || paused === false) {
        console.log("Unpaused");
        pause_button.checked = true;
        document.getElementById("popup-info").style.display = "block";
        document.getElementById("paused").style.display = "none";
    } else {
        console.log("Paused");
        pause_button.checked = false;
        document.getElementById("popup-info").style.display = "none";
        document.getElementById("paused").style.display = "block";
    }
});

pause_button.addEventListener( 'change', function() {
    port.postMessage("pause_toggle");
    if (pause_button.checked === true) {
        location.reload();
    } else {
        document.getElementById("popup-info").style.display = "none";
        document.getElementById("paused").style.display = "block";
    }
});


var set_title = document.getElementById('popup-set-title');
var title = document.getElementById('popup-title');
var time = document.getElementById('popup-time');

var next_ts = null;

chrome.alarms.getAll(function (alarms) {
    alarm_times = [];
    alarms.forEach(function(alarm) {
        if (alarm.name !== "countdown" && alarm.name !== "pv" && alarm.name !== "talk") {
            alarm_times.push(alarm.scheduledTime);
        }
    });
    alarm_times.sort(function(a, b){return a - b;});
    next_alarm_time = alarm_times[0];
    console.log(next_alarm_time);
    next_ts = next_alarm_time;
    next_popup_name = false;
    alarms.every(function(alarm) {
        if (alarm.scheduledTime === next_alarm_time) {
            next_popup_name = alarm.name;
            return false;
        } else {
            return true;
        }
    });
    if (next_popup_name) {
        chrome.storage.local.get([next_popup_name], function(result) {
                next_popup = result[next_popup_name];
                console.log(next_popup);
                set_title.innerHTML = next_popup.title;
                title.innerHTML = next_popup.popup_title;
                time.innerHTML = next_popup.time;
        });
    } else {
        set_title.innerHTML = "No popups scheduled for today...";
    }
    // Start timer text
    if (next_ts) {
        var x = setInterval(function() {
            // Get today's date and time
            var now = new Date().getTime();

            // Find the distance between now and the count down date
            var distance = next_ts - now;

            // Time calculations for days, hours, minutes and seconds
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);
            // Display the result in the element with id="demo"
            countdown_str = ('0' + hours).slice(-2) + ":" + ('0' + minutes).slice(-2)  + ":" + ('0' + seconds).slice(-2) + "";
            document.getElementById("timer").innerHTML = countdown_str;

            // If the count down is finished, write some text
            if (distance < 0) {
              clearInterval(x);
            }
        }, 1000);
    }
});

