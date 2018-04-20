const deck = require('./deck');
const _ = require('lodash');

function Game (gameCode) {
    this.name = gameCode || 'garbage';
    this.players = [];

    this.addPlayer = function (name, websocket) {
        this.players.push({
            name: name,
            // dealer info here
            // folded info here
            socket: websocket
        });
    }

    this.deal = function () {
        let cards = deck.shuffleDeck(deck.generateNewDeck());
        if (!this.players.length) {
            console.log('no players in game!')
            return
        }
        _.forEach(_.filter(this.players, function (p) { return !p.isGone; }), function (player) {
            if (player.socket.readyState == 1) {
                console.log('dealing player:', player.name)
                let card1 = cards.pop();
                let card2 = cards.pop();
                player.socket.send(JSON.stringify([card1, card2]));
            } else {
                console.log('player disconnected: ', player.name)
                player.isGone = true;
            }
        })
        // deal to master as well
    }
}

function createGame (gameCode) {
    return new Game(gameCode)
}


module.exports = {
    createGame: createGame
}