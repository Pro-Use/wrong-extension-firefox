const archiveContainer = document.getElementById('archiveContainer');
const projectContainer = document.getElementById('projectContainer');
let archiveData;
let allPopups = {};

let archive_url = "https://dev.10pm.studio/arebyte-ext/archive.json"
    // let url = 'https://plugin.arebyte.com/archive.json'
fetch(archive_url, {mode: 'cors'})
  .then(response => response.json())
  .then(data => {
    archiveData = data;
    buildArchive(data);
  })
  .catch(err => console.log(err))


  function buildArchive(jsonArray) {
    let index = 0;
    jsonArray.forEach(function(item) {
      var title = item.title;
      var curator = item.curator;
      var from = item.from;
      var img = item.img || "/placeholder.svg";
      from = from.replace(/-/g, '.');
      var to = item.to;
      to = to.replace(/-/g, '.');
      var element = document.createElement("div");
      element.innerHTML = `
      <a class="archive-item info-item red-shadow box" href="#project" data-index="${index}">
        <div class="archive-item--info-layer">
            <div class="archive-item--text">
                <h3 class="archive-item--title">${title}</h3>
                <p class="subhead">Curated by ${curator}</p>
                <p class="subhead">${from} – ${to}</p>
            </div>
            <button class="archive-item--cta">
                <span class="button-text">View Project</span> 
                <svg width="23" height="10" viewBox="0 0 23 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23 5L15.5 0.669873V9.33013L23 5ZM16.25 4.25L0 4.25V5.75L16.25 5.75V4.25Z" fill="white"/>
                </svg>
            </button>
        </div>
        <img srcset="${img}" class="background-image" />
      </a>
      `;
      archiveContainer.appendChild(element);
      
      index++;
    });
  }

  archiveContainer.addEventListener('click', (e) => {
    e.preventDefault();
    if (e.target.classList.contains('archive-item')) {
        e.preventDefault();
        console.log(window.pageXOffset);
        let index = e.target.dataset.index;
        buildProjectPage(archiveData[index]);
        openProjectPage(e);
    }
  });

  projectContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('close-info')) {
      e.preventDefault();
      e.target.closest('details').removeAttribute('open');
      console.log(e.target.closest('details'));
    }
  });

  function buildProjectPage(item) {
    var title = item.title;
      var curator = item.curator;
      var from = item.from;
      var img = item.img || "/placeholder.svg";
      var text = item.text;
      var popups = item.popups;
      from = from.replace(/-/g, '.');
      var to = item.to;
      to = to.replace(/-/g, '.');
      var element = document.createElement("div");
      element.innerHTML = `
        <img srcset="${img}" class="project-image" />
        <div class="project-main padding">
            <div class="project-info-box red-shadow box bg-white">
                <h3 class="archive-item--title">${title}</h3>
                <p class="subhead">Curated by ${curator}</p>
                <p class="subhead">${from} – ${to}</p>
                <details>
                    <summary> More Info </summary>
                    <div class="project-description">
                        ${text}
                        <button class="close-info">Hide Info</button>
                    </div>
                </details>
            </div>
            <div class="project-popups">
                <h3 class="box-header">Works:</h3>
                <div id="popupContainer"></div>
            </div>
        </div>
      `;
      projectContainer.innerHTML = "";
      projectContainer.appendChild(element);
      for (let i = 0; i < popups.length; i++) {
        allPopups[popups[i].id] = popups[i];
        let popupTitle = popups[i].popup_title;
        let popupTime =  popups[i].popup_time || "HH:MM:SS";
        let popupDate = popups[i].popup_date || "DD.MM.YYYY";
        let button = document.createElement('button');
        button.classList.add('popup-button', 'box', 'bg-white');
        button.dataset.popupid = popups[i].id;
        button.innerHTML = `
            <span class="button-title">${popupTitle}</span>
            <span class="button-times">${popupDate} – ${popupTime}</span>
            <svg id="Layer_2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 33 33"><g id="Layer_1-2"><path d="m32,0H12c-.55,0-1,.45-1,1v20c0,.55.45,1,1,1h20c.55,0,1-.45,1-1V1c0-.55-.45-1-1-1Zm-1,20H14.41l5.59-5.59v3.59h2v-6c0-.55-.45-1-1-1h-6v2h3.59l-5.59,5.59V2h18v18Z" fill="blue"/><path d="m20,31H2V13h7v-2H1c-.55,0-1,.45-1,1v20c0,.55.45,1,1,1h20c.55,0,1-.45,1-1v-8h-2v7Z" fill="blue"/></g></svg>        
        `;
        document.getElementById('popupContainer').appendChild(button);
        button.addEventListener("click", function () {
            // e.preventDefault();
            let id = this.dataset.popupid;
            let popup_info = allPopups[id];
            // console.log(popup_info)
            // info window
            let info_height = screen.height;
            let info_width = 450;
            let info_top = 0;
            let info_left = parseInt(screen.width-info_width);
            let popup_json = JSON.stringify({dims:[info_left,info_top,info_width,info_height], fullscreen:false, url:popup_info.info_url});
            port.postMessage(popup_json);
            // popup
            height = parseInt(popup_info.height);
            width = parseInt(popup_info.width);
            dims = []
            pos_arr = popup_info.position.split("-");
    //                horizontal
            if (pos_arr[1] === "left") {
                left = 0;
            } else if (pos_arr[1] === "center") {
                left = parseInt((screen.width-width)/2);
            } else if (pos_arr[1] === "right"){
                left = screen.width-width;
            }
    //                vertical
            if (pos_arr[0] === "top"){
                 popup_top = 0;
            } else if (pos_arr[0] === "mid") {
                 popup_top = screen.availHeight - height;
                 popup_top = parseInt(popup_top / 2);
            } else if (pos_arr[0] === "bottom"){
                 popup_top = screen.height-height;
            }
            dims.push(left, popup_top, width, height);
            msg = JSON.stringify({dims:dims, fullscreen:(popup_info.fullscreen == 'true'), url:popup_info.url});
            // console.log(msg);
            port.postMessage(msg);
        });
      }
  }

  function openProjectPage(event){
    const targetId = event.target.href.split('#')[1];
    const targetElement = document.getElementById(targetId);
    targetElement.addEventListener('transitionend', () => {
      targetElement.querySelector('.back-button').focus();
    });
    const targetIdName = `${targetId}--open`;
    document.body.classList.add(targetIdName);
  }