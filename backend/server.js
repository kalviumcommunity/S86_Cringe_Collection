const express = require('express');
const routes = require('../S86_Cringe_Collection/routes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
