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
}

const projects = projectsData as Project[]

export function getAllProjects(): Project[] {
  return projects
}
