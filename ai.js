if (!myNetwork) var myNetwork = new neataptic.architect.Perceptron(243, 300, 1);
else console.log('létező hálózat');

function createWeightsFromTable(table, size) {
  let weightTable = [[], [], [], [], [], [], [], [], []]; // 9
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      let weight = createOneWeightFromTable(table, i, j);
      weightTable[i][j] = weight;
    }
  }
  return weightTable;
}
function _drawTable(table) {
  let txt = '';
  for (let i = 0; i < 9; i++) {
    txt += '\n';
    for (let j = 0; j < 9; j++) {
      txt += table[i][j];
    }
  }
  return txt;
}
function createOneWeightFromTable(table, x, y) {
  table9x9 = [[], [], [], [], [], [], [], [], []]; // 9
  let ii = 0;
  let jj = 0;
  for (let i = x - 4; i < x + 4; i++) {
    jj = 0;
    for (let j = y - 4; j < y + 4; j++) {
      if (table[i] && table[i][j]) {
        table9x9[ii][jj] = table[i][j];
      } else {
        table9x9[ii][jj] = '#';
      }
      jj++;
    }
    ii++;
  }
  //console.log(table9x9);
  let neuralInput = createNeuralInputFromConcreteTable(table9x9);
  return myNetwork.activate(neuralInput);
}

/** Duplicated code from aiTrain.js */
function createNeuralInputFromConcreteTable(table) {
  let index = 0;
  let nerualInput = [];
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      let x = table[i][j] == 'x' ? 1 : 0;
      let o = table[i][j] == 'o' ? 1 : 0;
      let free = ' ?'.charAt(table[i][j]) != -1 ? 1 : 0;
      nerualInput[index] = x;
      nerualInput[index + 81] = o;
      nerualInput[index + 162] = free;
      index++;
    }
  }
  return nerualInput;
}
