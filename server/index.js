'use strict';

require('dotenv').config();
const { Server } = require('socket.io');
const Queue = require('./lib/queue');
const queue = new Queue();
const PORT = process.env.PORT || 3002;
const timestamp = Date.now();

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
    console.log('Drawing Deck:', timestamp, payload);

    // TODO: get queues working! (stretch goal?)
    // let player1Queue = queue.read('player1');
    // if (!player1Queue) {
    //   let queueKey = queue.store('player1', new Queue());
    //   player1Queue = queue.read(queueKey);
    // }
    // let player2Queue = queue.read('player2');
    // if (!player2Queue) {
    //   let queueKey = queue.store('player2', new Queue());
    //   player2Queue = queue.read(queueKey);
    // }
    // player1Queue.store(payload.messageId, payload);
    // player2Queue.store(payload.messageId, payload);
    
    socket.broadcast.emit('drawDeck', payload);
  });

  socket.on('playCard', (payload) => {
    console.log('Play Card', timestamp, payload);
    socket.broadcast.emit('playCard', payload);
  });

  socket.on('delivered', (payload) => {
    console.log('Delivered', timestamp, payload);
    socket.broadcast.emit('delivered', payload);
  });

  // TODO: get queues working! (stretch goal?)
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

  // TODO: get queues working! (stretch goal?)
  //   socket.on('recieved', (payload) =>{
  //     let currentQueue = queue.read(payload.queueId);
  //     if (!currentQueue){
  //       throw new Error('Payload exists but no queue');
  //     }

  //     currentQueue.remove(payload.messageId);
  //   });

});
