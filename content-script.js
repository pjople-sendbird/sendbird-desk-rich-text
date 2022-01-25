function init() {
  const chatLayout = document.querySelector('#ChatThreadGridItem [class^="DeskChatLayout"]')

  if (!chatLayout) {
    setTimeout(init, 1000)
    return
  }

  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
  const observer = new MutationObserver(format)
  observer.observe(chatLayout, {attributes: false, childList: true, subtree: false })

  loadEditorScript()
}

function format() {
  const chatBubbles = document.querySelectorAll('[class^="ChatBubble__MessageText"]')
  const ticketsLastMessages = document.querySelectorAll('[class^="ticketItem__TicketMessage"]')

  Array.from([...chatBubbles, ...ticketsLastMessages])
    .filter(cB => !cB?.children?.length)
    .forEach(chatBubble => {
      chatBubble.innerHTML = textToHtml(chatBubble.innerText)
    })
}

function textToHtml(text) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/html')
  doc.querySelectorAll('script').forEach(script => script.remove())
  return doc.body.innerHTML
}

function loadDependencies() {
  const dependencies = [ "woofmark.min.js", "megamark.min.js", "domador.min.js" ]
  const promises = dependencies.map(d => {
    return new Promise(resolve => {
      var s = document.createElement('script');
      s.src = chrome.runtime.getURL(d);
      s.onload = function() {
          this.remove();
          resolve()
      };
      (document.head || document.documentElement).appendChild(s);
    })
  })
  return Promise.all(promises)
}

async function loadEditorScript() {
  await loadDependencies()
  var s = document.createElement('script');
  s.src = chrome.runtime.getURL('editor.js');
  s.onload = function() {
      this.remove();
  };
  (document.head || document.documentElement).appendChild(s);
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === 'TabUpdated' && request?.options?.tab?.url?.indexOf('/desk/conversation') > -1) {
    console.log('TabUpdated', document.location.href);
    init()
  }
})