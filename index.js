const express = require('express');
const fs = require('fs');
const jsonParser = express.json();
const app = express();


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/css/custom.css', (req, res) => {
    res.sendFile(__dirname + '/css/custom.css');
});

app.get('/js/custom.js', (req, res) => {
    res.sendFile(__dirname + '/js/custom.js');
});

app.get('/result', (req, res) => {
    const dataBase = fs.readFileSync('result.json', "utf8");
    const arr = JSON.parse(dataBase);
    if (arr.length < 10) {
        res.send(dataBase);
    } else {
        const top10 = JSON.stringify(arr.slice(0, 10));
        res.send(top10);
    }
});

app.post("/form", jsonParser, (req, res) => {
    const dataBase = fs.readFileSync('result.json', "utf8");
    const setData = JSON.parse(dataBase).concat(req.body).sort((a, b) => {
        if (a.result < b.result) return 1;
        if (a.result > b.result) return -1;
        return 0;
    });
    fs.writeFileSync('result.json', JSON.stringify(setData));
    if (!req.body) return res.sendStatus(400);
    return res.json(setData);
});

app.post("/clean", jsonParser, (req, res) => {
    fs.writeFileSync('result.json', '[]');
    if (!req.body) return res.sendStatus(400);
    return res.json();
});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/404.html');
});

app.listen(3000);