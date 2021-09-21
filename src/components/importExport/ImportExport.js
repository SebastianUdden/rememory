import { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  ul {
    text-align: left;
  }
`;
const Button = styled.button`
  background-color: black;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 20px;
  :hover {
    cursor: pointer;
    background-color: white;
    color: black;
  }
  ${(p) =>
    p.disabled &&
    `
    :hover {
      cursor: default;
      background-color: black;
      color: white;
    }
  `}
`;
const Strong = styled.strong`
  color: #dd0000;
`;

// const createFile = (data, filename, type) => {
//   const file = new Blob([data], { type: type });
//   if (window.navigator.msSaveOrOpenBlob)
//     // IE10+
//     window.navigator.msSaveOrOpenBlob(file, filename);
//   else {
//     // Others
//     var a = document.createElement("a"),
//       url = URL.createObjectURL(file);
//     a.href = url;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     setTimeout(function () {
//       document.body.removeChild(a);
//       window.URL.revokeObjectURL(url);
//     }, 0);
//   }
// };

const createFile2 = (data, filename, type) => {
  const file = new Blob([data], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, filename);
  else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;
    a.style.color = "white";
    document.getElementById("export").style.marginTop = "15px";
    var text = document.createTextNode("rememory-backup.json");
    a.appendChild(text);
    document.getElementById("export").appendChild(a);
  }
};

const addZero = (value) => {
  const number = Number.parseInt(value);
  if (number < 10) {
    return `0${number}`;
  }
  return number;
};

const exportData = () => {
  const dataPointsString = localStorage.getItem("rememory-data-points");
  const dataPoints = JSON.parse(dataPointsString);
  const dataPointsWithBackupCheck = dataPoints.data.map((item) => ({
    ...item,
    hasBackup: true,
  }));
  const result = JSON.stringify({
    ...dataPoints,
    data: dataPointsWithBackupCheck,
  });
  localStorage.setItem("rememory-data-points", result);
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = addZero(now.getUTCMonth());
  const date = addZero(now.getUTCDate());
  const hours = addZero(now.getUTCHours());
  const minutes = addZero(now.getUTCMinutes());

  createFile2(
    JSON.stringify(result),
    `rememory-backup-${year}-${month}-${date}_${hours}-${minutes}.json`,
    "application/json"
  );
};

// const exportData = () => {
//   const dataPointsString = localStorage.getItem("rememory-data-points");
//   const dataPoints = JSON.parse(dataPointsString);
//   const dataPointsWithBackupCheck = dataPoints.map((item) => ({
//     ...item,
//     hasBackup: true,
//   }));
//   const result = JSON.stringify(dataPointsWithBackupCheck);
//   localStorage.setItem("rememory-data-points", result);
//   const now = new Date();
//   const year = now.getUTCFullYear();
//   const month = addZero(now.getUTCMonth());
//   const date = addZero(now.getUTCDate());
//   const hours = addZero(now.getUTCHours());
//   const minutes = addZero(now.getUTCMinutes());

//   createFile2(
//     JSON.stringify(result),
//     `rememory-backup-${year}-${month}-${date}_${hours}-${minutes}.json`,
//     "application/json"
//   );
//   // window.location.reload();
// };

const parseBlob = (blob) => {
  const data = JSON.parse(blob) || localStorage.getItem("rememory-data-points");
  localStorage.setItem("rememory-data-points", data);
  window.location.reload();
};

const ImportExport = () => {
  const [showImport, setShowImport] = useState(false);

  const onFileUpload = (e) => {
    const blob = e.target.files[0];
    if (blob) {
      blob.text().then(parseBlob);
    }
  };

  return (
    <Wrapper>
      <strong>Import/Export data</strong>
      <p>
        The rememory application is only storing data on your local device in
        order to keep your data safe. If you do wish to use your data on
        multiple devices you need to export the data from the device you're
        using then import the data on the device you wish to use.
      </p>
      <p>
        Exporting data is also a good practice for keeping backups in case the
        localstorage gets corrupted, you lose your device or it gets stolen etc.
      </p>
      <Button onClick={() => exportData()}>Export data</Button>
      <div id="export" />
      <ul>
        <li>Creates a backup file containing all the rememory data</li>
        <li>Send this file to your other device, then...</li>
      </ul>
      <Button onClick={() => setShowImport(true)} disabled={showImport}>
        Import data
      </Button>
      <ul>
        {showImport && (
          <>
            <li>
              <Strong>DANGER!</Strong> When choosing a file, the old data is
              removed and replaced, <Strong>this can't be undone!</Strong>
            </li>
            <li>
              <input type="file" id="input" onChange={onFileUpload}></input>
            </li>
          </>
        )}
        <li>Upload a file containing all the rememory data</li>
        <li>
          Note that this will <strong>remove any existing data</strong> from
          this device!
        </li>
      </ul>
    </Wrapper>
  );
};

export default ImportExport;
