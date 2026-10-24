import { useEffect, useState } from "react"
import GameOverlay from "./GameOverlay"
import {
  computerMove,
  emptyMoves,
  getWinner,
  isDraw,
  nextMark,
  play,
  toBoard,
  type Moves,
} from "../lib/games/ticTacToe"

const COMPUTER_DELAY_MS = 350

type Scores = { you: number; me: number; draws: number }

function scoreMoves(moves: Moves, scores: Scores): Scores {
  const board = toBoard(moves)
  const win = getWinner(board)
  if (win) return win.mark === "x" ? { ...scores, you: scores.you + 1 } : { ...scores, me: scores.me + 1 }
  return isDraw(board) ? { ...scores, draws: scores.draws + 1 } : scores
}

function TicTacToe() {
  const [moves, setMoves] = useState<Moves>(emptyMoves)
  const [scores, setScores] = useState<Scores>({ you: 0, me: 0, draws: 0 })

  const board = toBoard(moves)
  const win = getWinner(board)
  const over = win !== null || isDraw(board)
  const computerTurn = !over && nextMark(moves) === "o"

  useEffect(() => {
    if (!computerTurn) return
    const timer = window.setTimeout(() => {
      const next = play(moves, computerMove(moves, "o"), "o")
      setMoves(next)
      setScores((s) => scoreMoves(next, s))
    }, COMPUTER_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [moves, computerTurn])

  function choose(index: number) {
    if (over || computerTurn || board[index] !== null) return
    const next = play(moves, index, "x")
    setMoves(next)
    setScores((s) => scoreMoves(next, s))
  }

  const result = !win ? "draw." : win.mark === "x" ? "you win." : "i win."
  const status = computerTurn ? "thinking..." : "your move. you are x."

  return (
    <div className="font-mono text-xs md:flex md:h-full md:flex-col">
      <p aria-live="polite" className="mb-3 text-black/70">{over ? result : status}</p>

      {/* On desktop the board is a square that fills the free space of this size container. */}
      <div className="md:min-h-0 md:flex-1 md:[container-type:size]">
      <div className="relative grid w-fit grid-cols-3 grid-rows-3 border border-black/15 md:size-[min(100cqw,100cqh)]">
        {board.map((cell, i) => {
          const winStep = win?.line.indexOf(i) ?? -1
          return (
            <button
              key={i}
              type="button"
              onClick={() => choose(i)}
              disabled={over || computerTurn || cell !== null}
              aria-label={`row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}, ${cell ?? "empty"}`}
              className={`flex h-14 w-14 items-center justify-center border border-black/10 text-xl transition-colors enabled:hover:bg-black/[0.03] focus-visible:outline focus-visible:outline-green-700 md:h-auto md:w-auto md:text-[min(10cqw,10cqh)] ${winStep >= 0 ? "bg-green-700/10 motion-safe:animate-[winCell_400ms_ease-out_both]" : ""} ${cell === "o" ? "text-green-700" : ""}`}
              // The winning cells light up one after the other.
              style={winStep >= 0 ? { animationDelay: `${winStep * 120}ms` } : undefined}
            >
              {cell && <span className="motion-safe:animate-[markIn_160ms_ease-out_both]">{cell}</span>}
            </button>
          )
        })}

        {over && (
          <GameOverlay result={result} actions={[{ label: "play again", onClick: () => setMoves(emptyMoves()) }]} />
        )}
      </div>
      </div>

      <p className="mt-4 text-black/55">
        you {scores.you} · me {scores.me} · draws {scores.draws}
      </p>
    </div>
  )
}

export default TicTacToe
