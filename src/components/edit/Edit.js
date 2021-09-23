import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import List from "../list/List";
import {
  Cancel,
  Input,
  Label,
  Row,
  Submit,
  TextArea,
  Wrapper,
} from "../simpleComponents";

const Delete = styled(Cancel)`
  background-color: #550000;
  border: 1px solid #550000;
  color: #fff;
  :hover {
    background-color: #660000;
    border: 1px solid #660000;
  }
  :active {
    background-color: #770000;
    border: 1px solid #770000;
  }
`;
const EditRow = styled(Row)`
  margin: 20px 0;
`;

const listDiff = (edit, newEdit, type) =>
  (edit[type] && !edit[type].every((t) => newEdit[type].includes(t))) ||
  (edit[type] && !newEdit[type].every((t) => edit[type].includes(t)));

const checkDiff = (edit, newEdit) => {
  if (edit.title !== newEdit.title) return true;
  if (edit.description !== newEdit.description) return true;
  if (edit.favorite !== newEdit.favorite) return true;
  if (listDiff(edit, newEdit, "tags")) {
    return true;
  }
  if (listDiff(edit, newEdit, "children")) {
    return true;
  }
  return false;
};

const Edit = ({
  onEdit,
  onDelete,
  onHide,
  edit,
  tagSuggestions,
  childrenSuggestions,
  updateParents,
}) => {
  const [showDelete, setShowDelete] = useState(false);
  const [title, setTitle] = useState(edit.title);
  const [description, setDescription] = useState(edit.description);
  const [tags, setTags] = useState(edit.tags);
  const [children, setChildren] = useState(edit.children || []);
  const [favorite, setFavorite] = useState(edit.favorite);
  const editRef = useRef(null);

  const onSubmit = () => {
    if (!title) return onHide();
    onEdit({
      id: edit.id,
      title,
      description,
      tags,
      children,
      lastUpdate: new Date(),
      hasBackup: false,
      favorite,
    });
  };

  const diff = checkDiff(edit, {
    title,
    description,
    tags,
    children,
    favorite,
  });

  useEffect(() => {
    editRef.current.focus();
  }, []);

  useEffect(() => {
    // eslint-disable-next-line
    updateParents({ id: edit.id, title }, children);
    // eslint-disable-next-line
  }, [children]);

  return (
    <Wrapper>
      <Label for="title">Title</Label>
      <Row>
        <Input
          id="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Row>
      <Label for="description">Description</Label>
      <TextArea
        id="description"
        ref={editRef}
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {edit.id !== 0 && (
        <List
          title="Tags"
          onListChange={(list) => setTags(list)}
          defaultList={tags}
          suggestions={tagSuggestions}
        />
      )}
      <List
        title="Children"
        onListChange={(list) => setChildren(list)}
        defaultList={children}
        suggestions={childrenSuggestions}
      />
      {edit.id !== 0 && (
        <>
          <Label for="favorite">Favorite order</Label>
          <Row>
            <Input
              id="favorite"
              placeholder="Favorite"
              type="number"
              value={favorite}
              onChange={(e) => setFavorite(e.target.value)}
            />
          </Row>
        </>
      )}
      <EditRow>
        <Submit onClick={onSubmit} disabled={!diff}>
          Edit
        </Submit>
        {edit.id !== 0 && (
          <Delete onClick={() => setShowDelete(!showDelete)}>
            {showDelete ? "Hide" : "Delete"}
          </Delete>
        )}
        <Cancel onClick={onHide}>Cancel</Cancel>
      </EditRow>
      {showDelete && (
        <Row>
          <Delete onClick={() => onDelete(edit.id)}>
            Permanently delete memory
          </Delete>
        </Row>
      )}
    </Wrapper>
  );
};
export default Edit;
