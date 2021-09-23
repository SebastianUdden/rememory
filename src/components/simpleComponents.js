import styled from "styled-components";
import { Button } from "./button/Button";

export const Label = styled.label`
  display: block;
  font-size: 20px;
  margin-bottom: 7px;
`;
export const Input = styled.input`
  background-color: inherit;
  color: inherit;
  padding: 15px;
  border: 1px solid #777;
  border-radius: 6px;
  width: 100%;
  font-size: 16px;
  box-sizing: border-box;
`;
export const TextArea = styled.textarea`
  background-color: inherit;
  font-family: inherit;
  color: inherit;
  padding: 15px;
  border: 1px solid #777;
  border-radius: 6px;
  margin-bottom: 15px;
  width: 100%;
  font-size: 16px;
  box-sizing: border-box;
  resize: vertical;
  height: 400px;
`;
export const Wrapper = styled.div`
  text-align: left;
`;
export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  button {
    margin-right: 20px;
  }
  button:last-child {
    margin-right: 0;
  }
  margin-bottom: ${(p) => p.marginBottom || "15px"};
`;
export const ButtonWrapper = styled.div`
  margin-left: 10px;
`;
export const Cancel = styled(Button)`
  font-size: 20px;
  padding: 10px;
  width: 100%;
`;
export const Submit = styled(Cancel)`
  background-color: #ddd;
  color: #222;
  :hover {
    background-color: #eee;
  }
  :active {
    background-color: #fff;
  }
  &[disabled] {
    opacity: 0.1;
    cursor: not-allowed;
    :hover {
      background-color: #ddd;
    }
  }
`;
export const Counter = styled.div`
  background-color: ${(p) => (p.gold ? "#cc9900" : "#cc1100")};
  color: white;
  padding: 4px;
  border-radius: 50%;
  font-size: 11px;
  margin-left: auto;
  margin-right: -2px;
  margin-bottom: -2px;
  min-width: 14px;
  text-align: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  cursor: inherit;
`;
