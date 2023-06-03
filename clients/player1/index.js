'use strict';

const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/war');
const { drawHandler, playedHand } = require('./handler');

drawHandler();

socket.on('drawDeck', playedHand);