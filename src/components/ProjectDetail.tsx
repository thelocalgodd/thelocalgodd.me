import type { Project } from "../lib/projects"

type Props = {
  project: Project
}

function ProjectDetail({ project }: Props) {
  const host = project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")
  // Some names already end in "." (e.g. "yappp."); the green dot replaces it instead of doubling it.
  const name = project.name.replace(/\.$/, "")

  return (
    <div style={{ animation: "fadeIn 240ms ease-out both" }}>
      <h2 className="font-display text-3xl leading-none">
        {name}
        <span className="text-green-700">.</span>
      </h2>

      <p className="mt-6 text-base leading-relaxed">{project.description}</p>

      {project.numbers.length > 0 && (
        <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          {project.numbers.map(({ value, label }) => (
            <div key={label} className="flex flex-col-reverse">
              <dt className="font-mono text-xs text-black/55">{label}</dt>
              <dd className="font-display text-3xl leading-none">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      <div className="mt-9 pt-5 border-t border-black/10">
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="link-underline font-display text-base hover:text-green-700"
        >
          <span className="font-mono">↗</span> visit {host}
        </a>
      </div>
    </div>
  )
}

export default ProjectDetail
