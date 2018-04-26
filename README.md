# Pocker Websocket Server

Basic Texas Hold'em Game Manager for Websocket Connected UIs

## Running Locally


```sh
git clone https://github.com/scottmtraver/live-poker-nodejs.git
cd live-poker-nodejs
npm install
npm start
```

Your app should now be running and accessible [localhost:5000](http://localhost:5000/).
The root has an instructions index page

## Event API

Events are send over open websockets. The connection identification is managed in the game manager.

Messages sent to or from the server are in the format:
```
{
	type: String, [prop?]: String
}
```

Valid types to send to the server are: `CREATE JOIN DEAL`

Valid server response types are: `GAME_CREATED USER_JOINED NEW_CARDS PLAYER_ADDED ERROR`

| Recepient     | Event        | Response       | Error Response |
| ---- | ------------- |:-------------| :-----|
| Master | Server received CREATE | { type: 'GAME_CREATED', gameCode: String } | { type: 'ERROR', message: 'ERROR: Unable To Create Game' } |
| Player | Server received JOIN and username and gamecode | { type: 'USER_JOINED', userName: String } | { type: 'ERROR', message: 'ERROR: Invalid Game Code' or 'ERROR: Missing Paramaters' } |
| Player/Master | Server received DEAL and gamecode | { type: 'NEW_CARDS', cards: Array } | { type: 'ERROR', message: 'ERROR: Uable To Deal' } |
| Master | Server attached player to game | { type: 'ADD_PLAYER', userName: String } | { type: 'ERROR', message: 'ERROR: Uable Add Player To Game' } |
| Master | Player websocket error | { type: 'PLAYER_INTERRUPT', userName: String } | |

When a player disconnects, master is notified. If they rejoin with the same userName and gameCode the first message after reconnection will be the cards they were delt if there is a currently ongoing hand.

## Deploying to Docker

To build the docker image based on alpine-node:10

```
docker build -t pokernode .
```

To run the server be sure to expose port 5000

```
docker run -d --name pokerserver -p 5000:5000 pokernode
```

## Resources

https://nodejs.org/en/

https://mochajs.org/

http://sinonjs.org/

https://github.com/websockets/ws#installing 