var neataptic = require('neataptic');
var fs = require('fs');
var myNetwork;
if (fs.existsSync('myNetwork.json')) {
  let content = fs.readFileSync('myNetwork.json', 'UTF-8');
  myNetwork = neataptic.Network.fromJSON(JSON.parse(content));
} else {
  myNetwork = new neataptic.architect.Perceptron(243, 300, 1);
}
var ai = require('./ai.js');
ai.setNetwork(myNetwork);

var size = 10;

// GA settings
var PLAYER_AMOUNT = 32;
var MUTATION_RATE = 0.3;
var ELITISM_COUNT = 1;
var neat;

function initNeat() {
  neat = new neataptic.Neat(243, 1, null, {
    mutation: [
      neataptic.methods.mutation.ADD_NODE,
      neataptic.methods.mutation.SUB_NODE,
      neataptic.methods.mutation.ADD_CONN,
      neataptic.methods.mutation.SUB_CONN,
      neataptic.methods.mutation.MOD_WEIGHT,
      neataptic.methods.mutation.MOD_BIAS,
      neataptic.methods.mutation.MOD_ACTIVATION
      /* Methods.Mutation.ADD_GATE,
        Methods.Mutation.SUB_GATE,
        Methods.Mutation.ADD_SELF_CONN,
        Methods.Mutation.SUB_SELF_CONN,
        Methods.Mutation.ADD_BACK_CONN,
        Methods.Mutation.SUB_BACK_CONN*/
    ],
    popsize: PLAYER_AMOUNT,
    mutationRate: MUTATION_RATE,
    elitism: ELITISM_COUNT,
    network: myNetwork
  });
}

function createTournament() {
  var competitors = neat.population;
  console.log(competitors);
}

function createMatch(x, o) {}

initNeat();
createTournament();
