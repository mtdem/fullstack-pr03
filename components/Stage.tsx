import * as React from 'react';
import Square from './Square';
import styled from 'styled-components';
import { TETROMINOS } from '../tetrominos';

const MapStyle = styled.div`
  display: grid;
  grid-template-rows: repeat(
    ${(props) => props.height},
    calc(25vw / ${(props) => props.width})
  );
  grid-template-columns: repeat(${(props) => props.width}, 1fr);
  grid-gap: 1px;
  border: 2px solid #333;
  width: 100%;
  max-width: 25vw;
  background: #111;
`;

export type SquareModel = [keyof typeof TETROMINOS, string];
export type StageModel = SquareModel[][];

type Props = {
  stage: StageModel;
};

export default function Stage({ stage }: Props) {
  return (
    <MapStyle width={stage[0].length} height={stage.length}>
      {stage.map((row) =>
        row.map((cell, x) => <Square key={x} type={cell[0]} />)
      )}
    </MapStyle>
  );
}
