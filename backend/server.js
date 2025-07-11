const express = require('express');
const cors = require('cors');
const routes = require('./routes'); // make sure path is correct

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'http://localhost:5173', // for local frontend
  credentials: true
}));

app.use(express.json());
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
