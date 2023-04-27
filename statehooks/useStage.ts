import { useState, useEffect } from 'react';
import { createStage } from '../gameHelpers';

export const useStage = (player, resetPlayer) => {
  const [stage, setStage] = useState(createStage());
  const [clearedRows, setClearedRows] = useState(0);

  useEffect(() => {
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

    const updateStage = (prev) => {
      // get new stage state
      const next = prev.map((row) =>
        row.map((cell) => (cell[1] === 'clear' ? [0, 'clear'] : cell))
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
  }, [player, resetPlayer]);

  return [stage, setStage, clearedRows] as const;
};
