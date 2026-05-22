import { Link } from "react-router-dom"
import BaseLayout from "../layout/BaseLayout"
import { getAllPosts } from "../lib/blog"

function Blog() {
    const posts = getAllPosts()

    return (
        <BaseLayout title="Blog | Vincent.">
            <section className="pt-2">
                <p className="font-mono text-sm">
                    i try to write as much as i can about random topics.
                    this blog is of random words, thoughts and ideas.
                </p>
            </section>

            <section className="mt-10 pb-10">
                {posts.length === 0 && (
                    <p className="font-mono text-sm opacity-50">no posts yet.</p>
                )}

                <ul className="">
                    {posts.map((post, i) => (
                        <li key={post.slug} className="border-b border-black/10">
                            <Link
                                to={`/blog/${post.slug}`}
                                className="group w-full text-left py-2 flex items-baseline gap-5 hover:bg-black/[0.015] transition-colors px-1 -mx-1"
                            >
                                <span className="font-mono text-[11px] text-black/40 group-hover:text-green-700 transition-colors w-6 shrink-0 pt-1">
                                    0{i + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="font-display leading-tight">
                                        {post.title}
                                        {" "}
                                        <span className="italic text-black/55 text-[12px]">
                                            {post.description}
                                        </span>
                                    </p>
                                </div>
                                <span className="font-mono text-[11px] text-black/45 group-hover:text-green-700 transition-colors shrink-0 pt-1 hidden sm:inline">
                                    {new Date(post.date).toLocaleDateString('en-GB', {
                                        day: 'numeric', month: 'long', year: 'numeric',
                                    })}
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </BaseLayout>
    )
}

export default Blog
