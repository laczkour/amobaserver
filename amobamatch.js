module.exports = {
  startNew,
  move,
  validMove,
  isVictory,
  drawTable,
  createTable
};

var history = [];
var victory = false;
var size = 10;

function startNew() {
  history = [];
  victory = false;
  size = 10;
}

function move(x, y, color) {
  if (!validMove(x, y, color)) return false;
  history.push([x, y]);
  isVictory();
  return true;
}

function validMove(x, y, color) {
  let valid = true;
  if (x > size || x < -size || y > size || y < -size) return false;
  if (victory !== false) {
    return false;
  }
  history.forEach(step => {
    if (step.x === x && step.y === y) {
      valid = false;
    }
  });
  if (history.length % 2 == 0 && color == 'o') valid = false;
  else if (history.length % 2 == 1 && color == 'x') valid = false;
  return valid;
}

function isVictory() {
  let table = createTable();
  let lastStep = history[history.length - 1];
  let stepColor = history.length % 2 ? 'o' : 'x';
  let i, j, x, y;
  let getCellColor = (x, y) => {
    if (!table[x]) return '';
    if (!table[x][y]) return '';
    return table[x][y];
  };
  let maxLength = 0;
  [
    index => getCellColor(lastStep[0] + index, lastStep[1]) == stepColor,
    index => getCellColor(lastStep[0], lastStep[1] + index) == stepColor,
    index => getCellColor(lastStep[0] + index, lastStep[1] + index) == stepColor,
    index => getCellColor(lastStep[0] - index, lastStep[1] + index) == stepColor
  ].forEach(algo => {
    maxLength = Math.max(maxLength, catchMaxLength(algo));
  });
  if (maxLength >= 5) {
    victory = stepColor;
    return true;
  }
  return false;
}

function catchMaxLength(algo) {
  let index = -5;
  let length = 0;
  let maxLength = 0;
  var goodColor = algo(index++);
  while (index < 6) {
    if (goodColor) length++;
    else {
      length = 0;
    }
    if (maxLength < length) {
      maxLength = length;
    }
    goodColor = algo(index++);
  }
  return maxLength;
}

function drawTable(table) {
  var s = '';
  for (let j = -size; j < size + 1; j++) {
    for (let i = -size; i < size + 1; i++) {
      s += ' ' + table[i][j] + ' ';
    }
    s += '<br>';
  }
  if (victory != false) {
    s += 'Győzelem: ' + victory;
  }
  return s;
}

function createTable() {
  let table = [];
  for (let i = -size; i < size + 1; i++) {
    table[i] = [];
    for (let j = -size; j < size + 1; j++) {
      table[i][j] = '_';
    }
  }
  let stepX = true;
  history.forEach(step => {
    if (!table[step[0]]) table[step[0]] = [];
    table[step[0]][step[1]] = stepX ? 'x' : 'o';
    stepX = !stepX;
  });
  return table;
}
