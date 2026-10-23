import { useEffect, useRef, useSyncExternalStore, type KeyboardEvent } from "react"
import ProjectDetail from "./ProjectDetail"
import type { Project } from "../lib/projects"

type Props = {
  projects: Project[]
}

// Matches Tailwind's `md` breakpoint, where the details move into the right panel.
const DESKTOP_QUERY = "(min-width: 48rem)"
const PANEL_ID = "project-panel"

const FADE_IN = "motion-safe:animate-[fadeIn_240ms_ease-out_both]"

function subscribeToNothing() {
  return () => {}
}

// The URL hash holds the selected project, so a project can be linked to (/projects/#yappp).
function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange)
  return () => window.removeEventListener("hashchange", onChange)
}

function setHash(id: string | null) {
  const url = id ? `#${id}` : window.location.pathname + window.location.search
  // replaceState does not scroll to the hash or add history entries; it also does not fire hashchange.
  history.replaceState(null, "", url)
  window.dispatchEvent(new HashChangeEvent("hashchange"))
}

function ProjectList({ projects }: Props) {
  const hash = useSyncExternalStore(
    subscribeToHash,
    () => window.location.hash.slice(1),
    () => "",
  )
  // False in the server HTML, true once hydrated. The server cannot see the hash, so the panel
  // stays hidden until then; otherwise a link to /projects/#x shows the first project for a moment.
  const hydrated = useSyncExternalStore(subscribeToNothing, () => true, () => false)
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([])

  // On mobile only the hashed row is open. On desktop the panel always shows a project.
  const open = projects.find((p) => p.id === hash) ?? null
  const shown = open ?? projects[0]

  useEffect(() => {
    if (!open || window.matchMedia(DESKTOP_QUERY).matches) return
    const index = projects.findIndex((p) => p.id === open.id)
    rowRefs.current[index]?.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [open, projects])

  function select(id: string) {
    const desktop = window.matchMedia(DESKTOP_QUERY).matches
    setHash(!desktop && open?.id === id ? null : id)
  }

  function onRowKeyDown(e: KeyboardEvent<HTMLButtonElement>, index: number) {
    const step = e.key === "ArrowDown" ? 1 : e.key === "ArrowUp" ? -1 : 0
    if (step === 0) return
    e.preventDefault()
    const next = (index + step + projects.length) % projects.length
    rowRefs.current[next]?.focus()
    setHash(projects[next].id)
  }

  if (!shown) return null

  return (
    <div className="md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:items-start md:gap-12">
      <ul role="tablist" aria-label="projects" aria-orientation="vertical">
        {projects.map((p, i) => {
          // `selected` drives the desktop look; `isOpen` drives the mobile inline details.
          const selected = p.id === shown.id
          const isOpen = p.id === open?.id
          return (
            <li key={p.id} role="presentation" className="border-b border-black/10">
              <button
                ref={(el) => { rowRefs.current[i] = el }}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={PANEL_ID}
                tabIndex={selected ? 0 : -1}
                onClick={() => select(p.id)}
                onKeyDown={(e) => onRowKeyDown(e, i)}
                className={`group/link flex w-full items-baseline gap-4 text-left py-3 pl-3 pr-1 border-l-2 transition-colors ${isOpen
                    ? "border-green-700"
                    : "border-transparent hover:bg-black/[0.03]"
                  } ${selected
                    ? "md:border-green-700 md:hover:bg-transparent"
                    : "md:border-transparent md:hover:bg-black/[0.03]"
                  }`}
              >
                <div className="min-w-0 flex-1">
                  <p className={`font-display text-base leading-tight ${isOpen ? "text-green-700" : ""} ${selected ? "md:text-green-700" : "md:text-inherit"}`}>
                    <span className="link-underline">{p.name}</span>
                  </p>
                  <p className="text-black/55 text-xs mt-0.5">
                    {p.tagline}
                  </p>
                </div>
                {/* Hidden from md to lg, where the list column is too narrow for it. */}
                <span className="hidden shrink-0 font-mono text-xs text-black/45 sm:inline md:hidden lg:inline">
                  {p.category}
                </span>
                <span aria-hidden="true" className="w-3 shrink-0 font-mono text-xs text-black/45 md:hidden">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              {isOpen && (
                <div className={`px-3 pb-8 pt-4 md:hidden ${FADE_IN}`}>
                  <ProjectDetail project={p} />
                </div>
              )}
            </li>
          )
        })}
      </ul>

      <section
        id={PANEL_ID}
        role="tabpanel"
        aria-label={`${shown.name} details`}
        className="hidden md:sticky md:top-8 md:grid md:border-l md:border-black/10 md:pl-10 md:pt-3"
      >
        {/* Every project sits in the same grid cell, so the panel is as tall as the longest one
            and the page does not jump when the selection changes. Only the shown one is visible. */}
        {projects.map((p) => {
          const visible = hydrated && p.id === shown.id
          return (
            <div key={p.id} className={`[grid-area:1/1] ${visible ? FADE_IN : "invisible"}`}>
              <ProjectDetail project={p} />
            </div>
          )
        })}
      </section>
    </div>
  )
}

export default ProjectList
