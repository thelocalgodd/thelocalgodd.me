import { marked } from 'marked'

export interface PostMeta {
  title: string
  date: string
  description: string
  tags: string[]
  slug: string
}

export interface Post extends PostMeta {
  html: string
}

const modules = import.meta.glob('/src/content/blog/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>

function pathToSlug(path: string): string {
  return path.replace(/^.*\//, '').replace(/\.md$/, '')
}

function stripQuotes(value: string): string {
  return value.replace(/^['"]|['"]$/g, '')
}

function parseList(value: string): string[] {
  return value
    .slice(1, -1)
    .split(',')
    .map((item) => stripQuotes(item.trim()))
    .filter(Boolean)
}

function parseFrontmatter(raw: string): { data: Partial<PostMeta>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)

  if (!match) {
    return { data: {}, content: raw.trim() }
  }

  const [, frontmatter, content] = match
  const data: Partial<PostMeta> = {}

  frontmatter
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .forEach((line) => {
      const separatorIndex = line.indexOf(':')

      if (separatorIndex === -1) {
        return
      }

      const key = line.slice(0, separatorIndex).trim()
      const value = line.slice(separatorIndex + 1).trim()

      if (key === 'tags') {
        data.tags = value.startsWith('[') && value.endsWith(']') ? parseList(value) : []
        return
      }

      if (key === 'title' || key === 'date' || key === 'description') {
        data[key] = stripQuotes(value)
      }
    })

  return {
    data,
    content: content.trim(),
  }
}

const posts: Post[] = Object.entries(modules)
  .map(([path, raw]) => {
    const { data, content } = parseFrontmatter(raw)

    return {
      title: data.title ?? 'Untitled',
      date: data.date ?? '',
      description: data.description ?? '',
      tags: data.tags ?? [],
      slug: pathToSlug(path),
      html: marked.parse(content) as string,
    }
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

export function getAllPosts(): PostMeta[] {
  return posts.map(({ title, date, description, tags, slug }) => ({
    title,
    date,
    description,
    tags,
    slug,
  }))
}

export function getPostBySlug(slug: string): Post | null {
  return posts.find((post) => post.slug === slug) ?? null
}
