export const STAGE_WIDTH = 12;
export const STAGE_HEIGHT = 20;

// create new arrays of arrays
export const createStage = () =>
  Array.from(Array(STAGE_HEIGHT), () =>
    new Array(STAGE_WIDTH).fill([0, 'clear'])
  );

// collision detection
export const isIllegalMove = (player, stage, { x: moveX, y: moveY }) => {
  for (let y = 0; y < player.tetromino.length; y++) {
    for (let x = 0; x < player.tetromino[y].length; x++) {
      // check cell
      if (player.tetromino[y][x] !== 0) {
        if (
          !stage[y + player.pos.y + moveY] || // check bottom hit
          !stage[y + player.pos.y + moveY][x + player.pos.x + moveX] || // check horizontal boundaries
          // check target cell
          stage[y + player.pos.y + moveY][x + player.pos.x + moveX][1] !==
            'clear'
        ) {
          return true;
        }
      }
    }
  }
};
