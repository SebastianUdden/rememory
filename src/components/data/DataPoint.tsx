import React, { useState } from "react";
import styled from "styled-components";
import { getMatching } from "../../utils/utils";
import { Button } from "../button/Button";
import Checkmark from "../checkmark/Checkmark";
import { Counter } from "../simpleComponents";
import Tags from "../tags/Tags";
import IdList from "../idList/IdList";

const Wrapper = styled.div`
  border: 1px solid #777;
  padding: 6px 10px 10px;
  border-radius: 6px;
  margin-bottom: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  box-sizing: border-box;
  overflow-x: hidden;
  position: relative;
  box-shadow: 0 3px 6px rgba(255, 255, 255, 0.16),
    0 3px 6px rgba(255, 255, 255, 0.23);
`;
const Title = styled.h2`
  font-size: 24px;
  width: 100%;
  margin: 0 0 5px;
  border-bottom: 1px solid #777;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Description = styled.div`
  margin: 0 0 5px;
`;
const P = styled.p`
  margin: 0 0 5px;
`;
const EditWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;
const Edit = styled(Button)`
  border: none;
  padding: 4px 0;
  :hover {
    background-color: inherit;
    text-decoration: underline;
  }
  :active {
    background-color: inherit;
    opacity: 0.6;
    text-decoration: underline;
  }
`;
const TimeStamp = styled.p`
  opacity: 0.3;
  font-style: cursive;
  margin: 0 0 3px;
  font-size: 8px;
  width: 100%;
  text-align: right;
`;
const ToggleDescription = styled(Button)`
  margin-top: 10px;
  padding: 4px 8px;
`;
const Li = styled.li`
  margin-left: 8px;
  padding-left: 0;
`;
const CheckLi = styled(Li)`
  list-style-type: none;
  cursor: pointer;
  margin-bottom: 5px;
`;
const Span = styled.span`
  margin-left: -4px;
`;
const Row = styled.div`
  margin-left: -4px;
  display: flex;
  align-items: center;
`;
const A = styled.a`
  font-size: 15px;
  color: magenta;
  text-decoration: none;
  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
const Strong = styled.strong`
  font-weight: 700;
  color: #777;
`;
const H3 = styled.h3`
  font-size: 16px;
  font-weight: 800;
  color: #ccffff;
  margin: 10px 0 5px;
`;
const H4 = styled.h4`
  font-size: 16px;
  margin: 10px 0 5px;
`;
const HR = styled.hr`
  width: 100%;
  border-color: #666;
`;
const Warning = styled.span`
  color: red;
  font-size: 11px;
  margin-left: auto;
  user-select: none;
`;
const InternalLink = styled.button`
  background-color: inherit;
  color: inherit;
  border: none;
  padding: 0;
  font-size: 15px;
  color: magenta;
  text-decoration: underline;
  :hover {
    cursor: pointer;
  }
`;

const formatBold = (d: any, searchValue: any) => {
  const boldRegex = /\*(.*?)\*/;
  const p = d.split(boldRegex);
  if (p.length > 1) {
    return p.map((x: any, i: any) => {
      if (i === 1) {
        return <Strong>{getMatching(x, searchValue)}</Strong>;
      }
      return getMatching(x, searchValue);
    });
  }
  return getMatching(d, searchValue);
};

const formatLink = (d: any, searchValue: any, onSelectTag: any) => {
  const urlRegex = /\[(.*)\]\((http[^\s]*)\)/;
  const match = d.match(urlRegex);
  if (match) {
    return (
      <A href={match[2]} target="_blank">
        {formatBold(match[1], searchValue)}
      </A>
    );
  }

  const alternateUrlRegex = /(http[^\s]*)/;
  const alternateMatch = d.match(alternateUrlRegex);
  if (alternateMatch) {
    return (
      <A href={alternateMatch[1]} target="_blank">
        {formatBold(alternateMatch[1], searchValue)}
      </A>
    );
  }

  const internalLinkRegex = /\+(.*)\+/;
  const internalLinkMatch = d.match(internalLinkRegex);
  if (internalLinkMatch) {
    return (
      <InternalLink onClick={() => onSelectTag(internalLinkMatch[1])}>
        {formatBold(internalLinkMatch[1], searchValue)}
      </InternalLink>
    );
  }
  return formatBold(d, searchValue);
};

