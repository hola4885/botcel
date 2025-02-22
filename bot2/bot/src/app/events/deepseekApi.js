const axios = require('axios');

class DeepSeekApi {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.apiUrl = 'https://api.deepseek.com/v3/chat'; // Reemplaza con la URL real de la API
    }

    async getResponse(message) {
        try {
            const response = await axios.post(this.apiUrl, {
                message: message
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            return response.data.response; // Ajusta según la estructura de la respuesta de la API
        } catch (error) {
            console.error('Error calling DeepSeek API:', error);
            throw error;
        }
    }
}

module.exports = DeepSeekApi;