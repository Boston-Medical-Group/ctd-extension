
const pathRegex1 = /\/contacts\/\d+\/deal\/(\d+).*/;
const pathRegex2 = /\/contacts\/\d+\/record\/[0]\-[3]\/(\d+).*/;
const pathRegexs = [pathRegex1, pathRegex2];

function addCallContactActivity() {
    // check if already added
    if ($(".tf-ctd-activity").length != 0) return;

    let activity, activity2, container;
    let containerOldVersion = $(
        ".namespaced-hack-section .private-list--inline > li > div"
    );
    let containerNewVersion = $(
        ".namespaced-hack-section .private-card__section > ul.private-list--unstyled"
    );

    // convert XML from SVG to base64
    const callIcon = '<svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>'
    const base64CallIcon = window.btoa(callIcon);

    if (containerOldVersion.length) {
        container = containerOldVersion;
        // Clone activity from an already existing one
        activity = $(container.find("div")
            .get(0))
            .clone();
        activity.addClass("tf-ctd-activity");
        
        activity
            .find("button")
            .css("background-image", `url("data:image/svg+xml;base64,${base64CallIcon}")`)
            .css("width", "16px")
            .css("height", "16px");
        
        activity2 = activity.clone();
    } else if (containerNewVersion.length) {
        container = containerNewVersion;
        container.css("flex-wrap", "wrap");
        // Clone activity from an already existing one
        activity = $(container.find("li")
            .get(0))
            .clone();
        activity.addClass("tf-ctd-activity");
        activity
            .find("button > span")
            .css("background-image", `url("data:image/svg+xml;base64,${base64CallIcon}")`)
            .css("width", "16px")
            .css("height", "16px");
        
        activity2 = activity.clone();
    } else {
        return;
    }

    if (activity == undefined) {
        return;
    }

    activity.find("button > span > span")
        .attr("class", "");
    activity.find("button > span > span > span")
        .attr("class", "");
    activity.find("span > div > div")
        .text("Call")
    activity.find("button > div")
        .text("Call");
    
    activity2.find("button > span > span")
        .attr("class", "");
    activity2.find("button > span > span > span")
        .attr("class", "");
    activity2.find("span > div > div")
        .text("Interactuar")
    activity2.find("button > div")
        .text("Interactuar");
    
    container.append(activity, activity2);

    activity.on("click", function () {
        window.NOW_PHONE = null;

        let crmId = window.location.pathname.split('/')[2];
        // Create a regexp that matches the following path /contacts/143575256/record/0-1/119 and capture the last number

        const match = pathRegex1.exec(window.location.pathname) || pathRegex2.exec(window.location.pathname);
        if (match) {
            crmId = match[1];
        } else {

        }
        window.postMessage({
            actionType: "dial",
            from: "USE_PAGE",
            phone: window.NOW_PHONE,
            deal_id: crmId
        });
    })

    activity2.on("click", function () {
        let crmId = window.location.pathname.split('/')[2];
        // Create a regexp that matches the following path /contacts/143575256/record/0-1/119 and capture the last number

        const match = pathRegex1.exec(window.location.pathname) || pathRegex2.exec(window.location.pathname);
        if (match) {
            crmId = match[1];
        } else {

        }
        window.postMessage({
            actionType: "gotoCustomer",
            from: "USE_PAGE",
            deal_id: crmId
        });
    })
}
function attachListeners() {
    $("body").on("DOMSubtreeModified", function () {
        addCallContactActivity();
    });
}
function onLoad() {
    attachListeners();
}
export default {
    onLoad,
    pathRegexs,
};