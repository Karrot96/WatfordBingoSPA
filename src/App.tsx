import React, { useEffect, useState, CSSProperties } from 'react';
import './App.css';
import axios from 'axios';

interface BingoCell {
  value: string;
  id: string;
  clicked: boolean
}

const App: React.FC = () => {
  const [bingoCells, setBingoCells] = useState<BingoCell[][]>([]);
  const primaryColor = "#fdb913";
  const secondaryColor = "#0c1c3b";

  useEffect(() => {
    const guid = getGuidFromCookie() || generateGuid();
    setGuidCookie(guid);

    axios.post('https://watfordbingobackend-hvt4gf6dfa-nw.a.run.app/generate', {
      "guid": guid
    })
    .then((response) => {
      setBingoCells(response.data.map((bingoRow: string[], rowIndex: number) => (
        bingoRow.map((value, cellIndex) => ({
          id: `${rowIndex}-${cellIndex}`,
          value: value,
          clicked: false
        }))
      )));
      console.log(bingoCells)
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  useEffect(() => {
    console.log(bingoCells);
  }, [bingoCells]);

  const generateGuid = () => {
    const guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });

    return guid;
  }

  const setGuidCookie = (guid: string) => {
    document.cookie = `bingoGuid=${guid}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
  }

  const getGuidFromCookie = () => {
    const name = 'bingoGuid=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for(let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
        cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return '';
  }

  const handleCellClick = (rowIndex: number, cellIndex: number) => {
  setBingoCells(prevBingoCells => {
    const newBingoCells = [...prevBingoCells];
    newBingoCells[rowIndex] = [...prevBingoCells[rowIndex]];
    const cell = newBingoCells[rowIndex][cellIndex];
    newBingoCells[rowIndex][cellIndex] = {
      ...cell,
      clicked: !cell.clicked
    };
    return newBingoCells;
  });
};

  const renderBingoCells = () => {
    const cellSize = Math.min(window.innerWidth, window.innerHeight) / 6;
    const gridStyle = {
      width: cellSize * 5 + "px",
      height: cellSize * 5 + "px",
    };
    const cellStyle: CSSProperties = {
      width: cellSize + "px",
      height: cellSize + "px",
      lineHeight: cellSize + "px",
      color: primaryColor,
      backgroundColor: secondaryColor,
      textAlign: "center",
      fontWeight: "bold",
      cursor: "pointer" 
    };
    const clickedCellStyle = {
      ...cellStyle,
      backgroundColor: "#d42426",
      color: "#ffffff",
      textDecoration: "line-through"
    };
    return (
      <div className="bingo-grid" style={gridStyle}>
        {bingoCells.map((bingoRow, rowIndex) => (
          <div className="bingo-row" key={`bingo-row-${rowIndex}`}>
            {bingoRow.map((bingoCell, cellIndex) => (
              <div
                className="bingo-cell"
                style={bingoCell.clicked ? clickedCellStyle : cellStyle} // modify this line
                key={bingoCell.id}
                onClick={() => handleCellClick(rowIndex, cellIndex)} // add this line
              >
                {bingoCell.value}
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Watford Bingo</h1>
      </header>
      <div className="bingo-grid">
        {renderBingoCells()}
      </div>
    </div>
  );
}

export default App;
