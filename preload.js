const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  onWindowBlur: (callback) => ipcRenderer.on('window-blur', callback),
  onWindowFocus: (callback) => ipcRenderer.on('window-focus', callback),
  getApiKey: () => ipcRenderer.invoke('get-api-key'),

  askChatGPT: async (apiKey, prompt) => {
    console.log("📝 Asking ChatGPT:", prompt);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }]
        })
      });

      console.log("📦 Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API error:", errorText);
        throw new Error(`API Error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      console.log("✅ ChatGPT response:", JSON.stringify(data, null, 2));
      return data.choices[0].message.content;
    } catch (err) {
      console.error("💥 ChatGPT API call failed:", err);
      return `⚠️ Error: ${err.message}`;
    }
  },

  windowControl: (action) => {
    console.log("🪟 Window control action:", action);
    ipcRenderer.send('window-control', action);
  }
});
