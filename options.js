
/*
courtesy of ChatGPT, easier than finding the last time I did this and copy/pasting
*/


// Retrieve data
async function InitialFlip() {

  const toggleSwitch = document.getElementById("OnOffCheckboxPopup");

  const result = await chrome.storage.local.get(["On"]);

  toggleSwitch.checked = result.On;

}







document.addEventListener("DOMContentLoaded", () => {
  const toggleSwitch = document.getElementById("OnOffCheckboxPopup");
  InitialFlip();

  toggleSwitch.addEventListener("change", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            action: "turnOff",
            value: toggleSwitch.checked,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error sending message:", chrome.runtime.lastError.message);
              return;
            }
            console.log("Response from content script:", response);
          }
        );
      } else {
        console.error("No active tab found");
      }
    });
  });

  //also, flip the switch depending on the current value

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          {
            action: "InitialEnablePopup",
            checked: toggleSwitch.checked,
            element: toggleSwitch
           },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error("Error sending message:", chrome.runtime.lastError.message);
              return;
            }
            console.log("Response from content script:", response);
          }
        );
      } else {
        console.error("No active tab found");
      }
    });
  

});

