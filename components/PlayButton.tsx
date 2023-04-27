import * as React from 'react';
import styled from 'styled-components';

export const PlayButtonStyle = styled.button`
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

type Props = {
  callback: () => void;
};

export default function PlayButton({ callback }: Props) {
  return <PlayButtonStyle onClick={callback}>Play</PlayButtonStyle>;
}
