'use strict';

const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/war');
const { playedHand, warHand } = require('./handler');

socket.on('playCardP1', playedHand);

socket.on('warCardP2', warHand);

socket.on('p2Wins', (payload) => {

  console.log(`YOU WON THIS ROUND!!!! P2 Card: ${payload.p2PlayedCard} vs P1 Card ${payload.p1PlayedCard}`);
  socket.emit('drawDeck', payload);

});
socket.on('p2Lost', (payload) => {
  console.log(`YOU LOST THIS ROUND!!!! P2 Card: ${payload.p2PlayedCard} vs P1 Card ${payload.p1PlayedCard}`);
  socket.emit('drawDeck', payload);
});

socket.on('p2WinsGame', (payload) => {
  console.log(`Player 2 Won The Game! P1 had ${payload.hand.p1Hand.length} cards remaining.`);
});

socket.on('p1WinsGame', (payload) => {
  console.log(`Player 1 Won the Game! P2 had ${payload.hand.p2Hand.length} cards remaining.`);
});