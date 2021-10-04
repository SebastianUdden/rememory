import React, { useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
`;
const Input = styled.input`
  background-color: inherit;
  color: inherit;
  border: 1px solid #777;
  border-radius: 6px;
  width: 100%;
  height: 100%;
  padding: 0 15px;
  font-size: 16px;
  box-sizing: border-box;
`;

interface Props {
  searchRef?: any;
  searchValue?: any;
  onChange?: any;
  suggestions?: any;
}

const Search = ({ searchRef, searchValue, onChange, suggestions }: Props) => {
  const handleChange = (e: any) => onChange(e.target.value);

  useEffect(() => {
    const keydown = (e: any) => {
      if (e.keyCode === 13) {
        searchRef.current.blur();
      }
    };
    searchRef.current.addEventListener("keydown", keydown);
  }, [searchRef]);

  useEffect(() => {
    if (searchValue) return;
    searchRef.current.focus();
  }, [searchRef, searchValue]);

  return (
    <Wrapper>
      <Input
        ref={searchRef}
        list="suggestions"
        placeholder="Search"
        onChange={handleChange}
        value={searchValue}
      />
      <datalist id="suggestions">
        {suggestions.map(({ title }: any) => (
          <option key={title} value={title} />
        ))}
      </datalist>
    </Wrapper>
  );
};

export default Search;
