// Elements
const chatContainer = document.getElementById('chat-container');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const closeBtn = document.getElementById('close-btn');
const minimizeBtn = document.getElementById('minimize-btn');

// Configure Marked.js
marked.setOptions({
  gfm: true, // GitHub-flavored Markdown
  breaks: true, // Treat line breaks as real line breaks
  highlight: function (code, lang) {
    if (hljs.getLanguage(lang)) {
      return hljs.highlight(code, { language: lang }).value;
    } else {
      return hljs.highlightAuto(code).value;
    }
  }
});

// Add a chat message
async function addMessage(content, sender) {
  const message = document.createElement('div');
  message.classList.add('message', sender);

  if (sender === 'gpt') {
    // Parse Markdown to HTML safely
    const rawHtml = marked.parse(content);
    const safeHtml = DOMPurify.sanitize(rawHtml);
    message.innerHTML = safeHtml;

    // Highlight code blocks
    message.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block);
    });
  } else {
    // Plain text for user input
    message.textContent = content;
  }

  chatContainer.appendChild(message);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Handle send button
sendBtn.addEventListener('click', async () => {
  const prompt = userInput.value.trim();
  if (!prompt) return;

  addMessage(prompt, 'user');
  userInput.value = '';
  addMessage('Thinking...', 'assistant');

  const apiKey = await window.api.getApiKey();
  const response = await window.api.askChatGPT(apiKey, prompt);

  const thinkingMsg = document.querySelector('.assistant:last-child');
  if (thinkingMsg) thinkingMsg.remove();

  addMessage(response, 'gpt');
});

// Minimize & Close buttons
minimizeBtn.addEventListener('click', () => {
  console.log("🟡 Minimize button clicked");
  window.api.windowControl('minimize');
});

closeBtn.addEventListener('click', () => {
  console.log("🔴 Close button clicked");
  window.api.windowControl('close');
});

// Focus/Blur visual effect
window.api.onWindowBlur(() => {
  document.body.classList.add('inactive');
});

window.api.onWindowFocus(() => {
  document.body.classList.remove('inactive');
});
