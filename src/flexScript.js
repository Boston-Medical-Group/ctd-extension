console.log(`Flex Script Init`);
chrome.runtime.onMessage.addListener((request) => {
    sendMsgToInjectScript(request);
});
async function sendMsgToInjectScript(request) {
    window.postMessage({
        ...request,
        from: "FLEX_SCRIPT"
    });
}
function receiveMessage(event) {
    const {
        data
    } = event;
    if (data.from === 'FLEX') {
        chrome.runtime.sendMessage({
            ...data,
            from: 'FLEX_SCRIPT'
        })
    }
}
window.addEventListener("message", receiveMessage);