import { useEffect, useRef } from "react"
import type { Project } from "../lib/projects"

export type { Project }

type Props = {
  project: Project | null
  onClose: () => void
}

function ProjectDialog({ project, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!project) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeRef.current?.focus()
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = prevOverflow
    }
  }, [project, onClose])

  if (!project) return null

  const host = project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-dialog-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        role="presentation"
        onClick={onClose}
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
        style={{ animation: "overlayFadeIn 180ms ease-out both" }}
      />
      <div
        className="relative w-full max-w-[580px] max-h-[85vh] overflow-y-auto bg-[#fdf0da] border border-black/15 px-7 py-8 md:px-9 md:py-10"
        style={{ animation: "dialogFadeIn 240ms ease-out both" }}
      >
        <div className="flex items-start justify-between gap-4 pb-5 mb-6 border-b border-black/10">
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[11px] tracking-tight hover:text-green-700 transition-colors"
          >
            <span className="text-green-700">{"[ "}</span>
            {host}
            <span className="text-green-700">{" ]"}</span>
          </a>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="close"
            className="font-mono text-lg leading-none -mt-1 hover:text-green-700 transition-colors"
          >
            ×
          </button>
        </div>

        <h2 id="project-dialog-title" className="font-display text-4xl leading-none">
          {project.name}
          <span className="text-green-700">.</span>
        </h2>
        <p className="font-display italic text-lg mt-2 text-black/65">
          {project.tagline}
        </p>

        <p className="font-mono text-[11px] mt-5 text-black/55 tracking-tight">
          {project.year} <span className="text-green-700">/</span> {project.category}
        </p>

        <p className="text-[15px] leading-relaxed mt-7">
          {project.description}
        </p>

        <div className="mt-7">
          <p className="font-mono text-[11px] mb-3 text-black/55">
            <span className="text-green-700">{"[ "}</span>stack<span className="text-green-700">{" ]"}</span>
          </p>
          <ul className="font-mono text-[12px] flex flex-wrap gap-x-3 gap-y-1.5 text-black/80">
            {project.stack.map((s, i) => (
              <li key={s} className="flex items-center gap-3">
                <span>{s}</span>
                {i < project.stack.length - 1 && (
                  <span className="text-black/25">·</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-7">
          <p className="font-mono text-[11px] mb-3 text-black/55">
            <span className="text-green-700">{"[ "}</span>notes<span className="text-green-700">{" ]"}</span>
          </p>
          <ul className="text-[14px] leading-relaxed space-y-2">
            {project.highlights.map((h) => (
              <li key={h} className="flex gap-3">
                <span className="font-mono text-green-700 shrink-0 select-none">—</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-9 pt-5 border-t border-black/10">
          <a
            href={project.url}
            target="_blank"
            rel="noreferrer"
            className="font-display italic text-sm hover:text-green-700 transition-colors"
          >
            {"->"} visit {host}
          </a>
        </div>
      </div>
    </div>
  )
}

export default ProjectDialog
