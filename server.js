const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

app.use(cors());
app.use(express.json());

// Route pour tester la clé API
app.post('/test-key', async (req, res) => {
    try {
        const { apiKey } = req.body;
        const response = await fetch('https://api.groq.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [{ role: "user", content: "Réponds 'OK' si tu reçois ce message." }],
                temperature: 0.3,
                max_tokens: 10
            })
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Route pour envoyer des requêtes
app.post('/send', async (req, res) => {
    try {
        const { apiKey, transcript } = req.body;
        const response = await fetch('https://api.groq.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "mixtral-8x7b-32768",
                messages: [{
                    role: "user",
                    content: `Analyse cette phrase en français: "${transcript}". Donne une réponse concise.`
                }],
                temperature: 0.3,
                max_tokens: 256
            })
        });
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
