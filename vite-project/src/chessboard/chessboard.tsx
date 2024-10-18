import React from 'react';
import Knight from './knight';
import './chessboard.css';

interface SquareProps {
  file: string;
  rank: string;
  knights: string[];
  onPlaceKnight: (square: string) => void;
}

const Square = React.memo(({ file, rank, knights, onPlaceKnight }: SquareProps) => {
  const square = `${file}${rank}`;
  const isLight = (file.charCodeAt(0) + parseInt(rank)) % 2 === 0;
  const knightIndex = knights.indexOf(square);
  const hasKnight = knightIndex !== -1;

  const handleClick = () => {
    if (knights.length === 0) {
      onPlaceKnight(square);
    }
  };

  return (
    <div
      className={`square ${isLight ? 'light' : 'dark'}`}
      onClick={handleClick}
    >
      {hasKnight && (
        <div className="knight-container">
          <Knight />
          <span className="knight-number">{knightIndex + 1}</span>
        </div>
      )}
    </div>
  );
});

interface ArrowProps {
  from: string;
  to: string;
  files: string[];
  ranks: string[];
}

const Arrow = React.memo(({ from, to, files, ranks }: ArrowProps) => {
  const fromFile = files.indexOf(from[0]);
  const fromRank = ranks.indexOf(from[1]);
  const toFile = files.indexOf(to[0]);
  const toRank = ranks.indexOf(to[1]);

  const dx = toFile - fromFile;
  const dy = fromRank - toRank;
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  const length = Math.sqrt(dx * dx + dy * dy) * 12.5; // 12.5% of square size

  return (
    <div
      className="arrow"
      style={{
        left: `${fromFile * 12.5 + 6.25}%`,
        bottom: `${fromRank * 12.5 + 6.25}%`,
        width: `${length}%`,
        transform: `rotate(${angle}deg)`,
      }}
    />
  );
});

interface ChessboardProps {
  knights: string[];
  onPlaceKnight: (square: string) => void;
  onResetBoard: () => void;
  onSolve: () => void;
  solving: boolean;
  totalMoves: number;
}

const Chessboard: React.FC<ChessboardProps> = React.memo(({ 
  knights, 
  onPlaceKnight, 
  onResetBoard, 
  onSolve, 
  solving,
  totalMoves
}) => {
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const boardSize = 64; // 8x8 board
  const currentPositions = knights.length;
  const progressPercentage = (currentPositions / boardSize) * 100;

  return (
    <div className="chessboard-container">
      <div className="chessboard-wrapper">
        <div className="chessboard">
          {ranks.slice().reverse().map(rank => (
            <div key={rank} className="rank">
              {files.map(file => (
                <Square 
                  key={`${file}${rank}`} 
                  file={file} 
                  rank={rank} 
                  knights={knights} 
                  onPlaceKnight={onPlaceKnight} 
                />
              ))}
            </div>
          ))}
          {knights.slice(0, -1).map((from, index) => (
            <Arrow 
              key={`${from}-${knights[index + 1]}`} 
              from={from} 
              to={knights[index + 1]} 
              files={files} 
              ranks={ranks} 
            />
          ))}
        </div>
        <div className="move-count-bar">
          <div className="move-count-progress" style={{ height: `${progressPercentage}%` }}></div>
          <div className="move-count-label">
            <div>{currentPositions} / {boardSize}</div>
            <div>Total: {totalMoves}</div>
          </div>
        </div>
      </div>
      <div className="controls">
        <button className="control-button" onClick={onSolve} disabled={knights.length !== 1 || solving}>
          {solving ? 'Solving...' : 'Solve'}
        </button>
        <button className="control-button" onClick={onResetBoard}>Reset Board</button>
      </div>
    </div>
  );
});

export default Chessboard;
