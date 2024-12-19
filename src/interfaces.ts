export interface Player {
  id: string
  name: string
}

export interface Table {
  id: string
  players: Player[]
  createdAt: number
  lastUsedAt: number
  isActive: boolean
}
