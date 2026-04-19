import { FaGithub } from "react-icons/fa"
import { NavLink } from "react-router-dom"
import { Typewriter } from "react-simple-typewriter"

function NavBar() {
  return (
    <nav className="mb-6 flex items-center justify-between rounded-full md:pt-16 font-mono">
      <div className="flex items-center gap-6">
        <NavLink className="text-green-600 max-w-[100px] w-[100px]" to="/">
          <Typewriter words={["神速.", "vkk.", "Vincent."]} loop />
        </NavLink>
        <ul className="flex items-center gap-4">
          <li>
            <NavLink
              className={({ isActive }) => (isActive ? "opacity-100" : "hover:opacity-75")}
              to="/blog"
            >
              blog.
            </NavLink>
          </li>
        </ul>
      </div>
      <div />
      <div>
        <a target="_blank" href="https://github.com/thelocalgodd" className="text-xs flex gap-1 items-center hover:border px-2 rounded-full border-zinc-300">
          <FaGithub />
          <p>github</p>
        </a>
      </div>

    </nav>
  )
}

export default NavBar
