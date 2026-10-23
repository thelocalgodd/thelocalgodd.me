import { defineCollection } from 'astro:content'
import { glob, file } from 'astro/loaders'
import { z } from 'astro/zod'

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
  }),
})

const projects = defineCollection({
  loader: file('src/content/projects/projects.json'),
  schema: z.object({
    name: z.string(),
    tagline: z.string(),
    year: z.string(),
    category: z.string(),
    url: z.url(),
    description: z.string(),
    stack: z.array(z.string()),
    highlights: z.array(z.string()),
    numbers: z.array(z.object({ value: z.string(), label: z.string() })).default([]),
  }),
})

export const collections = { blog, projects }
