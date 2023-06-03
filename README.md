# LAB - 14

## Project: Card Game: War via Event Driven Application

### Authors: Donna Ada & Ike Steoger

### Problem Domain

Create an event driven application that can communicate between two players, holding communcations in a queue if one of the players is offline. First, the server will have them both join their respective rooms, then it will assign both players a set of cards. After which, the players are presented with the cards & have to pick them. Once both cards have been picked, the server decides who won (or if there is a tie) and will continue to a new round until one player has no cards.

### Links and Resources

- [GitHub Actions ci/cd](https://github.com/IkeSteoger/war-card-game/actions)
<!-- - [back-end dev server url]() -->
<!-- - [back-end prod server url]() -->

### Collaborators

  1. Ike Steoger
  1. Donna Ada

### Setup

#### How to initialize/run your application

Clone repo, `npm i`, alter `.env.sample` into `.env` and make any needed changes, `npm start`.

#### Tests

To run tests, after running `npm i`, run the command `npm test`

#### UML

![UML](./assets/uml.png)
