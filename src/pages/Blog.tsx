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

            <section className="mt-10 flex flex-col gap-4">
                {posts.length === 0 && (
                    <p className="font-mono text-sm opacity-50">no posts yet.</p>
                )}
                {posts.map((post) => (
                    <article
                        key={post.slug}
                        className="relative after:pointer-events-none after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-black/20 after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100"
                    >
                        <Link to={`/blog/${post.slug}`} className="group flex flex-col md:flex-row md:items-baseline gap-1 md:gap-3">
                            <h2 className="w-full md:max-w-[300px] font-display text-base italic group-hover:opacity-75 transition-opacity">
                                {post.title}
                            </h2>
                            <span className="font-mono text-xs text-green-700 opacity-75 shrink-0">
                                {new Date(post.date).toLocaleDateString('en-GB', {
                                    day: 'numeric', month: 'long', year: 'numeric',
                                })}
                            </span>
                            <p className="truncate text-sm opacity-0 group-hover:opacity-60 transition-opacity ml-1">
                                {post.description}
                            </p>
                        </Link>
                    </article>
                ))}
            </section>
        </BaseLayout>
    )
}

export default Blog
