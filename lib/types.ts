export interface TechInfo {
  name: string
  version?: string
  icon?: string
}

export interface TechStackResult {
  url: string
  technologies: {
    [category: string]: TechInfo[]
  }
}
