export type Mark = 'x' | 'o'
export type Cell = Mark | null
export type Board = Cell[]

export interface Win {
  mark: Mark
  line: number[]
}

// Cells each player holds, in play order.
export interface Moves {
  x: number[]
  o: number[]
}

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
]

const CORNERS = [0, 2, 6, 8]

export function emptyMoves(): Moves {
  return { x: [], o: [] }
}

export function opponentOf(mark: Mark): Mark {
  return mark === 'x' ? 'o' : 'x'
}

export function toBoard(moves: Moves): Board {
  const board = Array<Cell>(9).fill(null)
  for (const i of moves.x) board[i] = 'x'
  for (const i of moves.o) board[i] = 'o'
  return board
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

export function isDraw(board: Board): boolean {
  return getWinner(board) === null && board.every((cell) => cell !== null)
}

// x always starts, so x is to move whenever both have played the same number of times.
export function nextMark(moves: Moves): Mark {
  return moves.x.length <= moves.o.length ? 'x' : 'o'
}

export function play(moves: Moves, index: number, mark: Mark): Moves {
  if (toBoard(moves)[index] !== null) return moves
  return { ...moves, [mark]: [...moves[mark], index] }
}

function freeCells(moves: Moves): number[] {
  return toBoard(moves).flatMap((cell, i) => (cell === null ? [i] : []))
}

function winningMove(moves: Moves, mark: Mark): number | null {
  return freeCells(moves).find((i) => getWinner(toBoard(play(moves, i, mark)))?.mark === mark) ?? null
}

function pick(cells: number[], random: () => number): number {
  return cells[Math.floor(random() * cells.length)]
}

// A simple player on purpose: it wins or blocks when it can, but a fork beats it.
export function computerMove(moves: Moves, mark: Mark, random: () => number = Math.random): number {
  const free = freeCells(moves)
  if (free.length === 0) throw new Error('computerMove called on a full board')

  const win = winningMove(moves, mark)
  if (win !== null) return win
  const block = winningMove(moves, opponentOf(mark))
  if (block !== null) return block
  if (free.includes(4)) return 4

  const corners = CORNERS.filter((i) => free.includes(i))
  return pick(corners.length > 0 ? corners : free, random)
}
