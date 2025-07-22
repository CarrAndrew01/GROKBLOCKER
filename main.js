const elements = [];
let hidden = true; //by default, we're hidden
let on = true;
let shadow = null;

main();

// Save data
async function saveData(bool) {
    try {
        console.log("saving: " + bool);
        await chrome.storage.local.set({ "On": bool });
        console.log("Save successful");
    } catch (error) {
        console.error("Error saving data:", error);
        throw error; // Or handle it differently based on your needs
    }
}

// Retrieve data
async function getData() {
  const result = await chrome.storage.local.get(["On"]);
  //console.log(result.On);
  return result.On;
}



async function InjectShadowSwitch(shadow, container) {
  if (document.getElementById("grok-widget-container")) return;

  const html = await fetch(chrome.runtime.getURL("switch.html"))
      .then(res => res.text());

  shadow.innerHTML = html;

  document.body.appendChild(container);

  const onOff = shadow.getElementById("OnOffSwitchScreen");

  if (onOff) {
    const checkbox = onOff.querySelector("#OnOffCheckbox");
     checkbox.addEventListener("click", () => {
        hidden = !hidden;
        HideOrReveal();
    });
    onOff.style.display = "none";
  }
}
 

/*
    Returns true if the element passed in is already inside the list
*/
function CheckAgainstList(element){
    return elements.includes(element);
}

/*
Hides or displays everything in elements depending on the variable passed in
true=hide, false=show
*/
function HideOrReveal(hide){
    elements.forEach((grok) => {
        if(grok != null){
            hide ? grok.style.display = "none" : grok.style.display = "";
        }
    })
}

 
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in content script:", message);
  if (message.action === "turnOff") {
    OnOffSwitchFunc();
    sendResponse(message);
  }
  return true; // Keep the message channel open for async response
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Message received in content script:", message);
  if (message.action === "InitialEnablePopup") {
    InitialSaveDataFunc();
    sendResponse(message);
  }
  return true; // Keep the message channel open for async response
});



/*
called when the popup is created, just checks if we have already have iit saved or if this is the
first time use

*/
async function InitialSaveDataFunc(){

    on = await getData();

    if(on === undefined){
        await saveData(true);
    }
}


/*



*/
async function OnOffSwitchFunc() {
    if(shadow == null) return;
    //when turned off, 
    const onOff = shadow.getElementById("OnOffSwitchScreen");   
 
    current = await getData();
    console.log("curre: " + current);
    

    await saveData(!current);
    onOff.style.display = current ? "none" : "";

}





async function main(){
    console.log("mainbeingcalled?");

    //just make this now but keep it hidden
    const container = document.createElement("div");
    shadow = container.attachShadow({ mode: "open" });

    container.id = "grok-widget-container";
    
    InjectShadowSwitch(shadow, container);


    //we're handling everything with a mutationobserver, that works for changing pages and loading new comments
    //TODO: clean the array 

    const observer = new MutationObserver(async () => {

        
        if(await getData() == false){ 
            console.log("false");
            return;
        } 

        onOff = shadow.getElementById("OnOffSwitchScreen");//grabbing this now

        //back out and get rid of the switch if we aren't on a status page
        const url = window.location.href;
        const urlParts = url.split('/');
        if(!urlParts.includes("status")){ //I'm not 100% sure about this (TODO)
             if (onOff) {
                onOff.style.display = "none";
            }
            return;
        }

        onOff.style.display = "";//why does this mean "show" ?
 
        
        const tweets = document.querySelectorAll('[data-testid="cellInnerDiv"]');//get all the comments, this also picks up the OP
        if (tweets.length > 0) {

            //if we have any tweets and the switch doesn't already exist
            ignoreFirstPost = false; //as far as I can tell, there's nothing differentiating the OP and replies in twitters html, so this is the workaround to not hide OP

            tweets.forEach((userItem) => { //loopedy
            
                let test = userItem.querySelector('a[href="/grok"]'); //for now, it just finds a link to the grok page. This may not be flexible enough ( TODO )

                if(test!=null && ignoreFirstPost){
                     if(!CheckAgainstList(userItem)){
                        elements.push(userItem); // Use push to append
                    }
                }
                ignoreFirstPost = true;
            });   
        }
 
        HideOrReveal(hidden);
    });


    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}