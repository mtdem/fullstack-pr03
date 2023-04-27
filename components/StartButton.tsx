import * as React from 'react';
import styled from 'styled-components';

export const StartButtonStyle = styled.button`
  box-sizing: borderbox;
  margin: 0 0 20px 0;
  padding: 20px;
  min-height: 30px;
  width: 100%;
  border-radius: 20px;
  border: none;
  color: #222;
  background: #333
  font-size: 2rem;
  outline: none;
  cursor: pointer;
`;

export default function StartButton({ callback }) {
  return <StartButtonStyle onClick={callback}>Start Game</StartButtonStyle>;
}
