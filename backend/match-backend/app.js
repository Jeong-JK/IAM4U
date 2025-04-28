const express = require('express');
const app = express();
const port = 80;

app.get('/', (req, res) => {
  res.send('Hello from Match Backend!');
});

app.listen(port, () => {
  console.log(`Match Backend app listening on port ${port}`);
});
