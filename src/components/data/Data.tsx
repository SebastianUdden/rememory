import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SVG from "../../svgs/SVG";
import Add from "../add/Add";
import BigButton from "../button/BigButton";
import { Button } from "../button/Button";
import Edit from "../edit/Edit";
import Search from "../search/Search";
import SideMenu from "../sideMenu/SideMenu";
import { Counter } from "../simpleComponents";
import DataPoints from "./DataPoints";
import { verticalSplit } from "../../svgs/vertical-split";
import { add } from "../../svgs/add";

const Wrapper = styled.div`
  text-align: left;
`;
const Row = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 15px;
`;
const HorizontalScroll = styled(Row)`
  overflow-x: scroll;
  padding-bottom: 15px;
  margin-bottom: 0;
`;
const ButtonWrapper = styled.div<{ status?: string; margin: string }>`
  background-color: ${(p) => p.status || "inherit"};
  border-radius: 6px;
  transition: background-color 300ms ease;
  margin: ${(p) => p.margin};
`;
const ClearButton = styled(Button)`
  width: 60px;
  height: 50px;
`;
const Point = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-right: 10px;
  opacity: 0.8;
  :hover {
    opacity: 1;
    strong {
      text-decoration: underline;
    }
  }
`;
const Title = styled.strong`
  margin-right: 5px;
  white-space: nowrap;
`;
const Deadline = styled.span<{ status?: string }>`
  background-color: ${(p) => p.status || "#444"};
  padding: 5px;
  border-radius: 6px;
  font-size: 14px;
  white-space: nowrap;
`;

const checkSearchMatch = (search: string, value: string) =>
  value?.toLowerCase().includes(search);

const sortOnLastUpdate = (a: DataProps, b: DataProps) => {
  const first = new Date(a.lastUpdate);
  const second = new Date(b.lastUpdate);
  return first < second ? 1 : first > second ? -1 : 0;
};

const getFavorites = (dataPoints: DataProps[]) => {
  console.log({ dataPoints });
  const favorites = dataPoints
    .filter((dp) => dp.favorite)
    .map((dp) => ({
      id: dp.id,
      title: dp.title,
      favorite: parseInt(dp.favorite),
    }));
  return favorites;
};

const getDailies = (dataPoints: DataProps[]) => {
  const dailiesPoints = dataPoints
    .filter((dp) =>
      dp.tags.find((t) => t.title.toLowerCase().includes("daily"))
    )
    .map((dp) => ({
      title: dp.title,
      count: dp.description?.split("\n").filter((dp) => dp.startsWith("-"))
        .length,
    }));
  return dailiesPoints;
};

const getTodos = (dataPoints: DataProps[]) => {
  const todoPoints = dataPoints
    .filter((dp) => dp.tags.find((t) => t.title.toLowerCase().includes("todo")))
    .map((dp) => ({
      title: dp.title,
      count: dp.description?.split("\n").filter((dp) => dp.startsWith("-"))
        .length,
    }));
  return todoPoints;
};

const getDeadlines = (dataPoints: DataProps[]) => {
  const deadlinePoints = dataPoints
    .filter((dp) =>
      dp.tags.find((t) => t.title.toLowerCase().includes("deadline"))
    )
    .map((dp) => {
      const deadlineRow = dp.description
        ?.split("\n")
        .find((row) => row.toLowerCase().includes("deadline"));

      const deadline = deadlineRow?.split(": ")[1];
      return {
        title: dp.title,
        date: deadline,
        status: getStatus(deadline),
      };
    });
  return deadlinePoints;
};

const getDateObject = (date?: string) => {
  const d = date ? new Date(date) : new Date();
  return {
    month: d.getMonth(),
    day: d.getDate(),
  };
};

const getStatus = (date?: string) => {
  const now = getDateObject();
  const then = getDateObject(date);
  if (then.month === now.month && then.day === now.day + 3) {
    return { label: "3 days left", color: GOLD };
  } else if (then.month === now.month && then.day === now.day + 2) {
    return { label: "2 days left", color: GOLD };
  } else if (then.month === now.month && then.day === now.day + 1) {
    return { label: "tomorrow", color: ORANGE };
  } else if (then.month === now.month && then.day === now.day) {
    return { label: "today", color: RED };
  } else if (then.month === now.month && then.day === now.day - 1) {
    return { label: "due yesterday", color: RED };
  } else if (then.month === now.month && then.day === now.day - 2) {
    return { label: "due 2 days ago", color: RED };
  } else if (then.month === now.month && then.day === now.day - 3) {
    return { label: "due 3 days ago", color: RED };
  } else if (
    then.month > now.month ||
    (then.month === now.month && then.day > now.day)
  ) {
    return { label: "later", color: GREY };
  }
  return { label: "passed", color: RED };
};

const sortOnDate = (a: any, b: any) => {
  console.log({ a });
  return new Date(a.date).getTime() - new Date(b.date).getTime();
};
const sortOnCount = (a: any, b: any) => parseInt(a.count) - parseInt(b.count);
const sortOnFavorite = (a: DataProps, b: DataProps) =>
  parseInt(a.favorite) - parseInt(b.favorite);

