import { getCollection, type CollectionEntry } from 'astro:content'

export type Post = CollectionEntry<'blog'>

export async function getAllPosts(): Promise<Post[]> {
  const posts = await getCollection('blog')
  return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
}

const WORDS_PER_MINUTE = 200

export function readingTime(post: Post): string {
  if (post.body === undefined) throw new Error(`Post "${post.id}" has no body to count`)
  const words = post.body.split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / WORDS_PER_MINUTE))} min read`
}

export function formatPostDate(date: Date): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}
