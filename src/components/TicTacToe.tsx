import { useEffect, useRef, useState } from "react"
import {
  computerMove,
  emptyMoves,
  getWinner,
  nextMark,
  play,
  toBoard,
  vanishingCell,
  type Moves,
} from "../lib/games/ticTacToe"

const COMPUTER_DELAY_MS = 350

type Scores = { you: number; me: number }

function scoreMoves(moves: Moves, scores: Scores): Scores {
  const win = getWinner(toBoard(moves))
  if (!win) return scores
  return win.mark === "x" ? { ...scores, you: scores.you + 1 } : { ...scores, me: scores.me + 1 }
}

function TicTacToe() {
  const [moves, setMoves] = useState<Moves>(emptyMoves)
  const [scores, setScores] = useState<Scores>({ you: 0, me: 0 })
  const playAgainRef = useRef<HTMLButtonElement>(null)

  const board = toBoard(moves)
  const win = getWinner(board)
  const over = win !== null
  const computerTurn = !over && nextMark(moves) === "o"
  const fading = over ? null : vanishingCell(moves, nextMark(moves))

  useEffect(() => {
    if (!computerTurn) return
    const timer = window.setTimeout(() => {
      const next = play(moves, computerMove(moves, "o"), "o")
      setMoves(next)
      setScores((s) => scoreMoves(next, s))
    }, COMPUTER_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [moves, computerTurn])

  useEffect(() => {
    if (over) playAgainRef.current?.focus()
  }, [over])

  function choose(index: number) {
    if (over || computerTurn || board[index] !== null) return
    const next = play(moves, index, "x")
    setMoves(next)
    setScores((s) => scoreMoves(next, s))
  }

  const result = win?.mark === "x" ? "you win." : "i win."
  const status = computerTurn ? "thinking..." : "your move. you are x."

  return (
    <div className="font-mono text-xs md:flex md:h-full md:flex-col">
      <p aria-live="polite" className="mb-3 text-black/70">{over ? result : status}</p>

      {/* On desktop the board is a square that fills the free space of this size container. */}
      <div className="md:min-h-0 md:flex-1 md:[container-type:size]">
      <div className="relative grid w-fit grid-cols-3 grid-rows-3 border border-black/15 md:size-[min(100cqw,100cqh)]">
        {board.map((cell, i) => {
          const inWin = win?.line.includes(i) ?? false
          return (
            <button
              key={i}
              type="button"
              onClick={() => choose(i)}
              disabled={over || computerTurn || cell !== null}
              aria-label={`row ${Math.floor(i / 3) + 1}, column ${(i % 3) + 1}, ${cell ?? "empty"}${fading === i ? ", disappears next" : ""}`}
              className={`flex h-14 w-14 items-center justify-center border border-black/10 text-xl transition-colors enabled:hover:bg-black/[0.03] focus-visible:outline focus-visible:outline-green-700 md:h-auto md:w-auto md:text-[min(10cqw,10cqh)] ${inWin ? "bg-green-700/10" : ""} ${cell === "o" ? "text-green-700" : ""} ${fading === i ? "opacity-35" : ""}`}
            >
              {cell}
            </button>
          )
        })}

        {over && (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[#fdf0da]/85 backdrop-blur-[1px]"
            style={{ animation: "overlayFadeIn 180ms ease-out both" }}
          >
            <p className="font-display text-lg md:text-[min(7cqw,7cqh)]">{result}</p>
            <button
              ref={playAgainRef}
              type="button"
              onClick={() => setMoves(emptyMoves())}
              className="link-underline font-display text-base hover:text-green-700 md:text-[min(4cqw,4cqh)]"
            >
              play again <span className="font-mono">↗</span>
            </button>
          </div>
        )}
      </div>
      </div>

      <p className="mt-4 text-black/55">
        you {scores.you} · me {scores.me}
      </p>
      <p className="mt-1 text-xs text-black/45">
        no draws: you keep 3 marks. the faded one goes next.
      </p>
    </div>
  )
}

export default TicTacToe
