import { useEffect, useState } from "react"
import {
  computerMove,
  emptyBoard,
  getWinner,
  isFull,
  play,
  type Board,
} from "../lib/games/ticTacToe"

const COMPUTER_DELAY_MS = 350

type Scores = { you: number; me: number; draw: number }

function scoreBoard(board: Board, scores: Scores): Scores {
  const win = getWinner(board)
  if (win) return win.mark === "x" ? { ...scores, you: scores.you + 1 } : { ...scores, me: scores.me + 1 }
  if (isFull(board)) return { ...scores, draw: scores.draw + 1 }
  return scores
}

function TicTacToe() {
  const [board, setBoard] = useState<Board>(emptyBoard)
  const [scores, setScores] = useState<Scores>({ you: 0, me: 0, draw: 0 })

  const win = getWinner(board)
  const over = win !== null || isFull(board)
  const xCount = board.filter((cell) => cell === "x").length
  const oCount = board.filter((cell) => cell === "o").length
  const computerTurn = !over && xCount > oCount

  useEffect(() => {
    if (!computerTurn) return
    const timer = window.setTimeout(() => {
      const next = play(board, computerMove(board, "o"), "o")
      setBoard(next)
      setScores((s) => scoreBoard(next, s))
    }, COMPUTER_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [board, computerTurn])

  function choose(index: number) {
    if (over || computerTurn || board[index] !== null) return
    const next = play(board, index, "x")
    setBoard(next)
    setScores((s) => scoreBoard(next, s))
  }

  const status = win
    ? win.mark === "x" ? "you win." : "i win."
    : over
      ? "draw."
      : computerTurn ? "thinking..." : "your move. you are x."

  return (
    <div className="font-mono text-[12px]">
      <p aria-live="polite" className="mb-3 text-black/70">{status}</p>

      <div className="grid w-fit grid-cols-3 border border-black/15">
        {board.map((cell, i) => {
          const inWin = win?.line.includes(i) ?? false
          return (
            <button
              key={i}
              type="button"
              onClick={() => choose(i)}
              disabled={over || computerTurn || cell !== null}
              aria-label={`row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}, ${cell ?? "empty"}`}
              className={`flex h-14 w-14 items-center justify-center border border-black/10 text-xl transition-colors enabled:hover:bg-black/[0.03] focus-visible:outline focus-visible:outline-green-700 ${inWin ? "bg-green-700/10" : ""} ${cell === "o" ? "text-green-700" : ""}`}
            >
              {cell}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <p className="text-black/55">
          <span className="text-green-700">{"[ "}</span>
          you {scores.you} · me {scores.me} · draw {scores.draw}
          <span className="text-green-700">{" ]"}</span>
        </p>
        {over && (
          <button
            type="button"
            onClick={() => setBoard(emptyBoard())}
            className="font-display italic text-sm hover:text-green-700 transition-colors"
          >
            play again {"->"}
          </button>
        )}
      </div>
    </div>
  )
}

export default TicTacToe
