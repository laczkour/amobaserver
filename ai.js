var victorySamples = [
  /* Horizontal */
  'xxxx?',
  'xxx?x',
  'xx?xx',
  'x?xxx',
  '?xxxx',
  /* Vertical */
  'x|x|x|x|?',
  'x|x|x|?|x',
  'x|x|?|x|x',
  'x|?|x|x|x',
  '?|x|x|x|x',
  /* Diagonal 1 */
  'x____|_x___|__x__|___x_|____?',
  'x____|_x___|__x__|___?_|____x',
  'x____|_x___|__?__|___x_|____x',
  'x____|_?___|__x__|___x_|____x',
  '?____|_x___|__x__|___x_|____x',
  /* Diagonal 2 */
  '____x|___x_|__x__|_x___|?____',
  '____x|___x_|__x__|_?___|x____',
  '____x|___x_|__?__|_x___|x____',
  '____x|___?_|__x__|_x___|x____',
  '____?|___x_|__x__|_x___|x____'
];

if (typeof window === 'undefined') {
  var neataptic = require('neataptic');
  var fs = require('fs');
  var myNetwork;
  if (fs.existsSync('myNetwork.json')) {
    let content = fs.readFileSync('myNetwork.json', 'UTF-8');
    //console.log(content);
    myNetwork = neataptic.Network.fromJSON(JSON.parse(content));
  } else {
    myNetwork = new neataptic.architect.Perceptron(243, 300, 1);
  }
  var sampleTables = createSampleTables();
  aistart();
  var myNetworkString = JSON.stringify(myNetwork.toJSON());
  fs.writeFileSync('myNetwork.json', myNetworkString);
  fs.writeFileSync(
    'myNetwork.js',
    "var myNetwork = neataptic.Network.fromJSON(JSON.parse('" + myNetworkString + "'));"
  );
  console.log('files written');
} else {
  if (!myNetwork) var myNetwork = new neataptic.architect.Perceptron(243, 300, 1);
  else console.log('létező hálózat');
  var sampleTables = createSampleTables();
}

function aistart() {
  let trainingSet;
  var i = 0;
  while (i < 10) {
    trainingSet = sampleTables.getInputOutput();
    let result = myNetwork.train(trainingSet, { /*log: 1,*/ error: 0.0001, rate: 0.05, iterations: 20 });
    console.log('kész ' + i, result);

    i++;
  }
}

function aistart0() {
  gamearea = document.getElementById('game_area');

  var trainer = new synaptic.Trainer(myNetwork);

  var trainingSet = [
    {
      input: [0, 0],
      output: [0]
    },
    {
      input: [0, 1],
      output: [1]
    },
    {
      input: [1, 0],
      output: [0.5]
    },
    {
      input: [1, 1],
      output: [0]
    },
    {
      input: [0.5, 0.5],
      output: [0.35]
    }
  ];
  console.log(myNetwork.toJSON());
  trainer.train(trainingSet, { log: 1000, error: 0.0001, rate: 0.05, iterations: 200000 });
  console.log(myNetwork.toJSON());
  console.log(myNetwork.activate([0, 0]));
  console.log(myNetwork.activate([0, 1]));
  console.log(myNetwork.activate([1, 0]));
  console.log(myNetwork.activate([1, 1]));
  console.log(myNetwork.activate([0.5, 0.5]));
  console.log(myNetwork.activate([1.0, 0.5]));
}

/*
  network inputs:
  1*81 Saját szín: van-e a megfelelő pozícióban saját színű vagy nincs.
  1*81 Ellenfél szín: van-e a megfelelő pozícióban ellenséges színű vagy nincs
  1*81 Üres-e: a megfelelő pozícióba lehet-e rakni X-et

  output:
  Mennyire érdemes X-et rakni a középső helyre
  1.0: Megvan az 5-ös sor
  0.9: Az ellenfélnek meglenne az 5-ös sor ha odarakna
  0.7: két lépésen belül nyerni tudok ezzel a lépéssel
*/

var sample = 'xx?xx';
/* sample: 
'x': saját szín
'o': ellenfél szín 
'?': a vizsgálandó hely
' ': üres, használható hely
'#': üres, nem használható hely / fal
'_': bármilyen szín, pályán kívül
'-': bármi, üres hely, fal, foglalt hely
'|': sortörés
*/
function testSample(sample) {
  return createNeuralInputFromConcreteTable(createConcreteTableFromSampleTable(createSampleTableFromSample(sample)));
}

function createSampleTables() {
  let sampleTables = [];
  var itemFromSample = (sample, output) => {
    if (sample.replace) {
      sample = createSampleTableFromSample(sample);
    }
    let item = { table: sample, output: output };
    item.getInputOutput = () => {
      return {
        input: createNeuralInputFromConcreteTable(createConcreteTableFromSampleTable(item.table)),
        output: [item.output]
      };
    };
    sampleTables.push(item);
  };
  victorySamples.forEach(sample => itemFromSample(sample, 1));
  victorySamples.forEach(sample => {
    sample = sample.replace(new RegExp('x', 'g'), 'o');
    itemFromSample(sample, 0.9);
  });

  let dontPutTable = createSampleTableFromSample('?');
  dontPutTable[4][4] = '#';
  itemFromSample(dontPutTable, 0);

  dontPutTable = createSampleTableFromSample('?');
  dontPutTable[4][4] = 'x';
  itemFromSample(dontPutTable, 0);

  dontPutTable = createSampleTableFromSample('?');
  dontPutTable[4][4] = 'o';
  itemFromSample(dontPutTable, 0);

  sampleTables['getInputOutput'] = () => {
    var inputOutputs = [];
    sampleTables.forEach(item => {
      inputOutputs.push(item.getInputOutput());
    });
    return inputOutputs;
  };
  return sampleTables;
}

/*
Alog: 
sample 
-> createSampleTableFromSample creates a sample table, placing '-' in missing cell-s
-> createConcreteTableFromSampleTable puts Randomized concrete values in places of '_', '-'
-> convertToNeuralInput converts the concrete table into the 263 inputs the neural network uses

*/

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

function randomChar(charArray) {
  return charArray[Math.floor(Math.random() * charArray.length)];
}

function createSampleTableFromSample(sample) {
  sample = sample.replace('\n', '');
  let exclamationMark = sample.indexOf('!') != -1;
  if (exclamationMark) {
    sample = sample.replace('!', '?');
  }
  let splitSample = sample.split('|');
  let offsetX, offsetY;
  for (let i = 0; i < splitSample.length; i++) {
    let splitRow = splitSample[i];
    let x = splitRow.indexOf('?');
    if (x != -1) {
      offsetX = 4 - x;
      offsetY = 4 - i;
      break;
    }
  }
  let table = [[], [], [], [], [], [], [], [], []]; // 9
  for (let i = 0; i < splitSample.length; i++) {
    let splitRow = splitSample[i];
    for (let j = 0; j < splitRow.length; j++) {
      table[i + offsetY][j + offsetX] = splitRow.charAt(j);
    }
  }
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (table[i][j] === undefined) {
        table[i][j] = '-';
      }
    }
  }
  table[4][4] = exclamationMark ? '_' : ' ';
  return table;
}

function createConcreteTableFromSampleTable(table) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (table[i][j] === '-') {
        table[i][j] = randomChar(['x', 'o', ' ', '#']);
      } else if (table[i][j] === '_') {
        table[i][j] = randomChar(['x', 'o', '#']);
      }
    }
  }
  return table;
}

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
