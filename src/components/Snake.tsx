import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react"
import {
  createSnake,
  samePoint,
  tick,
  togglePause,
  turn,
  type Direction,
  type SnakeState,
} from "../lib/games/snake"

const SIZE = 15
const TICK_MS = 140
const SWIPE_PX = 24

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

function Snake() {
  const [game, setGame] = useState<SnakeState>(() => createSnake(SIZE))
  const [best, setBest] = useState(0)
  const boardRef = useRef<HTMLDivElement>(null)
  // Where the current touch gesture started, and whether it has already steered.
  const swipeRef = useRef<{ x: number; y: number; steered: boolean } | null>(null)

  useEffect(() => {
    if (game.status !== "running") return
    const timer = window.setInterval(() => setGame((g) => tick(g)), TICK_MS)
    return () => window.clearInterval(timer)
  }, [game.status])

  function restart() {
    setBest((b) => Math.max(b, game.score))
    setGame(createSnake(SIZE))
    boardRef.current?.focus()
  }

  function steer(direction: Direction) {
    setGame((g) => turn(g, direction))
    boardRef.current?.focus()
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const direction = KEYS[e.key]
    if (direction) {
      e.preventDefault()
      setGame((g) => turn(g, direction))
      return
    }
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault()
      if (game.status === "over") restart()
      else setGame((g) => togglePause(g))
    }
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse") return
    swipeRef.current = { x: e.clientX, y: e.clientY, steered: false }
  }

  // Steer as soon as a finger travels far enough, then measure the next swipe from there.
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    const start = swipeRef.current
    if (!start) return
    const dx = e.clientX - start.x
    const dy = e.clientY - start.y
    if (Math.max(Math.abs(dx), Math.abs(dy)) < SWIPE_PX) return
    const direction: Direction = Math.abs(dx) > Math.abs(dy)
      ? dx > 0 ? "right" : "left"
      : dy > 0 ? "down" : "up"
    setGame((g) => turn(g, direction))
    swipeRef.current = { x: e.clientX, y: e.clientY, steered: true }
  }

  // A tap without a swipe starts, pauses or restarts the game.
  function onPointerUp() {
    const start = swipeRef.current
    swipeRef.current = null
    if (!start || start.steered) return
    if (game.status === "over") restart()
    else setGame((g) => togglePause(g))
  }

  const occupied = new Set(game.snake.map((p) => `${p.x},${p.y}`))
  const head = game.snake[0]

  const status = {
    ready: "swipe, or press an arrow key or wasd, to start.",
    running: "tap or space to pause.",
    paused: "paused. tap or space to go on.",
    over: "game over. tap or enter to play again.",
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
        aria-label={`snake board, score ${game.score}`}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { swipeRef.current = null }}
        className="grid aspect-square w-full max-w-[300px] touch-none select-none border border-black/15 focus:outline-none focus-visible:outline focus-visible:outline-green-700 md:size-[min(100cqw,100cqh)] md:max-w-none"
        style={{
          gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${SIZE}, minmax(0, 1fr))`,
        }}
      >
        {Array.from({ length: SIZE * SIZE }, (_, i) => {
          const point = { x: i % SIZE, y: Math.floor(i / SIZE) }
          const isHead = samePoint(point, head)
          const isBody = occupied.has(`${point.x},${point.y}`)
          const isFood = samePoint(point, game.food)
          return (
            <div key={i} className="flex items-center justify-center">
              {isHead && <span className="h-[90%] w-[90%] bg-green-800" />}
              {!isHead && isBody && <span className="h-[80%] w-[80%] bg-green-700/80" />}
              {isFood && <span className="h-[50%] w-[50%] rounded-full bg-black/80" />}
            </div>
          )
        })}
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
              onClick={() => steer(direction)}
              aria-label={direction}
              className={`${className} h-11 w-11 touch-manipulation border border-black/15 hover:text-green-700 transition-colors md:h-8 md:w-8`}
            >
              {label}
            </button>
          ))}
        </div>
        {game.status === "over" && (
          <button
            type="button"
            onClick={restart}
            className="link-underline font-display text-base hover:text-green-700"
          >
            play again <span className="font-mono">↗</span>
          </button>
        )}
      </div>
    </div>
  )
}

export default Snake
