const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Matching API is running!');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Matching API listening on port ${port}`);
});
