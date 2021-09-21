import React, { useEffect } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
`;
const Input = styled.input`
  background-color: inherit;
  color: inherit;
  padding: 15px;
  border: 1px solid white;
  border-radius: 6px;
  width: 100%;
  font-size: 16px;
  box-sizing: border-box;
`;

const Search = ({ searchRef, searchValue, onChange, suggestions }) => {
  const handleChange = (e) => onChange(e.target.value);

  useEffect(() => {
    const keydown = (e) => {
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
        {suggestions.map(({ title }) => (
          <option key={title} value={title} />
        ))}
      </datalist>
    </Wrapper>
  );
};

export default Search;
