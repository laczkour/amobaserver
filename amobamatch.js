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

function startNew(size0) {
  history = [];
  victory = false;
  size = size0 ? size0 : 10;
}

function move(x, y, color) {
  //console.log('move ', { x, y, color });
  if (!validMove(x, y, color)) return false;
  //console.log(history);
  //console.log('was valid');
  history.push([x, y]);
  isVictory();
  return true;
}

function validMove(x, y, color) {
  let valid = true;
  if (x >= size || x < 0 || y >= size || y < 0) return false;
  if (victory !== false) {
    return false;
  }
  history.forEach(step => {
    //console.log('step ', step, { x, y });
    if (step[0] === x && step[1] === y) {
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
  for (let j = 0; j < size; j++) {
    for (let i = 0; i < size; i++) {
      if (table[i][j] != ' ') {
        s += table[i][j];
      } else {
        s += '_';
      }
    }
    s += '\n';
  }
  //if (victory != false) {
  //  s += 'Győzelem: ' + victory;
  //}
  return s;
}

function createTable(xStarted) {
  let table = [];
  for (let i = 0; i < size; i++) {
    table[i] = [];
    for (let j = 0; j < size; j++) {
      table[i][j] = ' ';
    }
  }

  let stepX = xStarted ? true : false;
  history.forEach(step => {
    if (!table[step[0]]) table[step[0]] = [];
    table[step[0]][step[1]] = stepX ? 'x' : 'o';
    stepX = !stepX;
  });
  return table;
}
