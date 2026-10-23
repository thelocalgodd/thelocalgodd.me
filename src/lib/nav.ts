// Matches react-router's NavLink: a link is active on its own path and on any child path.
export function isActivePath(pathname: string, to: string): boolean {
  const current = pathname.replace(/\/+$/, '')
  const target = to.replace(/\/+$/, '')
  return current === target || current.startsWith(`${target}/`)
}
