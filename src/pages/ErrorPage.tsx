import { Link } from "react-router-dom"
import BaseLayout from "../layout/BaseLayout"

function ErrorPage() {
  return (
    <BaseLayout title="404 | Vincent.">
      <section className="flex min-h-[40vh] flex-col justify-center gap-4">
        <p className="font-mono text-sm text-green-700">404.</p>
        <h1 className="font-display text-3xl italic">This page wandered off.</h1>
        <p className="max-w-xl text-sm opacity-75">
          The route you tried does not exist here yet.
        </p>
        <Link className="font-mono text-sm hover:opacity-75" to="/">
          return home.
        </Link>
      </section>
    </BaseLayout>
  )
}

export default ErrorPage
