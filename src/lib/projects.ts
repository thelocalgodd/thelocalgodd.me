import { getCollection } from 'astro:content'
import projectsData from '../content/projects/projects.json'

export interface Project {
  id: string
  name: string
  tagline: string
  year: string
  category: string
  url: string
  description: string
  stack: string[]
  highlights: string[]
  numbers: { value: string; label: string }[]
}

// getCollection does not keep file order; the JSON order is the display order.
const fileOrder = projectsData.map((project) => project.id)

export async function getAllProjects(): Promise<Project[]> {
  const entries = await getCollection('projects')
  return entries
    .sort((a, b) => fileOrder.indexOf(a.id) - fileOrder.indexOf(b.id))
    .map((entry) => ({ ...entry.data, id: entry.id }))
}
