import React from 'react';
import './Game.css'

function Square(props) {
    return(
        <button 
            className = {props.className} 
            onClick = {props.onClick}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
      return (
      <Square
        key = {i}
        className = {this.props.position.indexOf(i) !== -1 ? "winner" : "square"}
        value = {this.props.squares[i]} 
        onClick = {() => this.props.onClick(i)}
        />
      );
    }

    render() {
      let board = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          board.push(this.renderSquare(3 * i + j));
        }
        board.push(<br/>);
      }
      return (
        <div>
          <div className="board-row">
            {board}
          </div>
        </div>
      );
    }
}
  
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        X: Array(9).fill(null),
        Y: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0,this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const X = current.X.slice();
    const Y = current.Y.slice();
    if (CalculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    X[this.state.stepNumber] = parseInt(i/3) + 1;
    Y[this.state.stepNumber] = i % 3 + 1;
    this.setState({
        history: history.concat([{
          squares: squares,
          X: X,
          Y: Y,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner  = CalculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
      "第" + move + "步(" + step.X[move - 1] + "," + step.Y[move - 1] + ")":
      "游戏开始";
      return (
         <li key = {move}>
          <button 
            className = {this.state.stepNumber === move ? "selected" :""}
            onClick = {() => this.jumpTo(move)}
          >
            {desc}
           </button>
        </li>
      )
    });

    let status;
    let position = [];
    if (winner) {
      status = "胜利者: " + winner.winner;
      position = winner.position;
    } else if (this.state.stepNumber === 9){
      status = "平局";
    } else {
      status = "下一步: " + (this.state.xIsNext ? 'X' : 'O');
    }

    console.log(winner);
    
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares = {current.squares}
            position = {position}
            onClick = {(i) => this.handleClick(i)}
        />
        <div className = "status">{status}</div>
        </div>
        <div className = "game-info">
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

function CalculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];

  const res = {
    winner: null,
    position: [],
  }
  for (let i = 0; i < lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && 
      squares[a] === squares[b] && 
      squares[a] === squares[c]) {
        res.winner = squares[a];
        res.position = lines[i];
      return res;
    }
  }
  return null;
}

export default Game;