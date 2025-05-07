const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.send('Match Backend is running!');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Match Backend listening on port ${port}`);
});
