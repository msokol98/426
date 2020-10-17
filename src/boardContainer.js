import React from 'react';
import useEventListener from '@use-it/event-listener';
import { getColor, getFontSize } from './utils';

const BoardContainer = ({ game }) => {

    function handler({ key }) {
        switch(key) {
            case 'ArrowUp': 
                game.move('up');
                break;
            case 'ArrowDown':
                game.move('down');
                break;
            case 'ArrowRight':
                game.move('right');
                break;
            case 'ArrowLeft':
                game.move('left');
                break;
            default: 
        }
    }

    useEventListener('keydown', handler);

    return(
        game && <div className="game-board">

          {game.gameState.board.map((number, i) => (
             <div key={i} style={{backgroundColor: getColor(number), fontSize: getFontSize(number)}}>
                 {number !== 0 && number}</div>
          ))}

        </div>
    )
}

export default BoardContainer;