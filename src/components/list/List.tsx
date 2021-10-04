import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ButtonWrapper, Input, Label, Row } from "../simpleComponents";
import Tags from "../tags/Tags";
import BigButton from "../button/BigButton";
import { uuidv4 } from "../../utils/utils";

const Wrapper = styled.div``;
const TagsWrapper = styled.div`
  margin-bottom: 15px;
`;

interface Props {
  title?: any;
  onListChange?: any;
  defaultList?: any;
  suggestions?: any;
}

const List = ({ title, onListChange, defaultList, suggestions }: Props) => {
  const inputRef = useRef<any>(null);
  const [value, setValue] = useState("");
  const [list, setList] = useState(defaultList);

  const addToList = () => {
    inputRef.current.focus();
    if (
      !value ||
      list.some((v: any) => v.title.toLowerCase() === value.toLowerCase())
    ) {
      setValue("");
      return;
    }
    const newItem =
      suggestions[0] &&
      suggestions[0].title &&
      suggestions.find((v: any) => v.title === value);
    if (newItem) {
      setList([...list, newItem]);
    } else {
      setList([...list, { title: value, id: uuidv4() }]);
    }
    setValue("");
  };

  useEffect(() => {
    onListChange(list);
  }, [onListChange, list]);
  return (
    <Wrapper>
      <Label htmlFor={title}>{title}</Label>
      <Row marginBottom={"10px"}>
        <Input
          id={title}
          list={`${title}-suggestions`}
          ref={inputRef}
          placeholder={title}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        {suggestions && (
          <datalist id={`${title}-suggestions`}>
            {suggestions
              .filter((s: any) => !list.some((l: any) => l.id === s.id))
              .map((s: any) => (
                <option value={s.title} />
              ))}
          </datalist>
        )}
        <ButtonWrapper>
          <BigButton onClick={addToList}>+</BigButton>
        </ButtonWrapper>
      </Row>
      <TagsWrapper>
        {list.length > 0 && (
          <Tags
            tags={list.map((l: any) => l.title || l.value || l)}
            onSelectTag={(value: any) => {
              setList(list.filter((v: any) => v.title !== value));
            }}
          />
        )}
      </TagsWrapper>
    </Wrapper>
  );
};
export default List;
