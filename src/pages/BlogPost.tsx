import { useParams, Link } from "react-router-dom"
import DOMPurify from "dompurify"
import BaseLayout from "../layout/BaseLayout"
import { getPostBySlug } from "../lib/blog"

function BlogPost() {
  const { slug } = useParams<{ slug: string }>()
  const post = getPostBySlug(slug ?? '')

  if (!post) {
    return (
      <BaseLayout title="Post not found | Vincent.">
        <section className="flex min-h-[40vh] flex-col justify-center gap-4">
          <p className="font-mono text-sm text-green-700">404.</p>
          <h1 className="font-display text-3xl italic">Post not found.</h1>
          <Link className="font-mono text-sm hover:opacity-75" to="/blog">← blog.</Link>
        </section>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout title={`${post.title} | Vincent.`}>
      <article>
        <header className="mb-8">
          <Link to="/blog" className="font-mono text-sm text-green-700 hover:opacity-75 transition-opacity">
            ← blog.
          </Link>
          <div className="mt-4 flex items-baseline justify-between gap-4">
            <h1 className="font-display text-3xl italic">{post.title}</h1>
            <p className="font-mono text-xs opacity-50 shrink-0">
              {new Date(post.date).toLocaleDateString('en-GB', {
                day: 'numeric', month: 'long', year: 'numeric',
              })}
            </p>
          </div>
          {post.tags.length > 0 && (
            <div className="mt-3 flex gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="font-mono text-xs text-green-700">#{tag}</span>
              ))}
            </div>
          )}
        </header>
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.html) }}
        />
      </article>
    </BaseLayout>
  )
}

export default BlogPost
