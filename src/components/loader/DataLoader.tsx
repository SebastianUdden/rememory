import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loader from "./Loader";

const Wrapper = styled.div``;

const getFormatedDuration = (duration: any) => {
  const totalSeconds = duration / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return `${minutes ? `${minutes} minutes ` : ""}${
    seconds ? `${seconds} seconds` : ""
  }`;
};

const calculateIncrement = (duration: any) => duration / 100;

interface Props {
  duration: any;
  showDetails: any;
}

const DataLoader = ({ duration, showDetails }: Props) => {
  const [percentage, setPercentage] = useState(0);
  const [increment, setIncrement] = useState(0);
  const [formatedDuration, setFormatedDuration] = useState<any>(undefined);

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
