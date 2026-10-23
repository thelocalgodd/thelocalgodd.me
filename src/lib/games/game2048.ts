export type Direction = 'up' | 'down' | 'left' | 'right'
export type Game2048Status = 'playing' | 'won' | 'over'

export interface Tile {
  /** Stays the same while the tile slides, so the view can animate it. */
  id: number
  value: number
  row: number
  col: number
  /** Added by the last move. */
  isNew: boolean
  /** Made by a merge in the last move. */
  merged: boolean
}

export interface Game2048State {
  size: number
  tiles: Tile[]
  /** Tiles merged away in the last move, at the cell they merged into. Kept one move so the view can slide them. */
  ghosts: Tile[]
  nextId: number
  score: number
  status: Game2048Status
  /** Set after the player chooses to go on past 2048, so the win shows only once. */
  keepPlaying: boolean
}

export const WINNING_TILE = 2048

/** Row by row. 0 is an empty cell. */
export function cellValues(state: Game2048State): number[] {
  const cells = Array<number>(state.size * state.size).fill(0)
  for (const tile of state.tiles) cells[tile.row * state.size + tile.col] = tile.value
  return cells
}

// A new tile is a 2 most of the time and a 4 one time in ten, as in the original game.
function spawnTile(state: Game2048State, random: () => number): Game2048State {
  const empty = cellValues(state).flatMap((value, i) => (value === 0 ? [i] : []))
  if (empty.length === 0) return state
  const index = empty[Math.floor(random() * empty.length)]
  const tile: Tile = {
    id: state.nextId,
    value: random() < 0.9 ? 2 : 4,
    row: Math.floor(index / state.size),
    col: index % state.size,
    isNew: true,
    merged: false,
  }
  return { ...state, tiles: [...state.tiles, tile], nextId: state.nextId + 1 }
}

export function createGame2048(size = 4, random: () => number = Math.random): Game2048State {
  if (size < 2) throw new Error(`Board size ${size} is too small for 2048`)
  const empty: Game2048State = {
    size, tiles: [], ghosts: [], nextId: 1, score: 0, status: 'playing', keepPlaying: false,
  }
  return spawnTile(spawnTile(empty, random), random)
}

/** Cell indexes for each line, ordered from the edge the tiles move toward. */
function linesFor(size: number, direction: Direction): number[][] {
  const range = Array.from({ length: size }, (_, i) => i)
  const lines = range.map((a) =>
    range.map((b) => (direction === 'left' || direction === 'right' ? a * size + b : b * size + a)),
  )
  return direction === 'right' || direction === 'down' ? lines.map((line) => line.reverse()) : lines
}

export function canMove(state: Game2048State): boolean {
  const { size } = state
  const cells = cellValues(state)
  return cells.some((value, i) => {
    if (value === 0) return true
    const right = i % size < size - 1 && cells[i + 1] === value
    const below = i + size < cells.length && cells[i + size] === value
    return right || below
  })
}

export function move(
  state: Game2048State,
  direction: Direction,
  random: () => number = Math.random,
): Game2048State {
  if (state.status !== 'playing') return state

  const { size } = state
  const byCell = new Map(state.tiles.map((tile) => [tile.row * size + tile.col, tile]))
  const tiles: Tile[] = []
  const ghosts: Tile[] = []
  let nextId = state.nextId
  let gained = 0
  let changed = false

  for (const indexes of linesFor(size, direction)) {
    const line = indexes.flatMap((i) => byCell.get(i) ?? [])
    let target = 0
    // Each tile merges at most once per move.
    for (let i = 0; i < line.length; i++) {
      const cell = indexes[target]
      const at = { row: Math.floor(cell / size), col: cell % size }
      const tile = line[i]
      const partner = line[i + 1]
      if (partner && partner.value === tile.value) {
        ghosts.push({ ...tile, ...at }, { ...partner, ...at })
        tiles.push({ id: nextId++, value: tile.value * 2, ...at, isNew: false, merged: true })
        gained += tile.value * 2
        changed = true
        i++
      } else {
        if (tile.row !== at.row || tile.col !== at.col) changed = true
        tiles.push({ ...tile, ...at, isNew: false, merged: false })
      }
      target++
    }
  }
  if (!changed) return state

  const next = spawnTile({ ...state, tiles, ghosts, nextId, score: state.score + gained }, random)
  if (!state.keepPlaying && next.tiles.some((tile) => tile.value === WINNING_TILE)) return { ...next, status: 'won' }
  if (!canMove(next)) return { ...next, status: 'over' }
  return next
}

export function keepPlaying(state: Game2048State): Game2048State {
  if (state.status !== 'won') return state
  return { ...state, status: canMove(state) ? 'playing' : 'over', keepPlaying: true }
}
