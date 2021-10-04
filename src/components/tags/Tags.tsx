import React from "react";
import styled from "styled-components";
import { getMatching } from "../../utils/utils";

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 5px 0;
`;
const Tag = styled.span<{ isChildren?: boolean; isParents?: boolean }>`
  background-color: #3a3a3a;
  border-radius: 12px;
  padding: 7px 10px;
  text-transform: capitalize;
  margin-right: 5px;
  cursor: pointer;
  ${(p) =>
    p.isChildren &&
    `
      background-color: inherit;
      border: 1px solid #777;
  `}
  ${(p) =>
    p.isParents &&
    `
      border: none;
      background-color: inherit;
      padding: 0;
      opacity: 0.5;
  `}
  :hover {
    background-color: #5a5a5a;
    ${(p) =>
      p.isChildren &&
      `
      background-color: #222;
  `}
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
    background-color: #7a7a7a;
    ${(p) =>
      p.isChildren &&
      `
      background-color: #333;
  `}
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

interface Props {
  tags?: any;
  searchValue?: any;
  onSelectTag?: any;
  isChildren?: any;
  isParents?: any;
}

const Tags = ({
  tags,
  searchValue,
  onSelectTag,
  isChildren,
  isParents,
}: Props) => (
  <Wrapper>
    {tags?.map((tag: any) => (
      <Tag
        key={tag}
        onClick={() => onSelectTag(tag)}
        isChildren={isChildren}
        isParents={isParents}
      >
        {searchValue ? getMatching(tag, searchValue) : tag}
      </Tag>
    ))}
  </Wrapper>
);

export default Tags;
