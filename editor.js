function woofmarkInit() {
  const sendbirdEditable = document.querySelector('div[data-test-id="ContentEditable"]')
  const sendButton = document.querySelector('button[data-test-id="SendMessageButton"]')
  const reactPropsAttribute = Object.keys(sendbirdEditable).find(k => k.startsWith('__reactProps'))

  if (!sendbirdEditable || !reactPropsAttribute) {
    setTimeout(woofmarkInit, 1000)
    return
  }

  const editablesContainer = sendbirdEditable.parentElement
  const woofmarkTextareaContainer = document.createElement("div")
  const woofmarkTextarea = document.createElement("textarea")
  woofmarkTextarea.id = "woofmark-textarea"
  woofmarkTextareaContainer.appendChild(woofmarkTextarea)
  editablesContainer.appendChild(woofmarkTextareaContainer)
  sendbirdEditable.hidden = true

  const woofmarkEditor = woofmark(woofmarkTextarea, {
    defaultMode: 'wysiwyg',
    parseMarkdown: megamark,
    parseHTML: domador,
    image: null,
    attachments: null
  })

  woofmarkEditor.editable.addEventListener('keyup', (event) => {
    const newText = woofmarkEditor.editable.innerHTML
    sendbirdEditable.textContent = newText
    sendbirdEditable[reactPropsAttribute].onKeyUp(event, newText)
  })

  sendButton.addEventListener('click', () => {
    if (!sendButton.disabled) {
      woofmarkEditor.value("")
    }
  })

  removeImagesFromOptions()
  console.log('𝐓𝐭 woofmark editor initialised');
}

function removeImagesFromOptions() {
  const commands = Array.from(document.querySelectorAll('.wk-command'))
  const imageCommand = commands.find(c => (
    c.title.toLowerCase() +
    c.textContent.toLowerCase()
  ).indexOf('image') > -1)

  if (imageCommand) {
    imageCommand.remove()
  }
}

if (document.querySelector('.wk-container')) {
  document.querySelector('.wk-container').remove()
}
woofmarkInit()