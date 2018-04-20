const WebSocket = require('ws');
const gameManager = require('./lib/gameManager');

const wss = new WebSocket.Server({ port: 5000 });

const onlyGame = gameManager.createGame();

wss.on('connection', function connection(ws) {
    onlyGame.addPlayer('blah', ws);
    // not listening for client messages
});

setInterval(function () {
    onlyGame.deal();
}, 5000)