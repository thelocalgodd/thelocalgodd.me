import { useState } from "react"
import type { IconType } from "react-icons"
import { FaGithub, FaLinkedin, FaEnvelope, FaFilePdf, FaShareNodes } from "react-icons/fa6"

const socials: { label: string; href: string; Icon: IconType }[] = [
  { label: "github", href: "https://github.com/thelocalgodd", Icon: FaGithub },
  { label: "linkedin", href: "https://linkedin.com/in/vkkpemlie/", Icon: FaLinkedin },
  { label: "email", href: "mailto:vincent@thelocalgodd.me", Icon: FaEnvelope },
  { label: "resume", href: "/vkkpemlie_resume.pdf", Icon: FaFilePdf },
]

function Socials() {
  const [socialsOpen, setSocialsOpen] = useState(false)

  return (
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
        className="flex gap-1 items-center hover:border px-2 rounded-full border-zinc-300 py-0.5"
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
                className="group/link flex items-center gap-2 px-1"
              >
                <Icon className="shrink-0" />
                <span className="link-underline">{label}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default Socials
