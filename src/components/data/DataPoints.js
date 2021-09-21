import React from "react";
import styled from "styled-components";
import DataPoint from "./DataPoint";

const Wrapper = styled.div``;

const DataPoints = ({
  dataPoints,
  searchValue,
  onSelectTag,
  onEdit,
  showAll,
  editData,
}) => (
  <Wrapper>
    {dataPoints?.map((dataPoint) => (
      <DataPoint
        key={dataPoint.id}
        {...dataPoint}
        searchValue={searchValue}
        onSelectTag={onSelectTag}
        onEdit={onEdit}
        showAll={showAll}
        editData={editData}
      />
    ))}
  </Wrapper>
);

export default DataPoints;
