import { useState, useEffect } from 'react';
import { SquareModel, StageModel } from '../components/Stage';
import { createStage } from '../gameHelpers';
import { PlayerModel } from './usePlayer';

export const useStage = (player: PlayerModel, resetPlayer: () => void) => {
  const [stage, setStage] = useState(createStage());
  const [clearedRows, setClearedRows] = useState(0);

  useEffect(() => {
    if (!player.pos) return;

    setClearedRows(0);

    const rowSweep = (nextStage) => {
      nextStage.reduce((acc, row) => {
        if (row.findIndex((cell) => cell[0] === 0) === -1) {
          setClearedRows((prev) => prev + 1);
          acc.unshift(new Array(nextStage[0].length).fill([0, 'clear']));
          return acc;
        }
        acc.push(row);
        return acc;
      }, []);
    };

    const updateStage = (prev: StageModel): StageModel => {
      // get new stage state
      const next = prev.map(
        (row) =>
          row.map((cell) =>
            cell[1] === 'clear' ? [0, 'clear'] : cell
          ) as SquareModel[]
      );
      // display tetromino
      player.tetromino.forEach((row, y) => {
        row.forEach((value, x) => {
          if (value !== 0) {
            next[y + player.pos.y][x + player.pos.x] = [
              value,
              `${player.collided ? 'merged' : 'clear'}`,
            ];
          }
        });
      });
      // check collision
      if (player.collided) {
        resetPlayer();
        return rowSweep(next);
      }

      return next;
    };
    setStage((prev) => updateStage(prev));
  }, [
    player.collided,
    player.pos?.x,
    player.pos?.y,
    player.tetromino,
    resetPlayer,
  ]);

  return [stage, setStage, clearedRows] as const;
};
