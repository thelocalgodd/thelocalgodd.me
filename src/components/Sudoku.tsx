import { useRef, useState, type KeyboardEvent } from "react"
import { conflicts, createSudoku, peersOf, setCell, type SudokuState } from "../lib/games/sudoku"
import GameOverlay from "./GameOverlay"

const MOVES: Record<string, [number, number]> = {
  ArrowUp: [-1, 0], w: [-1, 0], W: [-1, 0],
  ArrowDown: [1, 0], s: [1, 0], S: [1, 0],
  ArrowLeft: [0, -1], a: [0, -1], A: [0, -1],
  ArrowRight: [0, 1], d: [0, 1], D: [0, 1],
}

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

function formatTime(ms: number) {
  const seconds = Math.floor(ms / 1000)
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`
}

function Sudoku() {
  const [game, setGame] = useState<SudokuState>(() => createSudoku())
  const [selected, setSelected] = useState<number | null>(null)
  const [solvedIn, setSolvedIn] = useState<number | null>(null)
  const [solvedCount, setSolvedCount] = useState(0)
  const [startedAt, setStartedAt] = useState(() => Date.now())
  const cellRefs = useRef<(HTMLButtonElement | null)[]>([])

  const clashes = conflicts(game.cells)
  const peers = selected === null ? [] : peersOf(selected)
  const filled = game.cells.filter((n) => n !== 0).length

  function select(index: number) {
    setSelected(index)
    cellRefs.current[index]?.focus()
  }

  function enter(value: number) {
    if (selected === null) return
    const next = setCell(game, selected, value)
    setGame(next)
    if (next.status === "solved" && game.status !== "solved") {
      setSolvedIn(Date.now() - startedAt)
      setSolvedCount((c) => c + 1)
    }
  }

  function newPuzzle() {
    setGame(createSudoku())
    setSolvedIn(null)
    setStartedAt(Date.now())
    select(0)
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const step = MOVES[e.key]
    if (step) {
      e.preventDefault()
      if (selected === null) return select(0)
      const row = (Math.floor(selected / 9) + step[0] + 9) % 9
      const col = ((selected % 9) + step[1] + 9) % 9
      return select(row * 9 + col)
    }
    if (/^[1-9]$/.test(e.key)) {
      e.preventDefault()
      enter(Number(e.key))
    } else if (e.key === "0" || e.key === "Backspace" || e.key === "Delete") {
      e.preventDefault()
      enter(0)
    }
  }

  const status = game.status === "solved"
    ? "solved."
    : selected === null
      ? "pick a cell, then type 1 to 9 or use the pad."
      : "type 1 to 9. backspace clears. arrow keys or wasd move."

  return (
    <div className="font-mono text-xs md:flex md:h-full md:flex-col">
      <p aria-live="polite" className="mb-3 text-black/70">{status}</p>

      {/* On desktop the board is a square that fills the free space of this size container. */}
      <div className="md:min-h-0 md:flex-1 md:[container-type:size]">
      <div
        role="group"
        aria-label={`sudoku board, ${filled} of 81 filled`}
        onKeyDown={onKeyDown}
        className="relative grid aspect-square w-full max-w-[300px] grid-cols-3 grid-rows-3 border border-black/15 md:size-[min(100cqw,100cqh)] md:max-w-none"
      >
        {DIGITS.map((_, box) => (
          <div key={box} className="grid grid-cols-3 grid-rows-3 border border-black/15">
            {DIGITS.map((_, k) => {
              const index = (Math.floor(box / 3) * 3 + Math.floor(k / 3)) * 9 + (box % 3) * 3 + (k % 3)
              const value = game.cells[index]
              const given = game.givens[index]
              const clash = clashes[index] && !given
              const tint = index === selected
                ? "bg-green-700/15"
                : peers.includes(index) ? "bg-black/[0.03]" : ""
              const color = given ? "" : clash ? "text-red-700" : "text-green-700"
              return (
                <button
                  key={index}
                  ref={(el) => { cellRefs.current[index] = el }}
                  type="button"
                  // One cell is in the tab order. Arrow keys move between cells.
                  tabIndex={index === (selected ?? 0) ? 0 : -1}
                  onClick={() => select(index)}
                  aria-label={`row ${Math.floor(index / 9) + 1}, column ${(index % 9) + 1}, ${
                    value || "empty"
                  }${given ? ", given" : ""}${clash ? ", clashes" : ""}`}
                  aria-pressed={index === selected}
                  className={`flex items-center justify-center border border-black/10 text-base transition-colors hover:bg-black/[0.05] focus-visible:outline focus-visible:outline-green-700 md:text-[max(0.875rem,min(4.5cqw,4.5cqh))] ${tint} ${color} ${given ? "font-bold" : ""}`}
                >
                  {value !== 0 && (
                    <span key={value} className={given ? "" : "motion-safe:animate-[markIn_160ms_ease-out_both]"}>
                      {value}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        ))}

        {game.status === "solved" && (
          <GameOverlay
            result="solved."
            detail={solvedIn === null ? undefined : `in ${formatTime(solvedIn)}`}
            actions={[{ label: "new puzzle", onClick: newPuzzle }]}
          />
        )}
      </div>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-x-6 gap-y-3">
        <p className="text-black/55">
          filled {filled}/81 · solved {solvedCount}
        </p>
        <div className="grid grid-cols-5 gap-1">
          {DIGITS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => enter(n)}
              disabled={selected === null || game.givens[selected]}
              className="h-11 w-11 touch-manipulation border border-black/15 transition-colors enabled:hover:text-green-700 disabled:opacity-40 md:h-8 md:w-8"
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => enter(0)}
            disabled={selected === null || game.givens[selected]}
            aria-label="clear cell"
            className="h-11 w-11 touch-manipulation border border-black/15 transition-colors enabled:hover:text-green-700 disabled:opacity-40 md:h-8 md:w-8"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sudoku
