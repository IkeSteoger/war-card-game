'use strict';

const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/war');
const inquirer = require('inquirer');
var Chance = require('chance');

var chance = new Chance();

function drawHand(){
  let hand = [];

  hand.push(Math.floor(Math.random() * (13 - 1 + 1) + 1));
  hand.push(Math.floor(Math.random() * (13 - 1 + 1) + 1));
  hand.push(Math.floor(Math.random() * (13 - 1 + 1) + 1));
  
  return hand;
}

const drawHandler = (hand=null) => {
  if(!hand){
    hand = {
      p1Hand: drawHand(),
      // p2Hand: drawHand(),
    };
  }

  
  let payload = {
    handId: chance.guid(),
    queueId: 'player1',
    hand,
  };
  console.log(`HANDS DRAWN - GET READY!`, payload.hand.p1Hand);
  socket.emit('drawDeck', payload);
};

const playedHand = (payload) =>{
  let newPayload = payload;

  const question = {
    type: 'list',
    name: 'hand',
    message: 'Pick a Card:',
    choices: payload.hand.p1Hand,
  };
  inquirer.prompt(question)
    .then(answers => {
      console.log('You played: ', answers.hand);
      newPayload.hand.p1Hand.pop(answers);
      console.log('Your Hand after playing: ', newPayload.hand.p1Hand);
    })
    .catch(error => {
      console.error('Error occurred:', error);
    });

  socket.emit('playedHand', newPayload);
};

module.exports = {
  drawHand,
  drawHandler,
  playedHand,
};