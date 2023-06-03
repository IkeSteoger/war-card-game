'use strict';

class Queue {

  constructor(){
    this.data = {};
  }

  store(key, value){
    this.data[key] = value;
    console.log('added to queue', this.data);
    return key;
  }

  read(key){
    return this.data[key];
  }

  remove(key){
    let value = this.data[key];
    delete this.data[key];
    console.log('Something deleted from queue');
    return value;
  }
}

module.exports = Queue;
