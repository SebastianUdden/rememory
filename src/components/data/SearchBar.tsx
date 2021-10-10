import { useRef, useState } from "react";
import styled from "styled-components";
import { verticalSplit } from "../../svgs/vertical-split";
import { add } from "../../svgs/add";
import Search from "../search/Search";
import { Button } from "../button/Button";
import SVG from "../../svgs/SVG";
import BigButton from "../button/BigButton";
import SideMenu from "../sideMenu/SideMenu";

const Row = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 15px;
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

interface Props {
  searchValue?: string;
  handleSearch: (value: any, isSimpleSearch: any) => void;
  onClear: () => void;
  onShowAdd: () => void;
  addStatus?: any;
  metaDataPoints?: any;
  tagSuggestions?: any;
}

const SearchBar = ({
  searchValue,
  handleSearch,
  onClear,
  onShowAdd,
  addStatus,
  metaDataPoints,
  tagSuggestions,
}: Props) => {
  const searchRef = useRef<any>(null);
  const [showMenu, setShowMenu] = useState(false);

  const handleClear = () => {
    onClear();
    if (searchRef?.current) {
      searchRef.current.focus();
    }
  };
  const root = metaDataPoints.find((md: any) => md.id === "0") || {
    children: [],
  };

  return (
    <>
      <SideMenu
        showMenu={showMenu}
        handleHideMenu={() => setShowMenu(false)}
        data={metaDataPoints}
        onSelectMenu={(value: any) => {
          handleSearch(value, true);
          setShowMenu(false);
        }}
      />
      <Row>
        {root?.children?.length !== 0 && (
          <ButtonWrapper status={addStatus} margin="0 4px 0 0">
            <BigButton onClick={() => setShowMenu(true)}>
              <SVG {...verticalSplit} />
            </BigButton>
          </ButtonWrapper>
        )}
        <ButtonWrapper status={addStatus} margin="0 5px 0 0">
          <BigButton onClick={onShowAdd}>
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
    </>
  );
};

export default SearchBar;
