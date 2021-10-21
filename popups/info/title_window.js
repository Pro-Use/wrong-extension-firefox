var work_titles = {
    gretchenandrew:"Gretchen Andrew - The Next American President",
    sofiacrespo:"Sofia Crespo x Dark Fractures - Artificial Remnants",
    disnovation:"DISNOVATION.ORG - Predictive Art Bot",
    jakeelwes:"Jake Elwes - Zizi - Queering the Dataset",
    bengrosser:"Ben Grosser - Tracing You",
    libbyheaney:"Libby Heaney - Elvis",
    joelsimon:"Joel Simon - Artbreeder"
};

chrome.storage.local.get(['last_triggered'], function(result) {
     let last_triggered = result.last_triggered;
     console.log(last_triggered);
     if (last_triggered !== undefined) {
         //document.getElementById(last_triggered).style.display = "block";
         title_div = document.getElementById("ctrl-title");
         title_div.textContent = work_titles[last_triggered];
         document.title = work_titles[last_triggered];
     }
    var new_width = (document.getElementById("title").offsetWidth + 10) - window.innerWidth;
    var new_height = (document.getElementById("title").offsetHeight + 10) - window.innerHeight;
    console.log(new_width, new_height);
    window.resizeBy(new_width, new_height);
});

//Design close buttons
const buttons = document.querySelectorAll('.close');

buttons.forEach(function(currentBtn){
  currentBtn.onclick = () =>  {
      window.close();
  };
});

//Close after timeout

setTimeout(function(){ 
    window.close(); 
}, 3000);


