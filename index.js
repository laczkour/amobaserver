const express = require('express');
const { createTable, drawTable, isVictory, move, startNew, validMove } = require('./amobamatch.js');
const app = express();

var moveEventX = [];
var moveEventO = [];

startNew();

app.get('/reset', (req, res) => {
  history = [];
  res.send('Game reseted');
});

app.get('/move/x', (req, res) => {
  if (move(req.query.x, req.query.y, 'x')) {
    let table = drawTable(createTable());
    res.send(table);
    moveEventX.forEach(res0 => res0.send(table));
    moveEventX = [];
  } else {
    res.status(400).send('Hibás lépés');
  }
});

app.get('/move/o', (req, res) => {
  if (move(req.query.x, req.query.y, 'o')) {
    let table = drawTable(createTable());
    res.send(table);
    moveEventO.forEach(res0 => res0.send(table));
    moveEventO = [];
  } else {
    res.status(400).send('Hibás lépés');
  }
});

app.get('/waitfor/x', (req, res) => {
  moveEventX.push(res);
});

app.get('/waitfor/o', (req, res) => {
  moveEventO.push(res);
});

app.get('/table', (req, res) => {
  res.send(drawTable(createTable()));
});

app.get('/whowon', (req, res) => {
  res.send(victory);
});

app.get('/', (req, res) => res.send('Hello World!'));
app.listen(3000, () => console.log('Example app listening on port 3000!'));
