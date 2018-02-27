if (typeof window === 'undefined') {
  var myNetwork;
  setNetwork = function(network) {
    myNetwork = network;
  };
  module.exports = { createWeightsFromTable, setNetwork, move };
} else {
  if (!myNetwork) var myNetwork = new neataptic.architect.Perceptron(243, 300, 1);
}

const mindiff = 0.000000001;

function move(table, size) {
  //console.log(table);
  table = createWeightsFromTable(table, size);
  let max = [[0, 0]];
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (table[i][j] > table[max[0][0]][max[0][1]] + mindiff) {
        max = [[i, j]];
      } else if ((table[i][j] > table[max[0][0]][max[0][1]]) - mindiff) {
        max.push([i, j]);
      }
    }
  }
  if (max.length == 1) {
    return { x: max[0][0], y: max[0][1] };
  } else {
    var k = Math.floor(Math.random() * max.length);
    //console.log(max, k, max[k]);
    return { x: max[k][0], y: max[k][1] };
  }
  //return { x: imax, y: jmax };
}

function createWeightsFromTable(table, size) {
  let weightTable = [];
  for (let i = 0; i < size; i++) {
    weightTable.push([]);
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

function dumpNeuralInput(input) {
  let txt = '';
  for (let i = 0; i < 243; i++) {
    txt += input[i];
    if (i % 81 == 80) txt += '\n';
  }
  console.log(txt);
}

function createOneWeightFromTable(table, x, y) {
  table9x9 = [[], [], [], [], [], [], [], [], []]; // 9
  let ii = 0;
  let jj = 0;
  for (let i = x - 4; i < x + 5; i++) {
    jj = 0;
    for (let j = y - 4; j < y + 5; j++) {
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
  //console.log({ x, y });
  //console.log(_drawTable(table9x9));
  //dumpNeuralInput(neuralInput);
  //var z;
  //console.log(z[10].hallo);
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
      let free = ' ?'.indexOf(table[i][j]) != -1 ? 1 : 0;
      nerualInput[index] = x;
      nerualInput[index + 81] = o;
      nerualInput[index + 162] = free;
      index++;
    }
  }
  return nerualInput;
}
