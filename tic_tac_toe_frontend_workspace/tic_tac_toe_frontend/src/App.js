import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * A square in the Tic Tac Toe board.
 * @param {object} props - Component props: value, onClick, highlight
 */
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? ' ttt-square-highlight' : ''}`}
      onClick={onClick}
      aria-label={value ? `Current player mark: ${value}` : 'Empty square'}
    >
      {value}
    </button>
  );
}

// Returns array of winning line or null
function calculateWinner(squares) {
  const lines = [
    [0,1,2], [3,4,5], [6,7,8],
    [0,3,6], [1,4,7], [2,5,8],
    [0,4,8], [2,4,6]
  ];
  for (let i=0; i<lines.length; i++) {
    const [a,b,c] = lines[i];
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], line: lines[i] };
    }
  }
  return null;
}

/**
 * The Board component renders the 3x3 grid.
 * @param {object} props - squares: board state, onSquareClick, winningLine
 */
function Board({ squares, onSquareClick, winningLine }) {
  function renderSquare(i) {
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        highlight={winningLine ? winningLine.includes(i) : false}
      />
    );
  }
  // 3 rows of 3 squares
  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
      {[0,1,2].map(row =>
        <div className="ttt-board-row" key={row} role="row">
          {[0,1,2].map(col =>
            renderSquare(row*3+col)
          )}
        </div>
      )}
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  // Move history is array of board states
  const [history, setHistory] = useState([
    Array(9).fill(null)
  ]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  // Compute state for current step
  const currentSquares = history[stepNumber];
  const winnerObj = calculateWinner(currentSquares);
  const isDraw = !winnerObj && currentSquares.every(Boolean);

  // PUBLIC_INTERFACE
  function handleSquareClick(i) {
    const squares = currentSquares.slice();
    if (squares[i] || winnerObj) return; // No move if occupied or game over
    squares[i] = xIsNext ? 'X' : 'O';
    const newHistory = history.slice(0, stepNumber + 1).concat([squares]);
    setHistory(newHistory);
    setStepNumber(newHistory.length - 1);
    setXIsNext(!xIsNext);
  }

  // PUBLIC_INTERFACE
  function jumpTo(step) {
    setStepNumber(step);
    setXIsNext(step % 2 === 0);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setHistory([Array(9).fill(null)]);
    setStepNumber(0);
    setXIsNext(true);
  }

  // Minimal, centered header
  return (
    <div className="App" style={{ minHeight: '100vh', background: 'var(--bg-primary)', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column' }}>
      <h1 className="ttt-header" style={{ marginTop: '2rem', marginBottom: '2.5rem' }}>Tic Tac Toe</h1>
      <div className="ttt-flex-container">
        <Board
          squares={currentSquares}
          onSquareClick={handleSquareClick}
          winningLine={winnerObj ? winnerObj.line : null}
        />
        <div className="ttt-move-list-container">
          <div className="ttt-status" aria-live="polite" style={{ marginBottom: '1.2rem' }}>
            {winnerObj
              ? <>Winner: <span className="ttt-winner">{winnerObj.winner}</span></>
              : isDraw
                ? 'Draw!'
                : <>Next: <span style={{color:'var(--primary)'}}>{xIsNext?'X':'O'}</span></>}
          </div>
          <ol className="ttt-move-list">
            {history.map((squares, move) => {
              const desc = move ?
                `Go to move #${move}` :
                'Go to start';
              return (
                <li key={move}>
                  <button
                    className={`ttt-move-btn${move===stepNumber ? ' ttt-move-btn-current' : ''}`}
                    onClick={() => jumpTo(move)}
                    disabled={move===stepNumber}
                  >
                    {desc}
                  </button>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      <button className="ttt-reset-btn" onClick={handleReset}>
        Reset Game
      </button>
    </div>
  );
}

export default App;
