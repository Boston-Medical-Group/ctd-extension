'use strict';

window.$ = window.jQuery = require("jquery");

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

//console.log('INSERTING');
const script = document.createElement("script");
script.setAttribute("type", "module");
script.setAttribute("src", chrome.runtime.getURL("hubspot.js"));
const head =
  document.head ||
  document.getElementsByTagName("head")[0] ||
  document.documentElement;
head.insertBefore(script, head.lastChild);
//console.log('INSERTED');
/*
window.addEventListener("load", function (event) {
  // Log `title` of current active web page
  const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
  console.log(
    `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
  );
  addCallContactActivity()
})

function addCallContactActivity() {
  console.log('INSERTING CALL BUTTON');
  // check if already added
  if ($(".tf-ctd-activity").length != 0) return;

  let activity, container;
  let containerOldVersion = $(
    ".namespaced-hack-section > .private-card__section > .private-list--inline > li > div"
  );
  let containerNewVersion = $(
    ".namespaced-hack-section > .private-card__section > ul.private-list--unstyled"
  );

  if (containerOldVersion.length) {
    console.log('INSERTING CALL BUTTON IN OLD CONTAINER');
    container = containerOldVersion;
    // Clone activity from an already existing one
    activity = $(container.find("div")
      .get(0))
      .clone();
    activity.addClass("tf-ctd-activity");
  } else if (containerNewVersion.length) {
    console.log('INSERTING CALL BUTTON IN NEW CONTAINER');
    container = containerNewVersion;
    // Clone activity from an already existing one
    activity = $(container.find("li")
      .get(0))
      .clone();
    activity.addClass("tf-ctd-activity");
  } else {
    console.log('NOT INSERTING CALL BUTTON');
    return;
  }

  if (activity == undefined) {
    console.log('NOT INSERTING CALL BUTTON FUNCTIONALITY');
    return;
  }

  activity.find("button > span > span")
    .addClass("fAMDNF");
  activity.find("button > span > span > span")
    .addClass("phone");
  activity.find("span > div > div")
    .text("Call")
  activity.find("button > div")
    .text("Call");

  container.append(activity);
  console.log('INSERTED CALL BUTTON');

  activity.on("click", function () {
    let phoneElement = $('span[data-test-id="phone"] a[href^="tel:"]');
    if (phoneElement.length) {
      let phoneHref = phoneElement.attr('href');
      window.NOW_PHONE = phoneHref.split(':')[1];
    }
    if (window.NOW_PHONE === undefined) {
      return;
    }

    let crmId = window.location.pathname.split('/')[2];

    chrome.runtime.sendMessage({
      actionType: "dial",
      from: "USE_PAGE",
      phone: window.NOW_PHONE,
      url: window.location.href
    });
  })
}*/

window.addEventListener("message", function (event) { 
  if (event.data.from == 'USE_PAGE' &&
    (event.data.actionType === 'dial' || event.data.actionType === 'gotoCustomer')
  ) {
    chrome.runtime.sendMessage({
      ...event.data,
      from: 'CONTENT_SCRIPT'
    })
  }
})