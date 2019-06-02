const MiniMax = require('./MiniMax');
const N = 8;
var tileRep = ['_', 'X', 'O'];

const io = require('socket.io-client');

const randInt = (min, max) => {
  return Math.floor(Math.random() * max) + min;
}
const ix = (row, col) => {
  console.log(row);
  console.log(col);
  console.log('abcdefgh'.indexOf(col));
  return (row - 1) * N + 'abcdefgh'.indexOf(col);
}

const humanBoard = (board) => {
  let result = '    A  B  C  D  E  F  G  H';

  for(let i = 0; i < board.length; i += 1){
    if(i % N === 0){
      result += '\n\n ' + (parseInt(Math.floor(i / N)) + 1) + ' ';
    }
    result += ' ' + board[i] + ' ';
  }
  return result;
}

const validateHumanPosition = (position) => {
  let validated = position.length === 2;

  if(validated){
    let row = parseInt(position[0]),
        col = position[1].toLowerCase();

    return (1 <= row && row <= N) && ('abcdefgh'.indexOf(col) >= 0);
  }

  return false;
}

const socket = io.connect('http://localhost:4000');
const username = 'javier' + randInt(0, 9999); 
const tournament_id = 12;

socket.on('connect', () => {
  console.log('connect');
  socket.emit('signin', {
    user_name: username,
    tournament_id: tournament_id,
    user_role: 'player'
  })
});

socket.on('ready', (data) => {
  // About to move
  const gameID = data.game_id;
  const playerTurnID = data.player_turn_id;
  const board = data.board;

  // Choose space
  let possibles = [];
  for (let i = 0; i < data.board.length; i += 1) {
    if (data.board[i] === 0) {
      possibles.push(i);
    }
  }

  const position = MiniMax.BestMove(board, playerTurnID);

  const movement = position.x + MiniMax.SIZE*position.y;
  /* console.log(humanBoard(board));
  console.log('player:', playerTurnID);
  console.log(position);
  console.log(movement); */

  socket.emit('play', {
    tournament_id: tournament_id,
    player_turn_id: playerTurnID,
    game_id: gameID,
    movement: movement,
  },);
});

socket.on('finish', data => {

  // The game has finished
  console.log("Game " + data.game_id + " has finished");

  // Inform my students that there is no rematch attribute
  console.log("Ready to play again!");

  // Start again!

  socket.emit('player_ready', {
    tournament_id: tournament_id,
    game_id: data.game_id,
    player_turn_id: data.player_turn_id
  });

});