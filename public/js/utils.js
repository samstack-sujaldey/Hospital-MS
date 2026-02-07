const API_BASE = 'http://localhost:3000/api';

async function fetchAPI(endpoint, options = {}) {
    const response = await fetch(`${API_BASE}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${localStorage.getItem('token')}` // If we had real auth
        },
        ...options
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }
    return response.json();
}
