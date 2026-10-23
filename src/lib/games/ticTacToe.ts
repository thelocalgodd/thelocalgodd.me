export type Mark = 'x' | 'o'
export type Cell = Mark | null
export type Board = Cell[]

export interface Win {
  mark: Mark
  line: number[]
}

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

const CORNERS = [0, 2, 6, 8]

export function emptyBoard(): Board {
  return Array<Cell>(9).fill(null)
}

export function getWinner(board: Board): Win | null {
  for (const line of LINES) {
    const [a, b, c] = line
    const mark = board[a]
    if (mark && mark === board[b] && mark === board[c]) {
      return { mark, line }
    }
  }
  return null
}

export function isFull(board: Board): boolean {
  return board.every((cell) => cell !== null)
}

export function play(board: Board, index: number, mark: Mark): Board {
  if (board[index] !== null) return board
  const next = board.slice()
  next[index] = mark
  return next
}

function freeCells(board: Board): number[] {
  return board.flatMap((cell, i) => (cell === null ? [i] : []))
}

function winningMove(board: Board, mark: Mark): number | null {
  return freeCells(board).find((i) => getWinner(play(board, i, mark))?.mark === mark) ?? null
}

function pick(cells: number[], random: () => number): number {
  return cells[Math.floor(random() * cells.length)]
}

// A simple player on purpose: it wins or blocks when it can, but a fork beats it.
export function computerMove(board: Board, mark: Mark, random: () => number = Math.random): number {
  const free = freeCells(board)
  if (free.length === 0) throw new Error('computerMove called on a full board')

  const opponent: Mark = mark === 'x' ? 'o' : 'x'
  const win = winningMove(board, mark)
  if (win !== null) return win
  const block = winningMove(board, opponent)
  if (block !== null) return block
  if (board[4] === null) return 4

  const corners = CORNERS.filter((i) => board[i] === null)
  return pick(corners.length > 0 ? corners : free, random)
}
