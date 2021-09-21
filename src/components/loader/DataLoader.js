import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loader from "./Loader";

const Wrapper = styled.div``;

const getFormatedDuration = (duration) => {
  const totalSeconds = duration / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return `${minutes ? `${minutes} minutes ` : ""}${
    seconds ? `${seconds} seconds` : ""
  }`;
};

const calculateIncrement = (duration) => duration / 100;

const DataLoader = ({ duration, showDetails }) => {
  const [percentage, setPercentage] = useState(0);
  const [increment, setIncrement] = useState(0);
  const [formatedDuration, setFormatedDuration] = useState(undefined);

  useEffect(() => {
    setFormatedDuration(getFormatedDuration(duration));
    setIncrement(calculateIncrement(duration - 350));
  }, [duration]);

  useEffect(() => {
    setTimeout(() => {
      setPercentage(percentage + 1);
    }, increment);
  }, [percentage, increment]);

  return (
    <Wrapper>
      <Loader
        showDetails={showDetails}
        percentage={percentage}
        increment={increment}
        formatedDuration={formatedDuration}
      />
    </Wrapper>
  );
};

export default DataLoader;
