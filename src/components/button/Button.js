import styled from "styled-components";

export const Button = styled.button`
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: inherit;
  color: inherit;
  border: 1px solid white;
  cursor: pointer;
  :hover {
    background-color: #222;
  }
  :active {
    background-color: #333;
  }
`;
