import React from "react";
import styled from "styled-components";
import { getMatching } from "../../utils/utils";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 5px 0;
`;
const Item = styled.span`
  border-radius: 12px;
  padding: 7px 10px;
  text-transform: capitalize;
  margin-right: 5px;
  cursor: pointer;
  background-color: inherit;
  border: 1px solid #777;
  ${(p) =>
    p.isParents &&
    `
      border: none;
      background-color: inherit;
      padding: 0;
      opacity: 0.5;
  `}
  :hover {
    background-color: #222;
    ${(p) =>
      p.isParents &&
      `
        border: none;
        background-color: inherit;
        padding: 0;
        opacity: 1;
    `}}
  }
  :active {
    background-color: #333;
    ${(p) =>
      p.isParents &&
      `
      border: none;
      background-color: inherit;
      padding: 0;
  `}}
  }
  margin-bottom: 5px;
`;

const IdList = ({ list, searchValue, onSelectItem, isParents }) => (
  <Wrapper>
    {list?.map(({ id, title }) => (
      <Item
        key={id}
        onClick={() => onSelectItem(id, true)}
        isParents={isParents}
      >
        {searchValue ? getMatching(title, searchValue) : title}
      </Item>
    ))}
  </Wrapper>
);

export default IdList;
