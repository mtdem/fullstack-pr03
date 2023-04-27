import * as React from 'react';
// components
import Stage from './Stage';
import Display from './Display';
import PlayButton from './PlayButton';
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
  const [dropTime, setDroptime] = React.useState<null | number>(null);
  const [endGame, setEndGame] = React.useState(false);
  // custom states
  const [player, updatePlayerPos, resetPlayer, playerRotate] = usePlayer();
  const [stage, setStage, clearedRows] = useStage(player, resetPlayer);
  const [score, setScore, numRows, setNumRows, levels, setLevels] =
    useGameScoring(clearedRows);

  const stageSize = React.useRef<HTMLDivElement>(null);

  // Controls String:
  const CONTROLS_STR =
    'Controls: \n - S: go down \n - D: shift right \n - A: shift left \n - E: rotate clockwise \n - Q: rotate counterclockwise';

  const adjustedDroptime = (level: number) => {
    return 800 / level + 100;
  };

  const movePlayer = (dir: number) => {
    if (!isIllegalMove(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  const startGame = () => {
    setStage(createStage());
    resetPlayer();
    setDroptime(800);
    setEndGame(false);
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
        setEndGame(true);
        setDroptime(null);
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  const dropPlayer = () => {
    drop();
    setDroptime(null);
  };

  const continueDrop = ({ keyCode }: { keyCode: number }): void => {
    if (!endGame) {
      if (keyCode === 83) {
        // down
        setDroptime(adjustedDroptime(levels));
      }
    }
  };

  const move = ({
    keyCode,
    repeat,
  }: {
    keyCode: number;
    repeat: boolean;
  }): void => {
    if (!endGame) {
      if (keyCode === 65) {
        // left
        movePlayer(-1);
      } else if (keyCode === 68) {
        // right
        movePlayer(1);
      } else if (keyCode === 83) {
        // down
        if (repeat) return;
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
      ref={stageSize}
    >
      <TetrisStyle>
        <aside>
          {endGame ? (
            <Display gameOver={endGame} text="GAME OVER" />
          ) : (
            <div>
              <Display gameOver={endGame} text={`Level: ${levels}`} />
              <Display gameOver={endGame} text={`Rows: ${numRows}`} />
              <Display gameOver={endGame} text={`Score : ${score}`} />
            </div>
          )}
          <PlayButton callback={startGame} />
        </aside>
        <Stage stage={stage} />
      </TetrisStyle>
      <div className="display-linebreak">
        <Display gameOver={endGame} text={CONTROLS_STR} />
      </div>
    </TetrisController>
  );
}
