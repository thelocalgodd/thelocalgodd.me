import type { APIRoute, GetStaticPaths } from 'astro'
import { formatPostDate, getAllPosts, readingTime, type Post } from '../../lib/blog'
import { renderOgImage } from '../../lib/ogImage'

export const getStaticPaths = (async () => {
  const posts = await getAllPosts()
  return posts.map((post) => ({ params: { slug: post.id }, props: { post } }))
}) satisfies GetStaticPaths

export const GET: APIRoute<{ post: Post }> = async ({ props }) => {
  const { post } = props
  const png = await renderOgImage({
    title: post.data.title,
    meta: `${formatPostDate(post.data.date)} · ${readingTime(post)}`,
  })
  return new Response(png, { headers: { 'Content-Type': 'image/png' } })
}
