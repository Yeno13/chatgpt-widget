require('dotenv').config();
const axios = require('axios');

const API_KEY = process.env.OPENAI_API_KEY;

async function askChatGPT(prompt) {
    try {
        const response = await axios.post (
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${API_KEY}`,
                },
            }
        );
        return response.data.choices[0].message.content.trim();
        } catch (error) {
            console.error('Error communicating with OpenAI API:', error);
            return "Sorry I couldn't reach CHatGPT";
            }
            }
    module.exports = { askChatGPT };