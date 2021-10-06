import { useEffect, useState } from "react";
import styled from "styled-components";
import { REMEMORY_LOCALSTORAGE } from "../../constants/constants";
import Add from "../add/Add";
import Edit from "../edit/Edit";
import DataPoints from "./DataPoints";
import Horizontals from "./Horizontals";
import SearchBar from "./SearchBar";

const Wrapper = styled.div`
  text-align: left;
`;

const checkSearchMatch = (search: string, value: string) =>
  value?.toLowerCase().includes(search);

const sortOnLastUpdate = (a: DataProps, b: DataProps) => {
  const first = new Date(a.lastUpdate);
  const second = new Date(b.lastUpdate);
  return first < second ? 1 : first > second ? -1 : 0;
};

const MAX_RESULTS = 20;

const sideMenu = {
  id: "0",
  title: "Root",
  description:
    "Add children to the root in order to show them in the side menu.",
  children: [],
  tags: [],
  favorite: 0,
};

interface SimpleDataProps {
  title: string;
  id: string;
}

export interface DataProps extends SimpleDataProps {
  children: any[];
  description: string;
  favorite?: string;
  hasBackup: boolean;
  lastUpdate: string;
  parents?: any[];
  tags: any[];
}

interface Props {
  data: {
    metaData: any[];
    data: DataProps[];
  };
}

const RED = "#880000";
const GREEN = "#008800";
const GREY = "#888888";

const Data = ({ data }: Props) => {
  const [dataPoints, setDataPoints] = useState(data?.data || [sideMenu]);
  const [metaDataPoints, setMetaDataPoints] = useState(
    data?.metaData || [sideMenu]
  );
  const [points, setPoints] = useState<any>([]);

  const [edit, setEdit] = useState<any>({});
  const [showEdit, setShowEdit] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [addStatus, setAddStatus] = useState("inherit");
  const [searchValue, setSearchValue] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState<any>([]);
  const [childrenSuggestions, setChildrenSuggestions] = useState<any>([]);

  const onDataChange = (status: any) => {
    setShowAdd(false);
    setShowEdit(false);
    setAddStatus(status);
    setTimeout(() => setAddStatus("inherit"), 200);
  };
  const addData = (dataPoint: DataProps) => {
    const newDataPoints = [dataPoint, ...dataPoints];
    setDataPoints(newDataPoints);
    const newMetaDataPoints = [
      ...metaDataPoints,
      { id: dataPoint.id, title: dataPoint.title },
    ];
    setMetaDataPoints(newMetaDataPoints);
    onDataChange(GREEN);
  };
  const editData = (dataPoint: any) => {
    const newDataPoints = [
      dataPoint,
      ...dataPoints.filter((dp) => dp.id !== dataPoint.id),
    ];
    setDataPoints(newDataPoints);
    const newMetaDataPoints = [
      {
        id: dataPoint.id,
        title: dataPoint.title,
        children: dataPoint.children,
        parents: dataPoint.parents,
      },
      ...metaDataPoints.filter((dp) => dp.id !== dataPoint.id),
    ];
    setMetaDataPoints(newMetaDataPoints);
    onDataChange(GREEN);
  };
  const deleteData = (id: string) => {
    const newDataPoints = [...dataPoints.filter((dp) => dp.id !== id)];
    setDataPoints(newDataPoints);
    onDataChange(RED);
  };
  const updateParents = (parent: any, children: any, removedChild: any) => {
    const childrenIndexes = children.map((c: DataProps) => {
      return dataPoints?.findIndex((d) => c.id === d.id);
    });
    const updatedDataPoints = dataPoints.map((d, i) => {
      if (childrenIndexes.includes(i)) {
        const parents = d.parents || [];
        const parentExists = parents.find((p) => p.id === parent.id);

        const newParents = parentExists ? parents : [...parents, parent];
        const result = { ...d, parents: newParents };
        return result;
      }
      if (d.id === removedChild?.id) {
        return { ...d, parents: d.parents?.filter((c) => c.id !== parent.id) };
      }
      return d;
    });
    setDataPoints(updatedDataPoints);
  };
  const updateChildren = (child: any, parents: any, removedParent: any) => {
    const parentsIndexes = parents.map((p: DataProps) => {
      return dataPoints?.findIndex((d) => p.id === d.id);
    });
    const updatedDataPoints = dataPoints.map((d, i) => {
      if (parentsIndexes.includes(i)) {
        const children = d.children || [];
        const childExists = children.find((p) => p.id === child.id);

        const newChildren = childExists ? children : [...children, child];
        const result = { ...d, children: newChildren };
        return result;
      }
      if (d.id === removedParent?.id) {
        return { ...d, children: d.children.filter((c) => c.id !== child.id) };
      }
      return d;
    });
    setDataPoints(updatedDataPoints);
  };
  const onHide = () => onDataChange(GREY);
  const onEdit = (value: any) => {
    setEdit(value);
    setShowEdit(true);
  };
  const handleSearch = (value: any, isSimpleSearch: any) => {
    const search = value?.toLowerCase().trim();
    const dps = dataPoints.filter(
      (dp) =>
        checkSearchMatch(search, dp.id) ||
        checkSearchMatch(search, dp.title) ||
        checkSearchMatch(search, dp.description) ||
        dp.tags.some((t) => checkSearchMatch(search, t.title))
    );
    setPoints(dps.slice(0, MAX_RESULTS));

    if (isSimpleSearch) return;
    setSearchValue(value);
  };

  useEffect(() => {
    const tags = [...new Set(dataPoints?.map((dp) => dp.tags).flat())].sort();
    setTagSuggestions(tags);
    setChildrenSuggestions(
      dataPoints.map((dp) => ({ title: dp.title, id: dp.id }))
    );
    setPoints(dataPoints?.slice(0, MAX_RESULTS));

    localStorage.setItem(
      REMEMORY_LOCALSTORAGE,
      JSON.stringify({ metaData: metaDataPoints, data: dataPoints })
    );
  }, [dataPoints, metaDataPoints]);

  return (
    <Wrapper>
      {showEdit && (
        <Edit
          onHide={onHide}
          onEdit={editData}
          onDelete={deleteData}
          edit={edit}
          tagSuggestions={tagSuggestions}
          childrenSuggestions={childrenSuggestions}
          updateParents={updateParents}
          updateChildren={updateChildren}
        />
      )}
      {showAdd && (
        <Add
          onHide={onHide}
          onCreateMemory={addData}
          tagSuggestions={tagSuggestions}
          childrenSuggestions={childrenSuggestions}
        />
      )}
      {!showAdd && !showEdit && (
        <>
          <SearchBar
            onClear={() => setSearchValue("")}
            handleSearch={handleSearch}
            addStatus={addStatus}
            metaDataPoints={metaDataPoints}
            onShowAdd={() => setShowAdd(true)}
            tagSuggestions={tagSuggestions}
          />
          <Horizontals dataPoints={dataPoints} handleSearch={handleSearch} />
          <DataPoints
            dataPoints={points?.sort(sortOnLastUpdate)}
            searchValue={searchValue.trim()}
            onSelect={handleSearch}
            onEdit={onEdit}
            showAll={points.length < 4}
            editData={editData}
          />
        </>
      )}
    </Wrapper>
  );
};

export default Data;
