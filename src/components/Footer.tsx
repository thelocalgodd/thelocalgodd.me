function Footer() {
  const date = new Date().getFullYear()

  return (
    <footer className="mb-6 flex flex-col md:flex-row gap-2 md:gap-0 md:items-start justify-between mt-16 font-mono">
      <div className="text-xs">
        <p className=" text-green-700 opacity-50">美しい人生を送る</p>
        <ul className="mt-2">
            <li>
                <a href="/projects" className="hover:underline">projects</a>
            </li>
            <li>
                <a href="/random" className="hover:underline">random cool stuff</a>
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
