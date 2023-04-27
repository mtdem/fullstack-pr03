import * as React from 'react';
// components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';
// styles
import { StyledTetrisWrapper, StyledTetris } from './styles/StyledTetris';
// hooks
import { useStage } from './hooks/useStage';
import { usePlayer } from './hooks/usePlayer';
// functions
import { createStage, isIllegalMove } from '../gameHelpers';
import { renderToPipeableStream } from 'react-dom/server';

export default function Tetris() {
  const [dropTime, setDroptime] = React.useState(null);
  const [gameOver, setGameOver] = React.useState(false);

  const [player, updatePlayerPos, resetPlayer] = usePlayer();
  const [stage, setStage] = useStage(player, resetPlayer);

  console.log('re-rendered');

  const movePlayer = (dir) => {
    if (!isIllegalMove(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0 });
    }
  };

  const startGame = () => {
    setStage(createStage());
    resetPlayer();
    setGameOver(false);
  };

  const drop = () => {
    if (!isIllegalMove(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      if (player.pos.y < 1) {
        console.log('game over');
        setGameOver(true);
        setDroptime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const dropPlayer = () => {
    drop();
  };

  const move = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 37) {
        movePlayer(-1);
      } else if (keyCode === 39) {
        movePlayer(1);
      } else if (keyCode === 40) {
        dropPlayer();
      }
    }
  };

  return (
    <StyledTetrisWrapper role="button" tabIndex="0" onKeyDown={(e) => move(e)}>
      <StyledTetris>
        <Stage stage={stage} />
        <aside>
          {gameOver ? (
            <Display gameOver={gameOver} text="GAME OVER" />
          ) : (
            <div>
              <Display gameOver={gameOver} text="Score" />
              <Display gameOver={gameOver} text="Rows" />
              <Display gameOver={gameOver} text="Level" />
            </div>
          )}
          <StartButton callback={startGame} />
        </aside>
      </StyledTetris>
    </StyledTetrisWrapper>
  );
}
