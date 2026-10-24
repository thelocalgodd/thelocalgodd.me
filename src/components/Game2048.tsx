import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react"
import {
  createGame2048,
  keepPlaying,
  move,
  type Direction,
  type Game2048State,
} from "../lib/games/game2048"
import GameOverlay from "./GameOverlay"

const SIZE = 4
const SWIPE_PX = 24
// Keep in step with the 120ms slide and delays in the tile classes below.
const SLIDE_CLASS = "motion-safe:transition-transform motion-safe:duration-120 motion-safe:ease-out"

const KEYS: Record<string, Direction> = {
  ArrowUp: "up", w: "up", W: "up",
  ArrowDown: "down", s: "down", S: "down",
  ArrowLeft: "left", a: "left", A: "left",
  ArrowRight: "right", d: "right", D: "right",
}

const PAD: { direction: Direction; label: string; className: string }[] = [
  { direction: "up", label: "↑", className: "col-start-2" },
  { direction: "left", label: "←", className: "col-start-1 row-start-2" },
  { direction: "down", label: "↓", className: "col-start-2 row-start-2" },
  { direction: "right", label: "→", className: "col-start-3 row-start-2" },
]

const TILE_CLASS: Record<number, string> = {
  2: "bg-black/5",
  4: "bg-green-700/15",
  8: "bg-green-700/30",
  16: "bg-green-700/45",
  32: "bg-green-700/60",
  64: "bg-green-700/75",
  128: "bg-green-700 text-[#fdf0da]",
  256: "bg-green-800 text-[#fdf0da]",
  512: "bg-green-900 text-[#fdf0da]",
}
const BIG_TILE_CLASS = "bg-black text-[#fdf0da]"

// Each cell is one SIZE-th of the board, so a translate of 100% moves one cell.
function cellStyle(row: number, col: number) {
  return {
    width: `${100 / SIZE}%`,
    height: `${100 / SIZE}%`,
    transform: `translate(${col * 100}%, ${row * 100}%)`,
  }
}

function Game2048() {
  const [game, setGame] = useState<Game2048State>(() => createGame2048(SIZE))
  const [best, setBest] = useState(0)
  const boardRef = useRef<HTMLDivElement>(null)
  const swipeRef = useRef<{ x: number; y: number } | null>(null)

  function restart() {
    setBest((b) => Math.max(b, game.score))
    setGame(createGame2048(SIZE))
    boardRef.current?.focus()
  }

  function goOn() {
    setGame((g) => keepPlaying(g))
    boardRef.current?.focus()
  }

  function slide(direction: Direction) {
    setGame((g) => move(g, direction))
    boardRef.current?.focus()
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const direction = KEYS[e.key]
    if (direction) {
      e.preventDefault()
      setGame((g) => move(g, direction))
      return
    }
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      if (game.status === "over") restart()
      else if (game.status === "won") goOn()
    }
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse") return
    swipeRef.current = { x: e.clientX, y: e.clientY }
  }

  // One swipe is one move, so measure the whole gesture when the finger lifts.
  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    const start = swipeRef.current
    swipeRef.current = null
    if (!start) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_PX) {
      if (game.status === "over") restart()
      return
    }
    const direction: Direction = Math.abs(dx) > Math.abs(dy)
      ? dx > 0 ? "right" : "left"
      : dy > 0 ? "down" : "up"
    setGame((g) => move(g, direction))
  }

  const status = {
    playing: "swipe, or press an arrow key or wasd, to slide the tiles.",
    won: "you made 2048. enter to keep going.",
    over: "no moves left. tap or enter to play again.",
  }[game.status]

  return (
    <div className="font-mono text-xs md:flex md:h-full md:flex-col">
      <p aria-live="polite" className="mb-3 text-black/70">{status}</p>

      {/* On desktop the board is a square that fills the free space of this size container. */}
      <div className="md:min-h-0 md:flex-1 md:[container-type:size]">
      <div
        ref={boardRef}
        tabIndex={0}
        role="application"
        aria-label={`2048 board, score ${game.score}`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { swipeRef.current = null }}
        className="relative aspect-square w-full max-w-[300px] touch-none select-none overflow-hidden border border-black/15 p-1 [container-type:inline-size] focus:outline-none focus-visible:outline focus-visible:outline-green-700 md:size-[min(100cqw,100cqh)] md:max-w-none"
      >
        <div className="relative size-full">
          {Array.from({ length: SIZE * SIZE }, (_, i) => (
            <div
              key={i}
              className="absolute p-0.5"
              style={cellStyle(Math.floor(i / SIZE), i % SIZE)}
            >
              <div className="size-full border border-black/10" />
            </div>
          ))}
          {/* Merged-away tiles slide under the new tile, then go on the next move. */}
          {[...game.ghosts, ...game.tiles].map((tile) => (
            <div key={tile.id} className={`absolute p-0.5 ${SLIDE_CLASS}`} style={cellStyle(tile.row, tile.col)}>
              <div
                className={`flex size-full items-center justify-center font-bold ${TILE_CLASS[tile.value] ?? BIG_TILE_CLASS} ${
                  tile.value >= 1024 ? "text-[7cqw]" : "text-[9cqw]"
                } ${tile.isNew ? "motion-safe:animate-[tileIn_140ms_ease-out_120ms_both]" : ""} ${
                  tile.merged ? "motion-safe:animate-[tilePop_160ms_ease-out_100ms_both]" : ""
                }`}
              >
                {tile.value}
              </div>
            </div>
          ))}
        </div>
        {game.status === "won" && (
          <GameOverlay
            result="you made 2048."
            detail={`score ${game.score}`}
            actions={[{ label: "keep going", onClick: goOn }, { label: "play again", onClick: restart }]}
          />
        )}
        {game.status === "over" && (
          <GameOverlay
            result="no moves left."
            detail={`score ${game.score}`}
            actions={[{ label: "play again", onClick: restart }]}
          />
        )}
      </div>
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-x-6 gap-y-3">
        <p className="text-black/55">
          score {game.score} · best {Math.max(best, game.score)}
        </p>
        <div className="grid grid-cols-3 gap-1">
          {PAD.map(({ direction, label, className }) => (
            <button
              key={direction}
              type="button"
              onClick={() => slide(direction)}
              aria-label={direction}
              className={`${className} h-11 w-11 touch-manipulation border border-black/15 hover:text-green-700 transition-colors md:h-8 md:w-8`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Game2048