const MAX_RESULTS = 10;
const RED = "#cc1100";
const GOLD = "#cc9900";
const ORANGE = "#dd8800";
const GREY = "#444444";

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

interface DataProps extends SimpleDataProps {
  children: any[];
  description: string;
  favorite: string;
  hasBackup: boolean;
  lastUpdate: string;
  parents: any[];
  tags: any[];
}

interface Props {
  data: {
    metaData: any[];
    data: DataProps[];
  };
}

const Data = ({ data }: Props) => {
  const searchRef = useRef<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [dataPoints, setDataPoints] = useState(data?.data || [sideMenu]);
  const [metaDataPoints, setMetaDataPoints] = useState(
    data?.metaData || [sideMenu]
  );
  const [points, setPoints] = useState<any>([]);
  const [todos, setTodos] = useState<any>([]);
  const [dailies, setDailies] = useState<any>([]);
  const [deadlines, setDeadlines] = useState<any>([]);
  const [favorites, setFavorites] = useState<any>([]);
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
    onDataChange("#008800");
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
    onDataChange("#008800");
  };
  const deleteData = (id: string) => {
    const newDataPoints = [...dataPoints.filter((dp) => dp.id !== id)];
    setDataPoints(newDataPoints);
    onDataChange("#880000");
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
        return { ...d, parents: d.parents.filter((c) => c.id !== parent.id) };
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
  const onHide = () => onDataChange("#888888");
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
  const handleClear = () => {
    setSearchValue("");
    if (searchRef?.current) {
      searchRef.current.focus();
    }
  };

  useEffect(() => {
    const tags = [...new Set(dataPoints?.map((dp) => dp.tags).flat())].sort();
    setTagSuggestions(tags);
    setChildrenSuggestions(
      dataPoints.map((dp) => ({ title: dp.title, id: dp.id }))
    );
    setPoints(dataPoints?.slice(0, MAX_RESULTS));
    setTodos(getTodos(dataPoints));
    setDailies(getDailies(dataPoints));
    setDeadlines(getDeadlines(dataPoints));
    setFavorites(getFavorites(dataPoints));

    localStorage.setItem(
      "rememory-data-points",
      JSON.stringify({ metaData: metaDataPoints, data: dataPoints })
    );
  }, [dataPoints, metaDataPoints]);

  const root = metaDataPoints.find((md) => md.id === "0") || { children: [] };
  return (
    <Wrapper>
      <SideMenu
        showMenu={showMenu}
        handleHideMenu={() => setShowMenu(false)}
        data={metaDataPoints}
        onSelectMenu={(value: any) => {
          handleSearch(value, true);
          setShowMenu(false);
        }}
      />
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
          <Row>
            {root?.children?.length !== 0 && (
              <ButtonWrapper status={addStatus} margin="0 4px 0 0">
                <BigButton onClick={() => setShowMenu(true)}>
                  <SVG {...verticalSplit} />
                </BigButton>
              </ButtonWrapper>
            )}
            <ButtonWrapper status={addStatus} margin="0 5px 0 0">
              <BigButton onClick={() => setShowAdd(true)}>
                <SVG {...add} size={28} />
              </BigButton>
            </ButtonWrapper>
            <Search
              searchRef={searchRef}
              onChange={handleSearch}
              searchValue={searchValue}
              suggestions={tagSuggestions}
            />
            <ButtonWrapper margin="0 0 0 5px">
              <ClearButton onClick={handleClear}>Clear</ClearButton>
            </ButtonWrapper>
          </Row>
          {favorites.length !== 0 && (
            <HorizontalScroll>
              {favorites.sort(sortOnFavorite).map((p: any) => (
                <Point key={p.title} onClick={() => handleSearch(p.id, true)}>
                  <Title>{p.title}</Title>
                </Point>
              ))}
            </HorizontalScroll>
          )}
          {todos.length !== 0 && (
            <HorizontalScroll>
              {todos
                .filter((p: any) => p.count)
                .sort(sortOnCount)
                .map((p: any) => (
                  <Point key={p.title} onClick={() => handleSearch(p.id, true)}>
                    <Title>{p.title}</Title>
                    <Counter>{p.count}</Counter>
                  </Point>
                ))}
            </HorizontalScroll>
          )}
          {dailies.length !== 0 && (
            <HorizontalScroll>
              {dailies.map((p: any) => (
                <Point key={p.title} onClick={() => handleSearch(p.id, true)}>
                  <Title>{p.title}</Title>
                  <Counter gold>{p.count}</Counter>
                </Point>
              ))}
            </HorizontalScroll>
          )}
          {deadlines.length !== 0 && (
            <HorizontalScroll>
              {deadlines
                .filter((p: any) => p.date)
                .sort(sortOnDate)
                .map((p: any) => (
                  <Point key={p.title} onClick={() => handleSearch(p.id, true)}>
                    <Title>{p.title}</Title>
                    <Deadline status={p.status.color}>
                      {p.date}
                      {p.status.label !== "later" && `, ${p.status.label}`}
                    </Deadline>
                  </Point>
                ))}
            </HorizontalScroll>
          )}
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
