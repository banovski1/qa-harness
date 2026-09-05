const app = require('express')();

app.get('/api/only-in-source', (req, res) => res.json([]));

module.exports = app;
