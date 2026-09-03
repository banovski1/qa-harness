const app = require('express')();
app.get('/api/widgets', (req, res) => res.json([]));
app.post('/api/widgets/:widgetId', (req, res) => res.sendStatus(201));
