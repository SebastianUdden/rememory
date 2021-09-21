import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { uuidv4 } from "../../utils/utils";
import {
  Cancel,
  Input,
  Label,
  Row,
  Submit,
  TextArea,
  Wrapper,
} from "../simpleComponents";
import List from "../list/List";
const AddRow = styled(Row)`
  margin-top: 20px;
`;
const Add = ({
  onCreateMemory,
  onHide,
  tagSuggestions,
  childrenSuggestions,
}) => {
  const [title, setTitle] = useState(undefined);
  const [description, setDescription] = useState(undefined);
  const [tags, setTags] = useState([]);
  const [children, setChildren] = useState([]);
  const titleRef = useRef(null);

  const onSubmit = () => {
    if (!title || childrenSuggestions.includes(title)) {
      titleRef.current.focus();
      return;
    }
    onCreateMemory({
      id: uuidv4(),
      title,
      description,
      tags,
      children,
      lastUpdate: new Date(),
      hasBackup: false,
    });
  };
  useEffect(() => {
    titleRef.current.focus();
  }, []);

  return (
    <Wrapper>
      <Label for="title">Title</Label>
      <Row>
        <Input
          ref={titleRef}
          id="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Row>
      <Label for="description">Description</Label>
      <TextArea
        id="description"
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <List
        title="Tags"
        onListChange={(list) => setTags(list)}
        defaultList={tags}
        suggestions={tagSuggestions}
      />
      <List
        title="Children"
        onListChange={(list) => setChildren(list)}
        defaultList={children}
        suggestions={childrenSuggestions}
      />

      <AddRow>
        <Submit onClick={onSubmit}>Add memory</Submit>
        <Cancel onClick={onHide}>Cancel</Cancel>
      </AddRow>
    </Wrapper>
  );
};
export default Add;