const formatRow = (
  d: any,
  searchValue: any,
  onUpdateDescription: any,
  onSelect: any
) => {
  if (!d) return <br />;
  const preSlice = d.slice(0, 2);
  const postSlice = d.slice(2);
  if (preSlice === "- " && postSlice.startsWith("checked=y")) {
    const content = postSlice.slice(9);
    return (
      <CheckLi
        key={content}
        onClick={() =>
          onUpdateDescription(`${preSlice}checked=n${content}`, content)
        }
      >
        <Row>
          <Checkmark checked />
          {content}
        </Row>
      </CheckLi>
    );
  } else if (preSlice === "- " && postSlice.startsWith("checked=n")) {
    const content = postSlice.slice(9);
    return (
      <CheckLi
        key={content}
        onClick={() =>
          onUpdateDescription(`${preSlice}checked=y${content}`, content)
        }
      >
        <Row>
          <Checkmark />
          {content}
        </Row>
      </CheckLi>
    );
  } else if (preSlice === "- ") {
    return (
      <Li key={postSlice}>
        <Span>{formatLink(postSlice, searchValue, onSelect)}</Span>
      </Li>
    );
  } else if (preSlice === "# ") {
    return (
      <H3 key={postSlice}>{formatLink(postSlice, searchValue, onSelect)}</H3>
    );
  } else if (preSlice === "##") {
    return (
      <H4 key={postSlice}>{formatLink(postSlice, searchValue, onSelect)}</H4>
    );
  }
  return <P key={postSlice}>{formatLink(d, searchValue, onSelect)}</P>;
};

interface Props {
  id: any;
  title: any;
  searchValue: any;
  description: any;
  tags: any;
  children: any;
  parents: any;
  favorite: any;
  lastUpdate: any;
  hasBackup: any;
  onSelect: any;
  onEdit: any;
  showAll: any;
  editData: any;
}

const DataPoint = ({
  id,
  title,
  searchValue,
  description,
  tags,
  children,
  parents,
  favorite,
  lastUpdate,
  hasBackup,
  onSelect,
  onEdit,
  showAll,
  editData,
}: Props) => {
  const [showFullDescription, setShowFullDescription] = useState(false);
  const maxRowCount = 5;
  const descriptionRows = description?.split("\n");
  const todoCount = descriptionRows?.filter((dp: any) =>
    dp.startsWith("-")
  ).length;
  const onUpdateDescription = (desc: any, descEnd: any) => {
    editData({
      id,
      title,
      description: descriptionRows
        .map((row: any) => (row.slice(11) === descEnd ? desc : row))
        .join("\n"),
      tags,
      children,
      lastUpdate,
    });
  };
  const rows = descriptionRows?.map((d: any) =>
    formatRow(d, searchValue, onUpdateDescription, onSelect)
  );
  const descriptionShorterThanMax =
    showAll || !description || rows.length <= maxRowCount;
  const desc =
    showFullDescription || descriptionShorterThanMax
      ? rows
      : [...rows.slice(0, maxRowCount), "..."];
  const isTodo =
    title.includes("Todo") || tags.find((t: any) => t.title.includes("Todo"));
  return (
    <Wrapper>
      <Title>
        {getMatching(title, searchValue)}
        <EditWrapper>
          <Edit
            onClick={() =>
              onEdit({
                id,
                title,
                description,
                tags,
                children,
                parents,
                favorite,
                lastUpdate,
              })
            }
          >
            Edit
          </Edit>
          {lastUpdate && (
            <TimeStamp>{new Date(lastUpdate).toLocaleString()}</TimeStamp>
          )}
        </EditWrapper>
      </Title>
      {parents?.length > 0 && (
        <>
          <IdList
            isParents
            list={parents}
            onSelectItem={onSelect}
            searchValue={searchValue}
          />
        </>
      )}
      <Description>
        {desc}
        {!descriptionShorterThanMax && (
          <ToggleDescription
            onClick={() => setShowFullDescription(!showFullDescription)}
          >
            {showFullDescription ? "Show less" : "Show more"}
          </ToggleDescription>
        )}
      </Description>
      {tags?.length > 0 && (
        <Tags
          tags={tags.map((t: any) => t.title)}
          onSelectTag={onSelect}
          searchValue={searchValue}
        />
      )}
      {children?.length > 0 && (
        <>
          <HR />
          <IdList
            list={children}
            onSelectItem={onSelect}
            searchValue={searchValue}
          />
        </>
      )}
      {isTodo && todoCount !== 0 && <Counter>{todoCount || 0}</Counter>}
      {!hasBackup && <Warning>This data has no backup</Warning>}
    </Wrapper>
  );
};

export default DataPoint;
