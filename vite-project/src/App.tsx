import { useState, useCallback } from 'react';
import Chessboard from "./chessboard/chessboard"

const BOARD_SIZE = 8;
const MOVES = [
  [2, 1], [1, 2], [-1, 2], [-2, 1],
  [-2, -1], [-1, -2], [1, -2], [2, -1]
];

// Add this helper function for the minimal delay
const microDelay = () => new Promise(resolve => setTimeout(resolve, 0));

function App() {
  const [knights, setKnights] = useState<string[]>([]);
  const [solving, setSolving] = useState(false);
  const [totalMoves, setTotalMoves] = useState(0);

  const posToSquare = (x: number, y: number) => `${String.fromCharCode(97 + x)}${y + 1}`;
  const squareToPos = (square: string) => [square.charCodeAt(0) - 97, parseInt(square[1]) - 1];

  const solve = useCallback(async () => {
    const board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(0));
    const [startX, startY] = squareToPos(knights[0]);
    board[startY][startX] = 1;
    let moves = 0;

    const isValid = (x: number, y: number) => x >= 0 && y >= 0 && x < BOARD_SIZE && y < BOARD_SIZE && board[y][x] === 0;

    const solveKnightTour = async (x: number, y: number, moveCount: number): Promise<boolean> => {
      if (moveCount === BOARD_SIZE * BOARD_SIZE) return true;

      for (const [dx, dy] of MOVES) {
        const nextX = x + dx;
        const nextY = y + dy;

        if (isValid(nextX, nextY)) {
          board[nextY][nextX] = moveCount + 1;
          setKnights(prev => [...prev, posToSquare(nextX, nextY)]);
          moves++;
          setTotalMoves(moves);

          if (await solveKnightTour(nextX, nextY, moveCount + 1)) {
            return true;
          }

          board[nextY][nextX] = 0;
          setKnights(prev => prev.slice(0, -1));
          moves++;
          setTotalMoves(moves);

          await microDelay();
        }
      }

      return false;
    };

    setSolving(true);
    setTotalMoves(0);
    const success = await solveKnightTour(startX, startY, 1);
    setSolving(false);

    if (!success) {
      alert("No solution found!");
    }
  }, [knights]);

  const handlePlaceKnight = (square: string) => {
    setKnights([square]);
    setTotalMoves(0);
  };

  const handleResetBoard = () => {
    setKnights([]);
    setSolving(false);
    setTotalMoves(0);
  };

  return (
    <div>
      <Chessboard 
        knights={knights}
        onPlaceKnight={handlePlaceKnight}
        onResetBoard={handleResetBoard}
        onSolve={solve}
        solving={solving}
        totalMoves={totalMoves}
      />
    </div>
  );
}

export default App;
