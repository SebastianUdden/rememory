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

const listDiff = (edit: any, newEdit: any, type: any) =>
  (edit[type] && !edit[type].every((t: any) => newEdit[type].includes(t))) ||
  (edit[type] && !newEdit[type].every((t: any) => edit[type].includes(t)));

const checkDiff = (edit: any, newEdit: any) => {
  if (edit.title !== newEdit.title) return true;
  if (edit.description !== newEdit.description) return true;
  if (edit.favorite !== newEdit.favorite) return true;
  if (listDiff(edit, newEdit, "tags")) {
    return true;
  }
  if (listDiff(edit, newEdit, "children")) {
    return true;
  }
  console.log("Check parents");
  if (listDiff(edit, newEdit, "parents")) {
    console.log("Diff exists");
    return true;
  }
  return false;
};

interface Props {
  onEdit?: any;
  onDelete?: any;
  onHide?: any;
  edit?: any;
  tagSuggestions?: any;
  childrenSuggestions?: any;
  updateParents?: any;
  updateChildren?: any;
}

const Edit = ({
  onEdit,
  onDelete,
  onHide,
  edit,
  tagSuggestions,
  childrenSuggestions,
  updateParents,
  updateChildren,
}: Props) => {
  const [showDelete, setShowDelete] = useState(false);
  const [title, setTitle] = useState(edit.title);
  const [description, setDescription] = useState(edit.description);
  const [tags, setTags] = useState(edit.tags);
  const [children, setChildren] = useState(edit.children || []);
  const [oldChildren, setOldChildren] = useState([]);
  const [parents, setParents] = useState(edit.parents || []);
  const [oldParents, setOldParents] = useState([]);
  const [favorite, setFavorite] = useState(edit.favorite);
  const editRef = useRef<any>(null);

  const onSubmit = () => {
    if (!title) return onHide();
    onEdit({
      id: edit.id,
      title,
      description,
      tags,
      children,
      parents,
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
    parents,
    favorite,
  });

  useEffect(() => {
    editRef?.current?.focus();
  }, []);

  useEffect(() => {
    const diff = oldChildren.filter((x) => !children.includes(x));
    if (oldChildren.length > children.length && diff.length) {
      // eslint-disable-next-line
      updateParents({ id: edit.id, title }, children, diff[0]);
    } else {
      // eslint-disable-next-line
      updateParents({ id: edit.id, title }, children);
    }
    setOldChildren(children);
    // eslint-disable-next-line
  }, [children]);
  useEffect(() => {
    const diff = oldParents.filter((x) => !parents.includes(x));
    if (oldParents.length > parents.length && diff.length) {
      // eslint-disable-next-line
      updateChildren({ id: edit.id, title }, parents, diff[0]);
    } else {
      // eslint-disable-next-line
      updateChildren({ id: edit.id, title }, parents);
    }
    setOldParents(parents);
    // eslint-disable-next-line
  }, [parents]);

  return (
    <Wrapper>
      <Label htmlFor="title">Title</Label>
      <Row>
        <Input
          id="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Row>
      <Label htmlFor="description">Description</Label>
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
          onListChange={(list: any) => setTags(list)}
          defaultList={tags}
          suggestions={tagSuggestions}
        />
      )}
      <List
        title="Children"
        onListChange={(list: any) => setChildren(list)}
        defaultList={children}
        suggestions={childrenSuggestions}
      />
      <List
        title="Parents"
        onListChange={(list: any) => setParents(list)}
        defaultList={parents}
        suggestions={childrenSuggestions}
      />
      {edit.id !== 0 && (
        <>
          <Label htmlFor="favorite">Favorite order</Label>
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
