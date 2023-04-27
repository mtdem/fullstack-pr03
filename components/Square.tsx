import * as React from 'react';
import { TETROMINOS } from '../tetrominos';
import styled from 'styled-components';

const SquareStyle = styled.div`
  width: auto;
  background: rgba(${(props) => props.color}, 0.7);
  border: ${(props) => (props.type === 0 ? '0px solid' : '4px solid')};
  border-bottom-color: rgba(${(props) => props.color}, 0.1);
  border-right-color: rgba(${(props) => props.color}, 1);
  border-left-color: rgba(${(props) => props.color}, 1);
  border-top-color: rgba(${(props) => props.color}, 0.3);
`;

type Props = {
  type: keyof typeof TETROMINOS;
};

function Square({ type }: Props) {
  return <SquareStyle type={type} color={TETROMINOS[type].color} />;
}

export default React.memo(Square);
