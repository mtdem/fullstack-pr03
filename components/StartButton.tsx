import * as React from 'react';
import Cell from './Cell';

import { StyledStartButton } from './styles/StyledStartButton';

export default function StartButton({ callback }) {
  return <StyledStartButton onClick={callback}>Start Game</StyledStartButton>;
}
