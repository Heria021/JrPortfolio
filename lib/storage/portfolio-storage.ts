import { promises as fs } from 'fs'
import path from 'path'
import { PortfolioFormData } from '@/lib/validations/auth'

export interface PortfolioEntry extends PortfolioFormData {
  id: string
  slug: string
  createdAt: string
  updatedAt: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const PORTFOLIO_FILE = path.join(DATA_DIR, 'portfolio.json')

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR)
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true })
  }
}

// Initialize with empty array if file doesn't exist
async function initializePortfolioFile() {
  try {
    await fs.access(PORTFOLIO_FILE)
  } catch {
    // Start with empty portfolio for production
    const emptyData: PortfolioEntry[] = []
    await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(emptyData, null, 2))
  }
}

export async function getAllPortfolioEntries(): Promise<PortfolioEntry[]> {
  await ensureDataDir()
  await initializePortfolioFile()
  
  try {
    const data = await fs.readFile(PORTFOLIO_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading portfolio data:', error)
    return []
  }
}

export async function createPortfolioEntry(data: PortfolioFormData): Promise<PortfolioEntry> {
  await ensureDataDir()
  await initializePortfolioFile()
  
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
  
  // Write back to file
  await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(updatedEntries, null, 2))
  
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
  
  // Write back to file
  await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(entries, null, 2))
  
  return entries[entryIndex]
}

export async function deletePortfolioEntry(id: string): Promise<boolean> {
  const entries = await getAllPortfolioEntries()
  const filteredEntries = entries.filter(entry => entry.id !== id)
  
  if (filteredEntries.length === entries.length) {
    return false // Entry not found
  }
  
  // Write back to file
  await fs.writeFile(PORTFOLIO_FILE, JSON.stringify(filteredEntries, null, 2))
  
  return true
}
