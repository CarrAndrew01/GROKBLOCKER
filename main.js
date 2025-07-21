main();

const elements = [];
hidden = true; //by default, we're hidden



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


function OnSwitchToggle(isChecked) {
    console.log(`onSwitchToggle called: Switch is ${isChecked ? 'ON' : 'OFF'}`);
    // Your custom logic here
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
        console.log("1");
        if(grok != null){
            hide ? grok.style.display = "none" : grok.style.display = "";
        }
    })
}


async function main(){

    //just make this now but keep it hidden
    const container = document.createElement("div");
    const shadow = container.attachShadow({ mode: "open" });

    container.id = "grok-widget-container";
    
    InjectShadowSwitch(shadow, container);


    //we're handling everything with a mutationobserver, that works for changing pages and loading new comments
    //TODO: clean the array 

    const observer = new MutationObserver(() => {

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