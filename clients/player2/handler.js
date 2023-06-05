'use strict';

const { io } = require('socket.io-client');
const socket = io('http://localhost:3001/war');
const inquirer = require('inquirer');

const playedHand = (payload) =>{
  let newPayload = {...payload, p2PlayedCard: ''};
  
  const question = {
    type: 'list',
    name: 'hand',
    message: 'Pick a Card:',
    choices: payload.hand.p2Hand,
  };
  inquirer.prompt(question)
    .then(answers => {
      console.log('You played: ', answers.hand);
      let position = payload.hand.p2Hand.indexOf(answers.hand);
      newPayload.hand.p2Hand.splice(position, position);
      newPayload.p2PlayedCard = answers.hand;
      console.log('POSITION: ', position, 'SPLICE: ', newPayload.hand.p2Hand);
      console.log('Your Hand after playing: ', newPayload.hand.p2Hand);
      socket.emit('playCardP2', newPayload);
    })
    .catch(error => {
      console.error('Error occurred:', error);
    });
};

const warHand = (payload) =>{
//   console.log('WAR HAND PAYLOAD: ', payload);
  const question = {
    type: 'list',
    name: 'hand',
    message: 'Pick a card for WAR!',
    choices: payload.hand.p2Hand,
  };
  inquirer.prompt(question)
    .then(answers => {
      console.log('You played: ', answers.hand);
      let position = payload.hand.p2Hand.indexOf(answers.hand);
      payload.hand.p2Hand.splice(position, position);
      payload.p2PlayedCard = answers.hand;
      console.log('Your Hand after playing: ', payload.hand.p2Hand);
      socket.emit('warEnd', payload);
    })
    .catch(error => {
      console.error('Error occurred:', error);
    });
};

module.exports = { playedHand, warHand };