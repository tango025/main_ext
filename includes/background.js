/***************************************************************1**
 * onMessage from the extension or tab (a content script)
 *****************************************************************/
// chrome.runtime.onMessage.addListener(
//   function(request, sender, sendResponse) {
//     if (request.cmd == "any command") {
//       sendResponse({ result: "any response from background" });
//     } else {
//       sendResponse({ result: "error", message: `Invalid 'cmd'` });
//     }
//     // Note: Returning true is required here!
//     //  ref: http://stackoverflow.com/questions/20077487/chrome-extension-message-passing-response-not-sent
//     console.log('some response sent from background.js');
//     return true;

//   });