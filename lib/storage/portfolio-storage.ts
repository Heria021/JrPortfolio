import { PortfolioFormData } from '@/lib/validations/auth'

export interface PortfolioEntry extends PortfolioFormData {
  id: string
  slug: string
  createdAt: string
  updatedAt: string
}

// In-memory storage for production (will be replaced with database later)
let portfolioData: PortfolioEntry[] = []

// Initialize with some sample data for production
function initializePortfolioData() {
  if (portfolioData.length === 0) {
    // You can add some default portfolio entries here if needed
    portfolioData = []
  }
}

// Storage abstraction layer
async function readPortfolioData(): Promise<PortfolioEntry[]> {
  // For development, try to read from file system
  if (process.env.NODE_ENV === 'development') {
    try {
      const { promises: fs } = await import('fs')
      const path = await import('path')
      const DATA_DIR = path.join(process.cwd(), 'data')
      const PORTFOLIO_FILE = path.join(DATA_DIR, 'portfolio.json')

      // Ensure data directory exists
      try {
        await fs.access(DATA_DIR)
      } catch {
        await fs.mkdir(DATA_DIR, { recursive: true })
      }

      // Try to read existing file
      try {
        const data = await fs.readFile(PORTFOLIO_FILE, 'utf-8')
        return JSON.parse(data)
      } catch {
        // File doesn't exist, create it
        const emptyData: PortfolioEntry[] = []
        await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(emptyData, null, 2))
        return emptyData
      }
    } catch (error) {
      console.error('Error reading from file system:', error)
      // Fall back to in-memory storage
      initializePortfolioData()
      return portfolioData
    }
  } else {
    // Production: use in-memory storage
    initializePortfolioData()
    return portfolioData
  }
}

async function writePortfolioData(data: PortfolioEntry[]): Promise<void> {
  // For development, try to write to file system
  if (process.env.NODE_ENV === 'development') {
    try {
      const { promises: fs } = await import('fs')
      const path = await import('path')
      const DATA_DIR = path.join(process.cwd(), 'data')
      const PORTFOLIO_FILE = path.join(DATA_DIR, 'portfolio.json')

      await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('Error writing to file system:', error)
      // Fall back to in-memory storage
      portfolioData = data
    }
  } else {
    // Production: use in-memory storage
    portfolioData = data
  }
}

export async function getAllPortfolioEntries(): Promise<PortfolioEntry[]> {
  try {
    return await readPortfolioData()
  } catch (error) {
    console.error('Error reading portfolio data:', error)
    return []
  }
}

export async function createPortfolioEntry(data: PortfolioFormData): Promise<PortfolioEntry> {
  // Generate slug from title
  const slug = data.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

  // Create new entry
  const newEntry: PortfolioEntry = {
    id: Date.now().toString(),
    slug,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Read existing data
  const existingEntries = await getAllPortfolioEntries()

  // Add new entry to the beginning
  const updatedEntries = [newEntry, ...existingEntries]

  // Write back to storage
  await writePortfolioData(updatedEntries)

  return newEntry
}

export async function getPortfolioEntryById(id: string): Promise<PortfolioEntry | null> {
  const entries = await getAllPortfolioEntries()
  return entries.find(entry => entry.id === id) || null
}

export async function getPortfolioEntryBySlug(slug: string): Promise<PortfolioEntry | null> {
  const entries = await getAllPortfolioEntries()
  return entries.find(entry => entry.slug === slug) || null
}

export async function updatePortfolioEntry(id: string, data: Partial<PortfolioFormData>): Promise<PortfolioEntry | null> {
  const entries = await getAllPortfolioEntries()
  const entryIndex = entries.findIndex(entry => entry.id === id)

  if (entryIndex === -1) {
    return null
  }

  // Update the entry
  entries[entryIndex] = {
    ...entries[entryIndex],
    ...data,
    updatedAt: new Date().toISOString(),
  }

  // Write back to storage
  await writePortfolioData(entries)

  return entries[entryIndex]
}

export async function deletePortfolioEntry(id: string): Promise<boolean> {
  const entries = await getAllPortfolioEntries()
  const filteredEntries = entries.filter(entry => entry.id !== id)

  if (filteredEntries.length === entries.length) {
    return false // Entry not found
  }

  // Write back to storage
  await writePortfolioData(filteredEntries)

  return true
}
