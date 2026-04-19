
import BaseLayout from "../layout/BaseLayout"

function Home() {
  return (
    <BaseLayout title="Vincent.">
      <section>
        <p className="font-display text-2xl">
          Vincent Kwaku{" "}
          <span className="italic">
            Kpemlie<span className="text-green-700">.</span>
          </span>
        </p>
        <div>
          <p><span className="text-green-700">{"[ "}</span>Software Developer<span className="text-green-700">{" ]"}</span></p>
        </div>
        <div />
      </section>
      <section className="py-8">
        <p>I build beautiful interfaces and backend systems.</p> <p> experienced in software development using javascript and typescript.</p>
      </section>

      <section className="flex flex-col">
        <a href="/blog" className="hover:underline transition-all delay-300 font-display text-sm italic">see my blog {"->"}</a>
        <a href="" className="hover:underline transition-all delay-300 font-display text-sm italic">{"->"} check out my resume </a>
      </section>
    </BaseLayout>
  )
}

export default Home
