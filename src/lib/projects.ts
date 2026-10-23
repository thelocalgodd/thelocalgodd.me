import { getImage } from 'astro:assets'
import type { ImageMetadata } from 'astro'
import { getCollection } from 'astro:content'
import projectsData from '../content/projects/projects.json'

export interface ProjectPreview {
  src: string
  width: number
  height: number
}

export interface Project {
  id: string
  name: string
  tagline: string
  year: string
  category: string
  url: string
  description: string
  numbers: { value: string; label: string }[]
  preview: ProjectPreview
}

// getCollection does not keep file order; the JSON order is the display order.
const fileOrder = projectsData.map((project) => project.id)

// Screenshots from `npm run screenshots`, one per project id.
const screenshots = import.meta.glob<ImageMetadata>('../assets/projects/*.png', { eager: true, import: 'default' })

// About twice the widest the panel gets, for sharp screens.
const PREVIEW_WIDTH = 960

async function getPreview(id: string): Promise<ProjectPreview> {
  const screenshot = screenshots[`../assets/projects/${id}.png`]
  if (!screenshot) throw new Error(`No screenshot for project "${id}". Run: npm run screenshots -- ${id}`)
  const image = await getImage({ src: screenshot, width: PREVIEW_WIDTH, format: 'webp' })
  return {
    src: image.src,
    width: PREVIEW_WIDTH,
    height: Math.round((screenshot.height * PREVIEW_WIDTH) / screenshot.width),
  }
}

export async function getAllProjects(): Promise<Project[]> {
  const entries = await getCollection('projects')
  const sorted = entries.sort((a, b) => fileOrder.indexOf(a.id) - fileOrder.indexOf(b.id))
  return Promise.all(
    // Only the shown fields: stack and highlights stay in the JSON but are not sent to the island.
    sorted.map(async ({ id, data }) => ({
      id,
      name: data.name,
      tagline: data.tagline,
      year: data.year,
      category: data.category,
      url: data.url,
      description: data.description,
      numbers: data.numbers,
      preview: await getPreview(id),
    })),
  )
}
