import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  border: ${(p) => `1px solid ${p.color}`};
  padding: 3px;
  border-radius: 6px;
  width: 100%;
  color: ${(p) => p.color};
`;
const Bar = styled.div`
  background-color: ${(p) => p.color};
  border-radius: 3px;
  height: 40px;
  width: ${(p) => p.percentage}%;
  max-width: 100%;
  transition: ${(p) => `width ${p.increment}ms linear`};
`;
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 3px 2px;
`;
const Duration = styled.p`
  margin: 0;
`;
const Percentage = styled.span`
  display: inline-block;
  width: 30px;
  text-align: right;
`;

const Loader = ({
  color = "grey",
  percentage,
  increment,
  formatedDuration,
  showDetails,
}) => (
  <Wrapper color={color}>
    <Bar color={color} percentage={percentage} increment={increment} />
    {showDetails && (
      <Row>
        <Duration>Approx. {formatedDuration}</Duration>
        <Duration>
          <Percentage>{percentage < 100 ? percentage : 100}</Percentage> %
        </Duration>
      </Row>
    )}
  </Wrapper>
);

export default Loader;
