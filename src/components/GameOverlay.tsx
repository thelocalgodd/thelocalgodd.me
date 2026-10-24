import { useEffect, useRef } from "react"

type Action = { label: string; onClick: () => void }

type Props = {
  result: string
  detail?: string
  /** The first action gets focus when the overlay opens. */
  actions: Action[]
  /** Waits before fading in, so an end animation under it can play. */
  delayMs?: number
}

/** End-of-round card over a game board. The board must be `relative`. */
// The text grows with the board, but stays readable when the board is small.
function GameOverlay({ result, detail, actions, delayMs = 0 }: Props) {
  const firstRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    firstRef.current?.focus()
  }, [])

  return (
    <div
      // The boards handle keys and taps themselves. Without this, Enter on a button or a tap
      // on the card also reaches the board and runs the action a second time.
      onKeyDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-[#fdf0da]/85 backdrop-blur-[1px]"
      style={{ animation: `overlayFadeIn 180ms ease-out ${delayMs}ms both` }}
    >
      <p className="font-display text-lg md:text-[max(1.125rem,min(7cqw,7cqh))]">{result}</p>
      {detail && <p className="font-mono text-xs text-black/55">{detail}</p>}
      {actions.map(({ label, onClick }, i) => (
        <button
          key={label}
          ref={i === 0 ? firstRef : undefined}
          type="button"
          onClick={onClick}
          className="link-underline font-display text-base hover:text-green-700 md:text-[max(1rem,min(4cqw,4cqh))]"
        >
          {label} <span className="font-mono">↗</span>
        </button>
      ))}
    </div>
  )
}

export default GameOverlay
