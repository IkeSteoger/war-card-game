'use strict';

const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/war');
const { drawHandler, playedHand, warHand } = require('./handler');

drawHandler();

socket.on('drawDeck', playedHand);

socket.on('p1WarCard', warHand);

socket.on('p1Wins', (payload) => {
  console.log(`YOU WON THIS ROUND!!!! P1 Card: ${payload.p1PlayedCard} vs P2 Card ${payload.p2PlayedCard}`);
//   socket.emit('drawDeck', payload);
});
socket.on('p1Lost', (payload) => {
  console.log(`YOU LOST THIS ROUND!!!! P1 Card: ${payload.p1PlayedCard} vs P2 Card ${payload.p2PlayedCard}`);
//   socket.emit('drawDeck', payload);
});

socket.on('p2WinsGame', (payload) => {
  console.log(`Player 2 Won The Game! P1 had ${payload.hand.p1Hand.length} cards remaining.`);
});
  
socket.on('p1WinsGame', (payload) => {
  console.log(`Player 1 Won the Game! P2 had ${payload.hand.p2Hand.length} cards remaining.`);
});