import { useState } from "react"
import type { IconType } from "react-icons"
import { FaGithub, FaLinkedin, FaEnvelope, FaFilePdf, FaShareNodes } from "react-icons/fa6"
import { NavLink } from "react-router-dom"

const socials: { label: string; href: string; Icon: IconType }[] = [
  { label: "github", href: "https://github.com/thelocalgodd", Icon: FaGithub },
  { label: "linkedin", href: "https://linkedin.com/in/vkkpemlie/", Icon: FaLinkedin },
  { label: "email", href: "mailto:splashvincentk@gmail.com", Icon: FaEnvelope },
  { label: "resume", href: "/vkkpemlie_resume.pdf", Icon: FaFilePdf },
]

function NavBar() {
  const [socialsOpen, setSocialsOpen] = useState(false)

  return (
    <nav className="mb-6 flex items-center justify-between rounded-full md:pt-16 font-mono">
      <div className="flex items-center gap-6">
        <NavLink className="text-green-600 hover:opacity-75 transition-opacity" to="/">
          Vincent.
        </NavLink>
        <ul className="flex items-center gap-4">
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "underline decoration-1 underline-offset-4"
                  : "hover:opacity-75"
              }
              to="/blog"
            >
              blog
            </NavLink>
          </li>
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive
                  ? "underline decoration-1 underline-offset-4"
                  : "hover:opacity-75"
              }
              to="/projects"
            >
              projects
            </NavLink>
          </li>
        </ul>
      </div>
      <div />
      <div
        className="relative"
        onMouseEnter={() => setSocialsOpen(true)}
        onMouseLeave={() => setSocialsOpen(false)}
      >
        <button
          type="button"
          onClick={() => setSocialsOpen((open) => !open)}
          aria-expanded={socialsOpen}
          aria-haspopup="true"
          className="text-xs flex gap-1 items-center hover:border px-2 rounded-full border-zinc-300 py-0.5"
        >
          <FaShareNodes />
          <p>socials</p>
        </button>

        <div
          role="menu"
          className={`absolute right-0 top-full pt-2 transition-all duration-150 ease-out ${socialsOpen
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0"
            }`}
        >
          <ul className="flex flex-col gap-1 border border-black/15 bg-[#fdf0da] px-2 py-2 shadow-sm">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noreferrer" : undefined}
                  role="menuitem"
                  className="flex items-center gap-2 px-1 text-xs text-black/80 hover:text-green-700 transition-colors"
                >
                  <Icon className="shrink-0" />
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </nav>
  )
}

export default NavBar
