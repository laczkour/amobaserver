const fs = require('fs');
let content = fs.readFileSync('evolveNetwork.json', 'UTF-8');
fs.writeFileSync('myNetwork.js', "var myNetwork = neataptic.Network.fromJSON(JSON.parse('" + content + "'));");
