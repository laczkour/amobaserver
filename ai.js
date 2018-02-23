var gamearea;
var myNetwork = new synaptic.Architect.Perceptron(2, 3, 1);

function aistart() {
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

var sample = 'XX?XX';
/* sample: 
'X': saját szín
'O': ellenfél szín 
'?': a vizsgálandó hely
' ': üres, használható hely
'_': bármilyen szín, pályán kívül
'-': bármi, üres hely, fal, foglalt hely
'|': sortörés
*/

function createCase(sample, outputValue) {}
