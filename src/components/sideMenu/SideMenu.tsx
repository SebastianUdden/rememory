import React, { useEffect } from "react";
import styled from "styled-components";
import SVG from "../../svgs/SVG";
import { close } from "../../svgs/close";

const Menu = styled.ul<{ menuIsOpen: boolean }>`
  box-sizing: border-box;
  position: absolute;
  top: -15px;
  width: 100%;
  height: 100vh;
  background-color: #111;
  color: white;
  z-index: 99;
  transition: left 550ms ease;
  padding: 0px 40px 30px 72px;
  overflow: scroll;
  left: ${(p) => (p.menuIsOpen ? "0" : "-200%")};
`;

const Item = styled.li<{ lvl: number }>`
  position: relative;
  list-style-type: none;
  margin: 0;
  padding: 0;
  margin-left: -32px;
  font-size: 20px;
  border-left: ${(p) => `${p.lvl}px solid #555`};
  :last-child {
    border-left: none;
  }
  :last-child > button {
    border-left: ${(p) => `${p.lvl}px solid #555`};
  }
  :last-child:after {
    content: "";
    height: 100%;
    width: ${(p) => `${p.lvl - 0.5}px`};
    left: 0;
    height: 5px;

    position: absolute;
    top: 0; // If you want to set a smaller height and center it, change this value

    background-color: #555;
  }
`;

const Button = styled.button<{ lvl: number }>`
  background-color: inherit;
  color: inherit;
  border: none;
  cursor: pointer;
  font-size: 16px;
  text-align: left;
  border-bottom: ${(p) => `${p.lvl}px solid #555`};

  :hover {
    color: orange;
  }
`;

const Close = styled.button`
  display: flex;
  background-color: inherit;
  border: 1px solid #fff;
  color: #fff;
  border-radius: 6px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  padding: 5px;
  :hover {
    background-color: #fff;
    border: 1px solid inherit;
    color: black;
    svg {
      fill: black;
    }
  }
`;
const Title = styled.h2`
  font-size: 30px;
  margin-top: 15px;
  margin-left: -35px;
  margin-bottom: 20px;
`;

const byTitle = (a: any, b: any) => {
  if (a.title > b.title) return 1;
  if (a.title < b.title) return -1;
  return 0;
};

const getMetaData = (
  lvl: any,
  metaDataId: any,
  onSelectMenu: any,
  data: any
) => {
  const level = lvl > 1 ? lvl - 0.5 : 1;
  const metaData = data?.find((d: any) => d.id === metaDataId);
  const handleSelect = (e: any) => {
    onSelectMenu(metaData.title);
  };
  const children = metaData?.children?.sort(byTitle);
  if (!metaData) return null;
  return (
    <Item lvl={lvl}>
      <Button onClick={handleSelect} lvl={lvl}>
        {metaData.title}
      </Button>
      {children && (
        <ul>
          {children.map(({ id }: any) =>
            getMetaData(level, id, onSelectMenu, data)
          )}
        </ul>
      )}
    </Item>
  );
};

interface Props {
  showMenu?: any;
  handleHideMenu?: any;
  data?: any;
  onSelectMenu?: any;
}

const SideMenu = ({ showMenu, handleHideMenu, data, onSelectMenu }: Props) => {
  useEffect(() => {
    if (!showMenu) {
      document.body.style.height = "auto";
      document.body.style.overflow = "auto";
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    document.body.style.margin = "0";
    document.body.style.height = "100%";
    document.body.style.overflow = "hidden";
  }, [showMenu]);

  return (
    <Menu menuIsOpen={showMenu}>
      <Title>ReMemory</Title>
      <Close onClick={handleHideMenu}>
        <SVG {...close} />
      </Close>
      {data
        ?.find((d: any) => d.id === "0")
        ?.children?.map(({ id }: any) =>
          getMetaData(5, id, onSelectMenu, data)
        )}
    </Menu>
  );
};

export default SideMenu;
