const neataptic = require('neataptic');
const fs = require('fs');
const ai = require('./ai.js');
const match = require('./amobamatch.js');
const competitorFile = 'evolvePopulation.json';
var myNetwork;

var PLAYER_AMOUNT = 256;
var MUTATION_RATE = 0.3;
var ELITISM_COUNT = 8;
var size = 6;

if (fs.existsSync(competitorFile)) {
  console.log('found the population');
  let content = fs.readFileSync(competitorFile, 'UTF-8');
  var myPopulation = [];
  myPopulationJSON = JSON.parse(content);
  //console.log(myPopulationJSON[0].input);
  myPopulationJSON.forEach(json => {
    //console.log(json.input);
    myPopulation.push(neataptic.Network.fromJSON(json));
  });
  //myNetwork = neataptic.Network.fromJSON(JSON.parse(content));
} else {
  console.log('creating new population');
  //myNetwork = new neataptic.architect.Perceptron(243, 300, 1);
  var myPopulation = [];
  for (i = 0; i < PLAYER_AMOUNT; i++) {
    myPopulation.push(new neataptic.architect.Random(243, 0, 1));
  }
}

ai.setNetwork(myNetwork);

// GA settings

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
    elitism: ELITISM_COUNT
  });
  neat.population = myPopulation;
}

var longestMatch;
var longestHistory;
var legitVictoryCount;
var matchlengthCount;
var matchCount;

function evolving() {
  let competitors;
  //competitors = [];
  //neat.population = [];
  //for (let i = 0; i < 32; i++) {
  //  neat.population[i] = myNetwork;
  //}

  let myNetworkString; /* = JSON.stringify(neat.population[0].toJSON());
  fs.writeFileSync('evolveNetwork_' + Date.now() + '.json', myNetworkString);
  return;*/
  while (true) {
    longestMatch = 0;
    legitVictoryCount = 0;
    matchlengthCount = 0;
    matchCount = 0;

    console.log('Generation:', neat.generation);
    competitors = neat.population;
    competitors.forEach(competitor => (competitor.score = 0));
    //console.log('competition...');
    competition(competitors, playMatch);
    //console.log('evolution...');
    neat.evolve();
    var avglength = Math.round(matchlengthCount / matchCount * 10) / 10;
    //console.log(longestHistory);
    console.log(
      '\nlongest match: ' +
        longestMatch +
        '\nlegit victories: ' +
        legitVictoryCount +
        '\navarage match length: ' +
        avglength +
        '\n----------------'
    );
    myNetworkString = JSON.stringify(neat.population[0].toJSON());
    //fs.writeFileSync('networks/evolveNetwork_' + Date.now() + '.json', myNetworkString);
    fs.writeFileSync(competitorFile, myNetworkString);
    var competitorsJSON = [];
    competitors.forEach(comp => competitorsJSON.push(comp.toJSON()));
    fs.writeFileSync(competitorFile, JSON.stringify(competitorsJSON));
  }
  /*  
  let newPopulation = [];
  for (var i = 0; i < neat.elitism; i++) {
    newPopulation.push(competitors[i]);
  }

  // Breed the next individuals
  for (var i = 0; i < neat.popsize - neat.elitism; i++) {
    newPopulation.push(neat.getOffspring());
  }
  newPopulation.push(competitors[0], competitors[1], competitors[2]);
  //neat.
  */
}

/** matchCallback (player0, player1): return 0 if player0 won, 1 if player1 won
 * returns the array with first one the winner
 */
function competition(players, matchCallback) {
  var compRound = players;
  //var orderedPlayers = [];
  //console.log(compRound.length);
  while (compRound.length > 1) {
    nextCompRound = [];
    for (let i = 0; i < compRound.length; i += 2) {
      //console.log('matching', i);
      let won = matchCallback(compRound[i], compRound[i + 1]);
      //console.log('won', won);
      //orderedPlayers.push(players[i + (1 - won)]);
      nextCompRound.push(players[i + won]);
    }
    compRound = nextCompRound;
  }
  /* put in the absolute winner*/
  //orderedPlayers.push(nextCompRound[0]);

  return; //orderedPlayers.reverse();
}

var history;

function playMatch(ai1, ai2) {
  history = [];
  matchCount++;

  match.startNew(size);
  let aiArr = [ai1, ai2];
  let color = ['x', 'o'];
  i = 0;
  let victor = false;
  let matchLenght = 0;
  while (!victor) {
    ai.setNetwork(aiArr[i]);
    let { x, y } = ai.move(match.createTable(i == 0), size);
    //console.log({ x, y });
    history.push({ x, y });
    let success = match.move(x, y, color[i]);
    if (!success) {
      victor = color[(i + 1) % 2];
    }
    var isV = match.isVictory();

    if (isV) {
      fs.writeFileSync(
        'victories/victory_' + Date.now() + '.json',
        JSON.stringify(history) + '\n' + match.drawTable(match.createTable())
      );
      legitVictoryCount++;
      victor = isV;
    }
    matchLenght++;
    i = (i + 1) % 2;
  }
  victor = victor === 'x' ? 0 : 1;
  aiArr[victor].score += 10 + matchLenght;
  aiArr[(victor + 1) % 2].score += matchLenght;
  if (isV) aiArr[victor].score += 1000;
  matchlengthCount += matchLenght;
  if (matchLenght > longestMatch) {
    longestMatch = matchLenght;
    longestHistory = history;
  }
  //console.log(history);
  return victor;
}

//competition([myNetwork, myNetwork], playMatch);
//playMatch(myNetwork);
initNeat();
evolving();
