import React from "react";
import styled from "styled-components";

const SVG = styled.svg`
  margin-right: 4px;
`;
const Circle = styled.circle`
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
`;

interface Props {
  checked?: boolean;
}

const Checkmark = ({ checked }: Props) => (
  <SVG viewBox="0 0 100 100" height="20px" width="20px">
    <g stroke="currentColor" fill={checked ? "green" : "none"} strokeWidth="5">
      {checked ? (
        <>
          <Circle cx="50" cy="50" r="45" stroke="green" />
          <line x1="30" x2="50" y1="50" y2="75" strokeWidth="10" />
          <line x1="50" x2="70" y1="75" y2="30" strokeWidth="10" />
        </>
      ) : (
        <Circle cx="50" cy="50" r="45" />
      )}
    </g>
  </SVG>
);

export default Checkmark;
