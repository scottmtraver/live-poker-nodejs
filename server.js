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
            if (games[data.gameCode.toUpperCase()]) {
                games[data.gameCode.toUpperCase()].addPlayer(data.userName, ws);
                ws.send(JSON.stringify({
                    type: 'USER_JOINED',
                    userName: data.userName
                }));
            } else {
                ws.send('ERROR: INVALID GAME CODE');
                ws.close();
            }
        } else if (data.type == 'CREATE') {
            // null uses random game code
            let newGame = gameManager.createGame(null, ws);
            console.log('Creating Game: ', newGame.gameCode);
            games[newGame.gameCode] = newGame;
            ws.send(JSON.stringify({
                type: 'GAME_CREATED',
                gameCode: newGame.gameCode
            }));
        } else if (data.type == 'DEAL') {
            if (games[data.gameCode.toUpperCase()]) {
                games[data.gameCode.toUpperCase()].deal();
            } else {
                ws.send('ERROR: INVALID GAME CODE');
                ws.close();
            }
        } else {
            ws.send('ERROR: INVALID MESSAGE DATA TYPE');
            ws.close();
        }
    });
});

// setInterval(function () {
//     _.forOwn(games, function (game, code) {
//         if (game.isValid() && game.readyForDeal) {
//             game.deal();
//         }
//     });
// }, 1000);