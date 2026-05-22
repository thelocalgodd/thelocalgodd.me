import { useState } from "react"
import BaseLayout from "../layout/BaseLayout"
import ProjectDialog, { type Project } from "../components/ProjectDialog"
import { getAllProjects } from "../lib/projects"

const projects = getAllProjects()

function Projects() {
  const [active, setActive] = useState<Project | null>(null)

  return (
    <BaseLayout title="Projects | Vincent.">
      <section className="pt-2">
        <p className="font-mono text-sm">
          some stuff I have worked on
        </p>
      </section>

      <section className="mt-10 pb-10">

        <ul className="">
          {projects.map((p, i) => (
            <li key={p.id} className="border-b border-black/10">
              <button
                type="button"
                onClick={() => setActive(p)}
                className="group w-full text-left py-2 flex items-baseline gap-5 hover:bg-black/[0.015] transition-colors px-1 -mx-1"
              >
                <span className="font-mono text-[11px] text-black/40 group-hover:text-green-700 transition-colors w-6 shrink-0 pt-1">
                  0{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-display leading-tight">
                    {p.name}
                    {" "}
                    <span className="italic text-black/55 text-[12px]">
                      {p.tagline}
                    </span>
                  </p>
                  {/* <p className="font-mono text-[11px] text-black/50 mt-2 tracking-tight">
                    {p.stack.slice(0, 5).join("  ·  ")}
                  </p> */}
                </div>
                <span className="font-mono text-[11px] text-black/45 group-hover:text-green-700 transition-colors shrink-0 pt-1 hidden sm:inline">
                  {p.year}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      <ProjectDialog project={active} onClose={() => setActive(null)} />
    </BaseLayout>
  )
}

export default Projects
