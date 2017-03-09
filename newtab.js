[
  'onBeforeRequest',
  'onBeforeSendHeaders',
  'onSendHeaders',
  'onHeadersReceived',
  'onAuthRequired',
  'onResponseStarted',
  'onBeforeRedirect',
  'onCompleted',
  'onErrorOccurred'
].forEach(addListener)

function addListener (eventName, index) {
  chrome.webRequest[eventName].addListener(
    console.log.bind(console, eventName),
    { urls: ['<all_urls>'] })
}
