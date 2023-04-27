import * as React from 'react';
import styled from 'styled-components';

const DisplayStyle = styled.div`
  box-sizing: border-box;
  display: flex;
  align-items: center;
  margin: 0 0 20px 0;
  padding: 20px;
  border: 4px solid #999;
  min-height: 30px;
  width: 100%;
  border-radius: 20px;
  color: ${(props) => (props.gameOver ? 'red' : '#999')};
  background: #222;
  font-size: 1rem;
`;

export default function Display({ gameOver, text }) {
  return <DisplayStyle gameOver={gameOver}>{text}</DisplayStyle>;
}
