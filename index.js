const express = require("express");
const app = express();

app.get('/posts', (req, res) => {
    res.json({ data: 'posts' });
});

app.get('/posts/:id', (req, res) => {
    res.json({ data: `post - ${id}`});
});

app.listen(8080, () => {
    console.log("Express API running at 8080");
})

