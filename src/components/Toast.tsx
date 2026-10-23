import { useEffect, useState } from "react"

const STORAGE_KEY = "toast:check-out-blog"

function Toast() {
  const [visible, setVisible] = useState(false)

  // Mount the toast once per session — a sessionStorage flag keeps it from
  // returning after the user has seen (or dismissed) it, until the tab closes.
  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return
    const showTimer = window.setTimeout(() => setVisible(true), 1200)
    return () => window.clearTimeout(showTimer)
  }, [])

  function dismiss() {
    setVisible(false)
    sessionStorage.setItem(STORAGE_KEY, "1")
  }

  if (sessionStorage.getItem(STORAGE_KEY)) return null

  return (
    <div
      role="status"
      aria-live="polite"
      className={`pointer-events-none fixed top-5 left-5 z-40 max-w-[260px] transition-all duration-300 ease-out ${
        visible ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
      }`}
    >
      <div className="pointer-events-auto flex items-start gap-3 border border-black/15 bg-[#fdf0da] px-4 py-3 shadow-sm font-mono">
        <div className="text-[12px] leading-relaxed">
          <p className="text-black/55">
            <span className="text-green-700">[ </span>psst<span className="text-green-700"> ]</span>
          </p>
          <p className="mt-1">
            i write things —{" "}
            <a
              href="/blog/"
              onClick={dismiss}
              className="text-green-700 underline-offset-2 hover:underline"
            >
              check out the blog {"->"}
            </a>
          </p>
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="dismiss"
          className="-mt-1 -mr-1 shrink-0 text-base leading-none text-black/40 hover:text-green-700 transition-colors"
        >
          ×
        </button>
      </div>
    </div>
  )
}

export default Toast
