const express = require('express');
const app = express();
const PORT = 3002;

app.get('/', (req, res) => res.send('Server is working!'));

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Minimal Server running on port ${PORT}`);
});
