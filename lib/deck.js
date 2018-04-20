const _ = require('lodash');

SUITS = ['heart', 'spade', 'club', 'diamond']
VALUES = [
    'A',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    'J',
    'Q',
    'K',
]

function generateNewDeck () {
    console.log('here')
    return _.flatMap(SUITS, function (suit) {
        return _.map(VALUES, function (value) {
            return {
                suit: suit,
                value: value
            }
        });
    });
}

module.exports = {
    generateNewDeck: generateNewDeck
}