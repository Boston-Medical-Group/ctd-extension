//import "./jquery.js";
window.$ = window.jQuery = require("jquery");
import contact from "./pages/contact.js";
import deal from "./pages/deal.js";
require("./mutation_events.js");

let pages = [contact, deal];

const setup = () => {
    document.body.removeEventListener("DOMSubtreeModified");
    
    const path = window.location.pathname;
    console.log('PATH', path)
    pages.forEach((page) => {
        if (Array.isArray(page.pathRegexs) === true) {
            page.pathRegexs.forEach((regex) => {
                if (path.match(regex)) {
                    page.onLoad();
                }
            });
        } else {
            if (path.match(page.pathRegex)) {
                page.onLoad();
            }
        }
    });
};

var pushState = history.pushState;
history.pushState = function () {
    pushState.apply(history, arguments);
    setup();
};

$(document).ready(() => {
    console.log("Loading MKTO extension...");
    setup();
})