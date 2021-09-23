import styled from "styled-components";
import { Button } from "./Button";

const Big = styled(Button)`
  height: 100%;
  font-size: 35px;
  padding: 0 10px;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #777;
`;

const BigButton = ({ onClick, children }) => (
  <Big onClick={onClick}>{children}</Big>
);

export default BigButton;
