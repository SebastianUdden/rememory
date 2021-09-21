import styled from "styled-components";
import { Button } from "./Button";

const Big = styled(Button)`
  width: 50px;
  height: 100%;
  font-size: 35px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const BigButton = ({ text, onClick }) => (
  <Big onClick={onClick}>
    <span>{text}</span>
  </Big>
);

export default BigButton;
