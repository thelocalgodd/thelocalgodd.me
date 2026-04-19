import { useEffect, type PropsWithChildren } from "react"
import Footer from "../components/Footer"
import NavBar from "../components/NavBar"

type BaseLayoutProps = PropsWithChildren<{
  title?: string
}>

function BaseLayout({ children, title = "Vincent." }: BaseLayoutProps) {
  useEffect(() => {
    document.title = title
  }, [title])

  return (
    <div className="mx-auto w-full max-w-[1000px] px-6 py-6 md:max-w-[800px] lg:max-w-[900px]">
      <NavBar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

export default BaseLayout
