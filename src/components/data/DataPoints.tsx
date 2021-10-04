import React from "react";
import styled from "styled-components";
import DataPoint from "./DataPoint";

const Wrapper = styled.div``;

interface Props {
  dataPoints: any[];
  searchValue: string;
  onSelect: any;
  onEdit: any;
  showAll: boolean;
  editData: any;
}

const DataPoints = ({
  dataPoints,
  searchValue,
  onSelect,
  onEdit,
  showAll,
  editData,
}: Props) => (
  <Wrapper>
    {dataPoints?.map((dataPoint) => (
      <DataPoint
        key={dataPoint.id}
        {...dataPoint}
        searchValue={searchValue}
        onSelect={onSelect}
        onEdit={onEdit}
        showAll={showAll}
        editData={editData}
      />
    ))}
  </Wrapper>
);

export default DataPoints;
