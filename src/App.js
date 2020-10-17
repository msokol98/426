import React, { Component } from 'react';
import './App.css';

import Game from './game';
import Board from './boardContainer';

const game = new Game(4);

class App extends Component {

  constructor() {
    super();
    this.state = { game };
  }

  componentDidMount() {
    this.setCallback();
  }

  setCallback() {
    game.onMove(updatedGame => this.setState({game: updatedGame}));
    this.setState({ game });
  }

  resetGame() {
    this.state.game.setupNewGame();
    this.setState({game});
  }

  render() {

    let { game } = this.state;
    const { won, over } = game && game.gameState;

    if(game) 
      game.board = game.convertTo2D(game.gameState.board)

    return (
      <div className="App">

        <h3 className="header">2048 for COMP 426</h3>

        <div class="flex-row">
          <h2>Score: {game.gameState.score}</h2>
          <button onClick={() => this.resetGame()}>Reset Game</button>
        </div>

        {won && <h2 className="won">You won the game!!!</h2>}
        {!won && over && <h2 className="over">The game is over...</h2>}

        {game && game.gameState && 
          <Board game={game} />}

      </div>
    );
  }
}

export default App;

