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
      p2Hand: drawHand(),
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
  let newPayload = {...payload, p1PlayedCard: ''};
  const question = {
    type: 'list',
    name: 'hand',
    message: 'Pick a Card:',
    choices: payload.hand.p1Hand,
  };

  inquirer.prompt(question)
    .then(answers => {
      console.log('You played: ', answers.hand);
      let position = payload.hand.p1Hand.indexOf(answers.hand);
      let newArr = newPayload.hand.p1Hand.splice(position, position);
      console.log('POSITION: ', position, 'SPLICE: ', newArr);
      newPayload.p1PlayedCard = answers.hand;
      console.log('Your Hand after playing: ', newPayload.hand.p1Hand);
      socket.emit('playCardP1', newPayload);
    })
    .catch(error => {
      console.error('Error occurred:', error);
    });
};

const warHand = (payload) =>{
  const question = {
    type: 'list',
    name: 'hand',
    message: 'Pick a card for WAR!',
    choices: payload.hand.p1Hand,
  };
  
  inquirer.prompt(question)
    .then(answers => {
      console.log('You played: ', answers.hand);
      let position = payload.hand.p1Hand.indexOf(answers.hand);
      payload.hand.p1Hand.splice(position, position);
      payload.p1PlayedCard = answers.hand;
      console.log('Your Hand after playing: ', payload.hand.p1Hand);
      socket.emit('warCardP2', payload);
    })
    .catch(error => {
      console.error('Error occurred:', error);
    });
};

module.exports = {
  drawHand,
  drawHandler,
  playedHand,
  warHand,
};