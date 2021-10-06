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
import { DataProps } from "../data/Data";

const AddRow = styled(Row)`
  margin-top: 20px;
`;

interface Props {
  onCreateMemory: (dataPoint: DataProps) => void;
  onHide?: () => void;
  tagSuggestions?: any;
  childrenSuggestions?: any;
}

const Add = ({
  onCreateMemory,
  onHide,
  tagSuggestions,
  childrenSuggestions,
}: Props) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<any>([]);
  const [children, setChildren] = useState<any>([]);
  const titleRef = useRef<any>(null);

  const onSubmit = () => {
    if (!title || childrenSuggestions.includes(title)) {
      titleRef?.current?.focus();
      return;
    }
    onCreateMemory({
      id: uuidv4(),
      title,
      description,
      tags,
      children,
      lastUpdate: new Date().toString(),
      hasBackup: false,
    });
  };
  useEffect(() => {
    titleRef?.current?.focus();
  }, []);

  return (
    <Wrapper>
      <Label htmlFor="title">Title</Label>
      <Row>
        <Input
          ref={titleRef}
          id="title"
          placeholder="Title"
          value={title}
          onChange={(e: any) => setTitle(e.target.value)}
        />
      </Row>
      <Label htmlFor="description">Description</Label>
      <TextArea
        id="description"
        placeholder="Description"
        value={description}
        onChange={(e: any) => setDescription(e.target.value)}
      />
      <List
        title="Tags"
        onListChange={(list: any) => setTags(list)}
        defaultList={tags}
        suggestions={tagSuggestions}
      />
      <List
        title="Children"
        onListChange={(list: any) => setChildren(list)}
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
