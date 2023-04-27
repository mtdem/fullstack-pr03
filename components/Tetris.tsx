import * as React from 'react';
// components
import Stage from './Stage';
import Display from './Display';
import StartButton from './StartButton';
// hooks
import { useStage } from '../statehooks/useStage';
import { usePlayer } from '../statehooks/usePlayer';
import { useInterval } from '../statehooks/useInterval';
import { useGameScoring } from '../statehooks/useGameScoring';
// functions
import { createStage, isIllegalMove } from '../gameHelpers';
// styling
import styled from 'styled-components';

export const TetrisController = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: #577;
  background-size: cover;
  overflow: hidden;
`;

export const TetrisStyle = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 40px;
  margin: 0 auto;
  max-width: 900px;

  aside {
    width: 100%
    max-width: 200px;
    display:block;
    padding: 0 20px;
  }
`;

export default function Tetris() {
  const [dropTime, setDroptime] = React.useState(null);
  const [gameOver, setGameOver] = React.useState(false);

  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, clearedRows] = useStage(player, resetPlayer);
  const [score, setScore, numRows, setNumRows, levels, setLevels] =
    useGameScoring(clearedRows);

  const adjustedDroptime = (level) => {
    return 1000 / (level + 1) + 300;
  };

  const movePlayer = (dir) => {
    if (!isIllegalMove(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  const startGame = () => {
    setStage(createStage());
    resetPlayer();
    setDroptime(1000);
    setGameOver(false);
    setScore(0);
    setNumRows(0);
    setLevels(0);
  };

  const drop = () => {
    if (numRows > (levels + 1) * 10) {
      setLevels((prev) => prev + 1);
      setDroptime(adjustedDroptime(levels));
    }

    if (!isIllegalMove(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      if (player.pos.y < 1) {
        setGameOver(true);
        setDroptime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const dropPlayer = () => {
    drop();
    setDroptime(null);
  };

  const continueDrop = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 83) {
        // down
        setDroptime(adjustedDroptime(levels));
      }
    }
  };

  const move = ({ keyCode }) => {
    if (!gameOver) {
      if (keyCode === 65) {
        // left
        movePlayer(-1);
      } else if (keyCode === 68) {
        // right
        movePlayer(1);
      } else if (keyCode === 83) {
        // down
        dropPlayer();
      } else if (keyCode === 69) {
        // up (E) to shift clockwise
        playerRotate(stage, 1);
      } else if (keyCode === 81) {
        // up (Q) to shift counterclockwise
        playerRotate(stage, -1);
      }
    }
  };

  useInterval(() => {
    drop();
  }, dropTime);

  return (
    <TetrisController
      role="button"
      tabIndex="0"
      onKeyDown={(e) => move(e)}
      onKeyUp={continueDrop}
    >
      <TetrisStyle>
        <Stage stage={stage} />
        <aside>
          {gameOver ? (
            <Display gameOver={gameOver} text="GAME OVER" />
          ) : (
            <div>
              <Display gameOver={gameOver} text={`Score : ${score}`} />
              <Display gameOver={gameOver} text={`Rows: ${numRows}`} />
              <Display gameOver={gameOver} text={`Level: ${levels}`} />
            </div>
          )}
          <StartButton callback={startGame} />
        </aside>
      </TetrisStyle>
    </TetrisController>
  );
}
