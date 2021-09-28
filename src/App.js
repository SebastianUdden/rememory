import { useEffect, useState } from "react";
import styled from "styled-components";
import "./App.css";
import Data from "./components/data/Data";
import ImportExport from "./components/importExport/ImportExport";
import DataLoader from "./components/loader/DataLoader";
import { arrowBack } from "./svgs/arrow-back";
import { settingsApplication } from "./svgs/settings-application";
import SVG from "./svgs/SVG";

const Wrapper = styled.div`
  padding: 20px;
  width: 90vw;
  max-width: 500px;
  overflow-x: none;
`;
const Title = styled.h1`
  font-size: 50px;
  margin: 0 0 25px;
`;
const Strong = styled.strong`
  opacity: 0.3;
`;
const SettingsButton = styled.button`
  position: absolute;
  right: 5px;
  top: 5px;
  cursor: pointer;
  background-color: inherit;
  border: none;
  color: white;
  :hover {
    opacity: 0.7;
  }
`;
const ShowData = styled.div`
  ${(p) =>
    p.showSettings &&
    `
    overflow: hidden;
    height: 0;
  `}
`;

const getDuration = () => {
  const loaderEnd = new Date(localStorage.getItem("loader-end"));
  const loaderStart = new Date(localStorage.getItem("loader-start"));
  const duration = loaderEnd - loaderStart;
  return duration > 0 ? duration : 0;
};

function App() {
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [data] = useState(
    JSON.parse(localStorage.getItem("rememory-data-points"))
  );

  useEffect(() => {
    setLoading(true);
    const start = new Date();
    setTimeout(() => {
      localStorage.setItem("loader-start", start);
      localStorage.setItem("loader-end", new Date());
      setLoading(false);
    }, 2000);
  }, [data]);
  const duration = getDuration();

  return (
    <div className="App">
      <header className="App-header">
        <Wrapper>
          <SettingsButton onClick={() => setShowSettings(!showSettings)}>
            {showSettings ? (
              <SVG {...arrowBack} />
            ) : (
              <SVG {...settingsApplication} />
            )}
          </SettingsButton>
          <Title>
            <Strong>Re</Strong>Memory
          </Title>
          {showSettings && <ImportExport />}
          {loading && <DataLoader showDetails duration={duration} />}
          {!loading && (
            <ShowData showSettings={showSettings}>
              <Data data={data} />
            </ShowData>
          )}
        </Wrapper>
      </header>
    </div>
  );
}

export default App;
