'use strict';

let smsStatus = false;
const THEME = {
  READY: "READY",
  WORKING: "WORKING",
  ERROR: "ERROR"
};
const THEME_VAR = {
  [THEME.READY]: {
    icon: "seaxGray.png",
    text: "ready"
  },
  [THEME.WORKING]: {
    icon: "seaxGreen.png",
    text: "working"
  },
  [THEME.ERROR]: {
    icon: "seaxRed.png",
    text: "error"
  },
};

function setThemeType(type) {
  // chrome.action.setBadgeText({ text: "ON" });
  // chrome.action.setBadgeBackgroundColor({ color: "#4688F1" });
  chrome.storage.local.set({
    theme: type
  }, async () => {
    
    // console.log("change theme", type);
  });
}


// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages

function openFlexTab() {
  var newURL = "https://flex.twilio.com/";
  console.log('TRIGGER WINDOW OPEN');
  chrome.windows.create({
    url: newURL,
    enfocados: true
  })
  /*
  chrome.tabs.create({
    url: newURL,
    active: true
  });*/
}

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({
    url: ["*://localhost/*", "*://flex.twilio.com/*"],
  });
  return tab;
}

async function sendMsgToFlexScript(request) {
  chrome.storage.local.get("theme", async ({
    theme: type
  }) => {
    if (type !== THEME.WORKING) {
      const tab = await getActiveTab();
      if (tab) {
        await chrome.tabs.sendMessage(tab.id, {
          ...request,
          from: "BACKGROUND",
        });
        await chrome.tabs.update(tab.id, {
          active: true
        });
      } else {
        setThemeType(THEME.READY);
        openFlexTab();
      }
    } else {
      setThemeType(THEME.ERROR);
    }
    })
}

chrome.runtime.onInstalled.addListener(async () => {
  setThemeType(THEME.READY);
  const tab = await getActiveTab();
  if (tab) {
    chrome.tabs.reload(tab.id);
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GREETINGS') {
    const message = `Hi ${
      sender.tab ? 'Con' : 'Pop'
    }, my name is Bac. I am from Background. It's great to hear from you.`;

    // Log message coming from the `request` parameter
    // Send a response message
    sendResponse({
      message,
    });
  }

  if (request.actionType === "dial" || request.actionType === "gotoCustomer" || request.actionType === "gotoInteraction") {
    sendMsgToFlexScript(request);
  }
});


chrome.action.onClicked.addListener(async () => {
  const tab = await getActiveTab();
  if (tab) {
    chrome.tabs.update(tab.id, {
      active: true
    });
  } else {
    openFlexTab();
  }
});