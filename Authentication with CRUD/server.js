const express = require('express');
const app = express();
const db = require('./db');
const personRoutes = require('./Routes/personRoutes');
const bodyParser = require('body-parser');

db;

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("WelCome to Online Judge");
})
app.use('/', personRoutes);

app.listen(5000, () => {
    console.log("Listening on Port 5000");
});

