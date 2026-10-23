import { useEffect, useRef, useSyncExternalStore, type KeyboardEvent } from "react"
import ProjectDetail from "./ProjectDetail"
import type { Project } from "../lib/projects"

type Props = {
  projects: Project[]
}

// Matches Tailwind's `md` breakpoint, where the details move into the right panel.
const DESKTOP_QUERY = "(min-width: 48rem)"
const PANEL_ID = "project-panel"

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
                className={`group w-full text-left py-3 pl-3 pr-1 border-l-2 transition-colors ${isOpen
                    ? "border-green-700 bg-green-700/[0.05]"
                    : "border-transparent hover:bg-black/[0.015]"
                  } ${selected
                    ? "md:border-green-700 md:bg-green-700/[0.05]"
                    : "md:border-transparent md:bg-transparent md:hover:bg-black/[0.015]"
                  }`}
              >
                <p className={`font-display text-lg leading-tight transition-opacity ${isOpen ? "text-green-700" : "group-hover:opacity-75"} ${selected ? "md:text-green-700" : "md:text-inherit"}`}>
                  {p.name}
                </p>
                <p className="text-black/55 text-xs mt-0.5">
                  {p.tagline}
                </p>
              </button>

              {isOpen && (
                <div className="px-3 pb-8 pt-4 md:hidden">
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
        className="hidden md:sticky md:top-8 md:block md:border-l md:border-black/10 md:pl-10 md:pt-3"
      >
        <ProjectDetail key={shown.id} project={shown} />
      </section>
    </div>
  )
}

export default ProjectList
