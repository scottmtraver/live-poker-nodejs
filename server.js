const _ = require('lodash');
const WebSocket = require('ws');
const gameManager = require('./lib/gameManager');

const wss = new WebSocket.Server({ port: 5000 });

let games = []

// Message Format: { userName: String, gameCode: String, type: String }
wss.on('connection', function connection(ws) {
    ws.on('message', function incoming(event) {
        let data = JSON.parse(event)
        if (data.type == 'JOIN') {
            console.log('Joining Player...');
            if (games[data.gameCode]) {
                games[data.gameCode].addPlayer(data.userName, ws);
                ws.send(JSON.stringify({
                    type: 'USER_JOIN',
                    userName: data.userName
                }));
            } else {
                ws.send('ERROR: INVALID GAME CODE');
                ws.close();
            }
        } else if (data.type == 'CREATE') {
            let newGame = gameManager.createGame('random', ws);
            console.log('Creating Game: ', newGame.gameCode);
            games[newGame.gameCode] = newGame;
            ws.send(JSON.stringify({
                type: 'NEW_GAME',
                gameCode: newGame.gameCode
            }));
        } else {
            ws.send('ERROR: INVALID MESSAGE DATA TYPE');
            ws.close();
        }
    });
});

setInterval(function () {
    _.forOwn(games, function (game, code) {
        game.deal();
    });
}, 5000)