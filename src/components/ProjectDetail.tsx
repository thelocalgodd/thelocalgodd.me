import type { Project } from "../lib/projects"

type Props = {
  project: Project
}

function ProjectDetail({ project }: Props) {
  const host = project.url.replace(/^https?:\/\//, "").replace(/\/$/, "")
  // Some names already end in "." (e.g. "yappp."); the green dot replaces it instead of doubling it.
  const name = project.name.replace(/\.$/, "")

  return (
    <div>
      <h2 className="font-display text-3xl leading-none">
        {name}
        <span className="text-green-700">.</span>
      </h2>
      <p className="mt-3 font-mono text-xs text-black/55">
        {project.year}
        {/* From lg the list row already shows the category. */}
        <span className="lg:hidden"> · {project.category}</span>
      </p>

      {/* A small browser window: the address bar is the visit link, and the whole window links to the site. */}
      <a
        href={project.url}
        target="_blank"
        rel="noreferrer"
        aria-label={`visit ${host}`}
        className="group/link mt-6 block overflow-hidden border border-black/15 transition-colors hover:border-black/30"
      >
        <span className="flex items-center gap-3 border-b border-black/15 px-3 py-2 font-mono text-xs">
          <span aria-hidden="true" className="flex shrink-0 gap-1">
            <span className="size-1.5 rounded-full bg-black/20" />
            <span className="size-1.5 rounded-full bg-black/20" />
            <span className="size-1.5 rounded-full bg-black/20" />
          </span>
          <span className="min-w-0 truncate group-hover/link:text-green-700">
            <span className="link-underline">visit {host}</span> ↗
          </span>
        </span>
        <img
          src={project.preview.src}
          width={project.preview.width}
          height={project.preview.height}
          alt=""
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
        />
      </a>

      <p className="mt-6 text-base leading-relaxed">{project.description}</p>

      {project.numbers.length > 0 && (
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          {project.numbers.map(({ value, label }) => (
            <div key={label} className="flex flex-col-reverse">
              <dt className="font-mono text-xs text-black/55">{label}</dt>
              <dd className="font-display text-3xl leading-none">{value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  )
}

export default ProjectDetail
