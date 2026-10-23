import { useState } from "react"
import Snake from "./Snake"
import TicTacToe from "./TicTacToe"

const GAMES = [
  { id: "tic-tac-toe", label: "tic tac toe" },
  { id: "snake", label: "snake" },
] as const

type GameId = (typeof GAMES)[number]["id"]

function ArcadeGame() {
  const [game, setGame] = useState<GameId>("tic-tac-toe")

  return (
    <div>
      <p className="font-mono text-[11px] mb-3 text-black/55">
        <span className="text-green-700">{"[ "}</span>while you are here<span className="text-green-700">{" ]"}</span>
      </p>

      <div className="mb-5 flex gap-4 font-mono text-sm">
        {GAMES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => setGame(id)}
            aria-pressed={game === id}
            className={game === id ? "underline decoration-1 underline-offset-4" : "hover:opacity-75"}
          >
            {label}
          </button>
        ))}
      </div>

      {game === "tic-tac-toe" ? <TicTacToe /> : <Snake />}
    </div>
  )
}

export default ArcadeGame
