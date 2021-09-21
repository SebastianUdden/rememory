import styled from "styled-components";

export const uuidv4 = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    let r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const Strong = styled.span`
  color: orange;
`;

export const getMatching = (value, searchValue) => {
  if (searchValue.length < 2) return value;
  if (value.toLowerCase() === searchValue) return <Strong>{value}</Strong>;
  const regexSearch = new RegExp(searchValue, "gi");

  const valueParts = value.split(regexSearch);
  if (valueParts.length === 1) {
    return value;
  }
  return (
    <span>
      {valueParts.map((vp, i) => (
        <span>
          <span>{vp}</span>
          {i !== valueParts.length - 1 && <Strong>{searchValue}</Strong>}
        </span>
      ))}
    </span>
  );
};
