const deck = require('./deck');
const _ = require('lodash');

function Game (gameCode, master) {
    this.gameCode = gameCode || 'garbage';
    this.players = [];
    this.masterSocket = master;

    console.log('Game Created: ', this.gameCode)

    this.addPlayer = function (name, playerSocket) {
        this.players.push({
            name: name,
            // dealer info here
            // folded info here
            socket: playerSocket
        });
        console.log('Game: %s - Player Joined: ', this.gameCode, name);
        if (this.masterSocket.readyState == 1) {
            this.masterSocket.send(JSON.stringify({
                type: 'ADD_PLAYER',
                userName: name
            }));
        } else {
            console.log('Master Disconnected: ', this.gameCode);
        }
    }

    this.deal = function () {
        console.log('Dealing...')
        let cards = deck.shuffleDeck(deck.generateNewDeck());
        if (!this.players.length) {
            console.log('No players in game!');
            return
        }
        _.forEach(_.filter(this.players, function (p) { return !p.isGone; }), function (player) {
            if (player.socket.readyState == 1) {
                console.log('Dealing Player: ', player.name);
                let card1 = cards.pop();
                let card2 = cards.pop();
                player.socket.send(JSON.stringify([card1, card2]));
            } else {
                console.log('Player Disconnected: ', player.name);
                player.isGone = true;
            }
        })
        // deal to master as well
        //same master check
    }

    this.isValid = function () {
        return this.players.length && this.masterSocket && this.masterSocket.readyState == 1;
    }
}

function createGame (gameCode, masterSocket) {
    return new Game(gameCode, masterSocket);
}


module.exports = {
    createGame: createGame
}