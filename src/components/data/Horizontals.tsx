import { useEffect, useState } from "react";
import styled from "styled-components";
import { Counter } from "../simpleComponents";
import { DataProps } from "./Data";

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

const RED = "#cc1100";
const GOLD = "#cc9900";
const ORANGE = "#dd8800";
const GREY = "#444444";

const getFavorites = (dataPoints: DataProps[]) => {
  const favorites = dataPoints
    .filter((dp) => dp.favorite)
    .map((dp) => ({
      id: dp.id,
      title: dp.title,
      favorite: parseInt(dp.favorite || "99"),
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

const sortOnDate = (a: any, b: any) =>
  new Date(a.date).getTime() - new Date(b.date).getTime();
const sortOnCount = (a: any, b: any) => parseInt(a.count) - parseInt(b.count);
const sortOnFavorite = (a: DataProps, b: DataProps) =>
  parseInt(a.favorite || "99") - parseInt(b.favorite || "99");

interface Props {
  dataPoints?: any;
  handleSearch?: any;
}

const Horizontals = ({ dataPoints, handleSearch }: Props) => {
  const [todos, setTodos] = useState<any>([]);
  const [dailies, setDailies] = useState<any>([]);
  const [deadlines, setDeadlines] = useState<any>([]);
  const [favorites, setFavorites] = useState<any>([]);

  useEffect(() => {
    setTodos(getTodos(dataPoints));
    setDailies(getDailies(dataPoints));
    setDeadlines(getDeadlines(dataPoints));
    setFavorites(getFavorites(dataPoints));
  }, [dataPoints]);

  return (
    <>
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
    </>
  );
};

export default Horizontals;
