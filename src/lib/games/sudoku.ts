export type SudokuStatus = 'playing' | 'solved'

export interface SudokuState {
  /** 81 cells, row by row. 0 is an empty cell. */
  cells: number[]
  /** True for the numbers the puzzle starts with. The player cannot change them. */
  givens: boolean[]
  status: SudokuStatus
}

export const CELLS = 81
export const DEFAULT_GIVENS = 32

/** The other 20 cells in the same row, column and box, for each cell. */
const PEERS: number[][] = Array.from({ length: CELLS }, (_, i) => {
  const row = Math.floor(i / 9)
  const col = i % 9
  const boxRow = row - (row % 3)
  const boxCol = col - (col % 3)
  const peers = new Set<number>()
  for (let k = 0; k < 9; k++) {
    peers.add(row * 9 + k)
    peers.add(k * 9 + col)
    peers.add((boxRow + Math.floor(k / 3)) * 9 + boxCol + (k % 3))
  }
  peers.delete(i)
  return [...peers]
})

export function peersOf(index: number): number[] {
  return PEERS[index]
}

function shuffled<T>(items: T[], random: () => number): T[] {
  const out = [...items]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

function candidates(cells: number[], index: number): number[] {
  const used = new Set(PEERS[index].map((p) => cells[p]))
  return [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !used.has(n))
}

/** The empty cell with the fewest candidates, so the search branches as little as it can. -1 when full. */
function mostConstrained(cells: number[]): { index: number; options: number[] } {
  let best = { index: -1, options: [] as number[] }
  for (let i = 0; i < CELLS; i++) {
    if (cells[i] !== 0) continue
    const options = candidates(cells, i)
    if (best.index === -1 || options.length < best.options.length) best = { index: i, options }
    if (options.length <= 1) break
  }
  return best
}

/** Fills `cells` in place with a random full solution. */
function fill(cells: number[], random: () => number): boolean {
  const { index, options } = mostConstrained(cells)
  if (index === -1) return true
  for (const n of shuffled(options, random)) {
    cells[index] = n
    if (fill(cells, random)) return true
  }
  cells[index] = 0
  return false
}

/** Counts solutions, but stops at `limit`. */
function countSolutions(cells: number[], limit: number): number {
  const { index, options } = mostConstrained(cells)
  if (index === -1) return 1
  let count = 0
  for (const n of options) {
    cells[index] = n
    count += countSolutions(cells, limit - count)
    if (count >= limit) break
  }
  cells[index] = 0
  return count
}

/** A puzzle with exactly one solution. It keeps about `givens` numbers, or more when no more can go. */
export function createSudoku(givens = DEFAULT_GIVENS, random: () => number = Math.random): SudokuState {
  if (givens < 17 || givens > CELLS) throw new Error(`A sudoku cannot have ${givens} given numbers`)
  const cells = Array<number>(CELLS).fill(0)
  fill(cells, random)

  let left = CELLS
  for (const i of shuffled([...cells.keys()], random)) {
    if (left <= givens) break
    const value = cells[i]
    cells[i] = 0
    if (countSolutions([...cells], 2) === 1) left--
    else cells[i] = value
  }
  return { cells, givens: cells.map((n) => n !== 0), status: 'playing' }
}

/** True for each filled cell whose number is also in its row, column or box. */
export function conflicts(cells: number[]): boolean[] {
  return cells.map((n, i) => n !== 0 && PEERS[i].some((p) => cells[p] === n))
}

export function isSolved(cells: number[]): boolean {
  return cells.every((n) => n !== 0) && !conflicts(cells).some(Boolean)
}

/** Puts `value` (1 to 9, or 0 to clear) in a cell the player may change. */
export function setCell(state: SudokuState, index: number, value: number): SudokuState {
  if (state.status !== 'playing' || state.givens[index] || state.cells[index] === value) return state
  if (!Number.isInteger(value) || value < 0 || value > 9) throw new Error(`${value} is not a sudoku number`)
  const cells = [...state.cells]
  cells[index] = value
  return { ...state, cells, status: isSolved(cells) ? 'solved' : 'playing' }
}
