'use strict';

require('dotenv').config();
const { Server } = require('socket.io');
// TODO: get queues working! (stretch goal)
// const Queue = require('./lib/queue');
// const queue = new Queue();
// const timestamp = Date.now();
const PORT = process.env.PORT || 3002;

const { drawHand } = require('../clients/player1/handler');

const server = new Server();


console.log(`Listening on port number ${PORT}`);
server.listen(PORT);

function logger(event, payload){
  const timestamp = new Date();
  console.log('EVENT: ', { event, timestamp, payload });
}


let warGame = server.of('/war');
warGame.on('connection', (socket) =>{
  console.log(`Connected to war room ${socket.id} `);

  socket.on('join', (room) => {
    socket.join(room);
    console.log(`Welcome to the ${room} room ${socket.id}`);
  });

  socket.onAny((event, payload) => {
    logger(event, payload);
  });



  socket.on('drawDeck', (payload) => {
    console.log(`Player Decks: 
    Player1: ${payload.hand.p1Hand}
    Player2: ${payload.hand.p2Hand}`);
    
    socket.broadcast.emit('drawDeck', payload);
  });

  socket.on('playCardP1', (payload) => {
    socket.broadcast.emit('playCardP1', payload);
  });

  socket.on('playCardP2', (payload) => {
    if(payload.p1PlayedCard === payload.p2PlayedCard && payload.hand.p1Hand.length !== 0 && payload.hand.p2Hand.length !== 0){ 
      let p1WarCards = drawHand();
      let p2WarCards = drawHand();
      let newPayload = {
        ...payload,
        p1WarCards,
        p2WarCards, 
      };
      socket.broadcast.emit('p1WarCard', newPayload);
    } else if (payload.p1PlayedCard > payload.p2PlayedCard && payload.hand.p1Hand.length !== 0 && payload.hand.p2Hand.length !== 0) {
      console.log('player1 wins!', payload);
      payload.hand.p2Hand.push(payload.p1PlayedCard);
      payload.hand.p2Hand.push(payload.p2PlayedCard);
      socket.broadcast.emit('p1Wins', payload);
      socket.broadcast.emit('p2Lost', payload);
    } else if (payload.p2PlayedCard > payload.p1PlayedCard && payload.hand.p1Hand.length !== 0 && payload.hand.p2Hand.length !== 0) {
      console.log('player2 wins!', payload);
      payload.hand.p1Hand.push(payload.p1PlayedCard);
      payload.hand.p1Hand.push(payload.p2PlayedCard);
      socket.broadcast.emit('p2Wins', payload);     
      socket.broadcast.emit('p1Lost', payload);
    } else {
      if (payload.hand.p2Hand.length === 0){
        console.log('P2 WINS!!!');
        socket.broadcast.emit('p2WinsGame', payload);
      }

      if (payload.hand.p1Hand.length === 0){
        console.log('P1 WINS!!!');
        socket.broadcast.emit('p1WinsGame', payload);
      }
    }
  });

  socket.on('warCardP2', (payload) => {
    socket.broadcast.emit('warCardP2', payload);
  });

  socket.on('warEnd', (payload) => {
    if (payload.p1PlayedCard > payload.p2PlayedCard) {
      console.log('player1 wins this war!');
      payload.hand.p2Hand.push(payload.p1PlayedCard);
      payload.hand.p2Hand.push(payload.p2PlayedCard);
      payload.hand.p2Hand = [...payload.hand.p2Hand, ...payload.p1WarCards, ...payload.p2WarCards];

      socket.broadcast.emit('p1Wins', payload);
      socket.broadcast.emit('p2Lost', payload);
    } else if (payload.p2PlayedCard > payload.p1PlayedCard) {
      console.log('player2 wins this war!');
      payload.hand.p1Hand.push(payload.p1PlayedCard);
      payload.hand.p1Hand.push(payload.p2PlayedCard);
      payload.hand.p1Hand = [...payload.hand.p1Hand, ...payload.p1WarCards, ...payload.p2WarCards];

      socket.broadcast.emit('p2Wins', payload);     
      socket.broadcast.emit('p1Lost', payload);
    } else if (payload.p1PlayedCard === payload.p2PlayedCard) {
      let p1WarCards = drawHand();
      let p2WarCards = drawHand();
      let newPayload = {
        ...payload,
        p1WarCards,
        p2WarCards, 
      };
      socket.broadcast.emit('p1WarCard', newPayload);
    } else {
      console.log('Stuck in warEnd else');
      socket.broadcast.emit('playCardP1');
    }
  });

  // TODO: get queues working! (stretch goal)
  // socket.on('delivered', (payload) => {
  //   console.log('Delivered: ', timestamp, payload);
  //   socket.broadcast.emit('delivered', payload);
  // });

  // TODO: get queues working! (stretch goal)
  //   socket.on('getAll', (payload) =>{
  //     console.log('Attempting to get all');
  //     let currentQueue = queue.read(payload.queueId);
  //     if (currentQueue && currentQueue.data){
  //       Object.keys(currentQueue.data).forEach(messageId => {
  //         let savedPayload = currentQueue.read(messageId);
  //         socket.emit(savedPayload.event, savedPayload);
  //       });
  //     }
  //   });

  // TODO: get queues working! (stretch goal)
  //   socket.on('recieved', (payload) =>{
  //     let currentQueue = queue.read(payload.queueId);
  //     if (!currentQueue){
  //       throw new Error('Payload exists but no queue');
  //     }

  //     currentQueue.remove(payload.messageId);
  //   });

});
