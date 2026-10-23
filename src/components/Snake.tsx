import { useEffect, useRef, useState, type KeyboardEvent } from "react"
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

  const occupied = new Set(game.snake.map((p) => `${p.x},${p.y}`))
  const head = game.snake[0]

  const status = {
    ready: "press an arrow key or wasd to start.",
    running: "space to pause.",
    paused: "paused. space to go on.",
    over: "game over. enter to play again.",
  }[game.status]

  return (
    <div className="font-mono text-[12px]">
      <p aria-live="polite" className="mb-3 text-black/70">{status}</p>

      <div
        ref={boardRef}
        tabIndex={0}
        role="application"
        aria-label={`snake board, score ${game.score}`}
        onKeyDown={onKeyDown}
        className="grid aspect-square w-full max-w-[300px] border border-black/15 focus:outline-none focus-visible:outline focus-visible:outline-green-700"
        style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
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

      <div className="mt-4 flex flex-wrap items-start gap-x-6 gap-y-3">
        <p className="text-black/55">
          <span className="text-green-700">{"[ "}</span>
          score {game.score} · best {Math.max(best, game.score)}
          <span className="text-green-700">{" ]"}</span>
        </p>
        <div className="grid grid-cols-3 gap-1">
          {PAD.map(({ direction, label, className }) => (
            <button
              key={direction}
              type="button"
              onClick={() => steer(direction)}
              aria-label={direction}
              className={`${className} h-8 w-8 border border-black/15 hover:text-green-700 transition-colors`}
            >
              {label}
            </button>
          ))}
        </div>
        {game.status === "over" && (
          <button
            type="button"
            onClick={restart}
            className="font-display italic text-sm hover:text-green-700 transition-colors"
          >
            play again {"->"}
          </button>
        )}
      </div>
    </div>
  )
}

export default Snake
