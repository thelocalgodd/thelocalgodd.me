import { NavLink } from "react-router-dom"

function Footer() {
  const date = new Date().getFullYear()

  return (
    <footer className="mb-6 flex flex-col md:flex-row gap-2 md:gap-0 md:items-start justify-between mt-16 font-mono">
      <div className="text-xs">
        <p className="w-fit">
          <span
            tabIndex={0}
            role="note"
            aria-label="Japanese: live a beautiful life"
            className="group relative inline-block cursor-default text-green-700 opacity-50 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none"
          >
            美しい人生を送る
            <span
              role="tooltip"
              className="pointer-events-none absolute bottom-full left-0 mb-2 w-max max-w-[220px] origin-bottom-left scale-95 rounded-sm border border-green-700/20 bg-[#fdf0da] px-2.5 py-1.5 text-[11px] not-italic text-black opacity-0 shadow-sm transition-all duration-150 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus:scale-100 group-focus:opacity-100"
            >
              <span className="text-green-700">jp</span> · live a beautiful life
            </span>
          </span>
        </p>
        <ul className="mt-2">
          <li>
            <NavLink
              to="/random"
              className={({ isActive }) =>
                isActive
                  ? "underline decoration-1 underline-offset-4"
                  : "hover:underline"
              }
            >
              random cool stuff
            </NavLink>
          </li>
        </ul>
      </div>
      <div className="">
        <p className="text-xs">© {date} Vincent Kwaku Kpemlie. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
