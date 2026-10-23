export type Direction = 'up' | 'down' | 'left' | 'right'
export type SnakeStatus = 'ready' | 'running' | 'paused' | 'over'

export interface Point {
  x: number
  y: number
}

export interface SnakeState {
  size: number
  snake: Point[]
  direction: Direction
  nextDirection: Direction
  food: Point
  score: number
  status: SnakeStatus
}

const STEP: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

export function samePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y
}

function placeFood(size: number, snake: Point[], random: () => number): Point | null {
  const free: Point[] = []
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!snake.some((p) => p.x === x && p.y === y)) free.push({ x, y })
    }
  }
  if (free.length === 0) return null
  return free[Math.floor(random() * free.length)]
}

export function createSnake(size: number, random: () => number = Math.random): SnakeState {
  const mid = Math.floor(size / 2)
  const snake = [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ]
  const food = placeFood(size, snake, random)
  if (!food) throw new Error(`Board size ${size} is too small for snake`)
  return { size, snake, direction: 'right', nextDirection: 'right', food, score: 0, status: 'ready' }
}

// Compare with the last direction moved, so two quick key presses cannot reverse the snake.
export function turn(state: SnakeState, direction: Direction): SnakeState {
  if (state.status === 'over' || direction === OPPOSITE[state.direction]) return state
  return {
    ...state,
    nextDirection: direction,
    status: state.status === 'ready' ? 'running' : state.status,
  }
}

export function togglePause(state: SnakeState): SnakeState {
  if (state.status === 'running') return { ...state, status: 'paused' }
  if (state.status === 'paused' || state.status === 'ready') return { ...state, status: 'running' }
  return state
}

export function tick(state: SnakeState, random: () => number = Math.random): SnakeState {
  if (state.status !== 'running') return state

  const direction = state.nextDirection
  const head = state.snake[0]
  const nextHead = { x: head.x + STEP[direction].x, y: head.y + STEP[direction].y }
  const eats = samePoint(nextHead, state.food)
  // The tail moves away this tick unless the snake grows.
  const body = eats ? state.snake : state.snake.slice(0, -1)

  const hitsWall = nextHead.x < 0 || nextHead.y < 0 || nextHead.x >= state.size || nextHead.y >= state.size
  if (hitsWall || body.some((p) => samePoint(p, nextHead))) {
    return { ...state, direction, status: 'over' }
  }

  const snake = [nextHead, ...body]
  if (!eats) return { ...state, snake, direction }

  const food = placeFood(state.size, snake, random)
  if (!food) return { ...state, snake, direction, score: state.score + 1, status: 'over' }
  return { ...state, snake, direction, food, score: state.score + 1 }
}
