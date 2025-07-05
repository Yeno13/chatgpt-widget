const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const closeBtn = document.getElementById('close-btn');
const minimizeBtn = document.getElementById('minimize-btn');


async function addMessage(content, sender) {
  const message = document.createElement('div');
  message.classList.add('message', sender);
  message.innerHTML = content;
  chatContainer.appendChild(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

sendBtn.addEventListener('click', async () => {
  const prompt = userInput.value.trim();
  if (!prompt) return;

  addMessage(prompt, 'user');
  userInput.value = '';
  addMessage('Thinking...', 'assistant');

  const apiKey = await window.api.getApiKey();
  const response = await window.api.askChatGPT(apiKey, prompt);

  const thinkingMsg = document.querySelector('.assistant:last-child');
  thinkingMsg.remove();

  addMessage(response, 'assistant');
});

minimizeBtn.addEventListener('click', () => {
  console.log("minimize button clicked");
  window.api.windowControl('minimize');
});

closeBtn.addEventListener('click', () => {
  console.log("close button clicked");
  window.api.windowControl('close');
});

window.api.onWindowBlur(() => {
  document.body.classList.add('inactive');
});

window.api.onWindowFocus(() => {
  document.body.classList.remove('inactive');
});
