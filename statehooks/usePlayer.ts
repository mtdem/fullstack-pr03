import { useState, useCallback } from 'react';
import { StageModel } from '../components/Stage';
import { isIllegalMove, STAGE_HEIGHT, STAGE_WIDTH } from '../gameHelpers';
import { TETROMINOS, randomTetromino } from '../tetrominos';

export type PlayerModel = {
  pos: { x: number; y: number };
  tetromino: (string | number)[][];
  collided: boolean;
};

export const usePlayer = () => {
  const [player, setPlayer] = useState({} as PlayerModel);

  const rotate = (matrix: PlayerModel['tetromino'], dir: number) => {
    // transpose
    const rotatedMatrix = matrix.map((_, index) =>
      matrix.map((col) => col[index])
    );
    // reverse each row to rotate matrix
    if (dir > 0) return rotatedMatrix.map((row) => row.reverse());
    return rotatedMatrix.reverse();
  };

  const playerRotate = (stage: StageModel, dir: number) => {
    const clonedPlayer = JSON.parse(JSON.stringify(player));
    clonedPlayer.tetromino = rotate(clonedPlayer.tetromino, dir);

    const posX = clonedPlayer.pos.x;
    let offset = 1;

    while (isIllegalMove(clonedPlayer, stage, { x: 0, y: 0 })) {
      clonedPlayer.pos.x += offset;

      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > clonedPlayer.tetromino[0].length) {
        rotate(clonedPlayer.tetromino, -dir);
        clonedPlayer.pos.x = posX;
        return;
      }
    }

    setPlayer(clonedPlayer);
  };

  const updatePlayerPos = ({
    x,
    y,
    collided,
  }: {
    x: number;
    y: number;
    collided: boolean;
  }) => {
    setPlayer((prev) => ({
      ...prev,
      pos: { x: (prev.pos.x += x), y: (prev.pos.y += y) },
      collided,
    }));
  };

  const resetPlayer = useCallback((): void => {
    setPlayer({
      pos: { x: STAGE_WIDTH / 2 - 2, y: 0 },
      tetromino: randomTetromino().shape,
      collided: false,
    });
  }, []);

  return [player, updatePlayerPos, resetPlayer, playerRotate] as const;
};
