var info_div = document.createElement("div");
//var node = document.createTextNode("i");
//info_div.appendChild(node);
info_div.id = "rtc_info_button";
document.body.appendChild(info_div);

 var port = chrome.extension.connect({
      name: "info_click"
 });

info_div.onmouseover = () => port.postMessage("info_up");
info_div.onmousedown = () => port.postMessage("ctrl-link")
