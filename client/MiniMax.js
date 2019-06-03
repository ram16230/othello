const SIZE = 8;
exports.SIZE = 8;
// 8 directions
const dirx = [-1, 0, 1, -1, 1, -1, 0, 1];
const diry = [-1, -1, -1, 0, 0, 1, 1, 1];

const N = 8;
var tileRep = ['_', 'X', 'O'];

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

const EvalBoard = (board, player) => {
  let tot = 0;
  
  for (let i = 0; i < board.length; i++) {
    if (board[i] === player) {
      const position = getXY(i);
      if ((position.x === 0 || position.x === SIZE - 1) && (position.y === 0 || position.y === SIZE - 1)){
        tot += 4;
      }
      else if (position.x === 0 || position.x === SIZE - 1 || position.y === 0 || position.y === SIZE - 1){
        tot += 2;
      } else {
        tot += 1;
      }
    }
  }
  return tot;
}

const swapPlayer = (player) => {
  if (player === 1) {
    return 2;
  } else if (player === 2) {
    return 1;
  }
}

const getXY = (position) => {
  return {
    x: position % SIZE,
    y: Math.floor(position / SIZE),
  }
}

const makeMove  = (board, x, y, player) => {
  let totctr = 0; // total number of opponent pieces taken
  board[x + SIZE*y] = player;
  
  for (let d = 0; d < 8; d++) {
    let ctr = 0;
    for (let i = 0; i < SIZE; i++) {
      let dx = x + dirx[d] * (i + 1);
      let dy = y + diry[d] * (i + 1);
      if (dx < 0 || dx > SIZE - 1 || dy < 0 || dy > SIZE - 1) {
        ctr = 0;
        break;
      }
      else if (board[dx + SIZE*dy] === player) {
        break;
      }
      else if (board[dx + SIZE*dy] === 0) {
        ctr = 0;
        break;
      }
      else {
        ctr += 1;
      }
    }
    
    for (let i = 0; i < ctr; i++) {
      let dx = x + dirx[d] * (i + 1);
      let dy = y + diry[d] * (i + 1);
      board[dx + SIZE*dy] = player
    }
    totctr += ctr;
  }
  return [board, totctr];
}

const validMove = (board, x, y, player) => {
  if (x < 0 || x > SIZE - 1 || y < 0 || y > SIZE - 1) {
    return false;
  }
  if (board[x + SIZE*y] !== 0) {
    return false;
  }
  const [boardTemp, totctr] = makeMove(board.slice(), x, y, player);
  if (totctr === 0) {
    return false;
  }
  return true;
}

const isTerminalNode = (board, player) => {
  for (let i = 0; i < board.length; i++) {
    const position = getXY(i);
    if (validMove(board, position.x, position.y, player)) {
      return false;
    }
  }
  return true;
}


const MiniMaxAlphaBeta = (
  board,
  player,
  depth,
  alpha,
  beta,
  maximizingPlayer,
) => {
  if (depth === 0 || isTerminalNode(board.slice(), player)) { // cannot do more
    return EvalBoard(board, player);
  }

  if (maximizingPlayer) {
    let v = -999999;
    for (let i = 0; i < board.length; i++) {
      const position = getXY(i);
      if (validMove(board.slice(), position.x, position.y, player)) {
        const [boardTemp, totctr] = makeMove(board.slice(), position.x, position.y, player);
        v = Math.max(v, MiniMaxAlphaBeta(
          boardTemp,
          player,
          depth-1,
          alpha,
          beta,
          false,
        ));
        console.log(v, MiniMaxAlphaBeta(
          boardTemp,
          player,
          depth-1,
          alpha,
          beta,
          false,
        ))
        alpha = Math.max(alpha, v);
        if (beta <= alpha) {
          break;
        }
      }
    }
    return v;
  } else {
    v = 999999;
    for (let i = 0; i < board.length; i++) {
      const position = getXY(i);
      if (validMove(board, position.x, position.y, player)) { 
        const [boardTemp, totctr] = makeMove(board.slice(), position.x, position.y, player);
        v = Math.min(v, MiniMaxAlphaBeta(
          boardTemp,
          player,
          depth-1,
          alpha,
          beta,
          true,
        ));
        alpha = Math.min(alpha, v);
        if (beta <= alpha) {
          break;
        }
      }
    }
    return v;
  }
}


exports.BestMove = (board, player) => {
  let maxPoints = 0;
  let mx = -1;
  let my = -1;
  for (let i = 0; i < board.length; i++) {
    const position = getXY(i);
    if (validMove(board, position.x, position.y, player)) {
      const [boardTemp, totctr] = makeMove(board.slice(), position.x, position.y, player);
      const points = MiniMaxAlphaBeta(
        boardTemp,
        player,
        4,
        -1,
        9999,
        true,
      );
      if (points > maxPoints) {
        console.log('TUEEEEEEEEEEEEEEE');
        maxPoints = points;
        mx = position.x;
        my = position.y;
      }
    }
  }

  return {
    x: mx,
    y: my,
  };
}
