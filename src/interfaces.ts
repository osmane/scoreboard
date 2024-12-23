export interface Player {
  id: string
  name: string
}

export interface Table {
  id: string
  creator: Player
  players: Player[]
  spectators: Player[]
  createdAt: number
  lastUsedAt: number
  isActive: boolean
  ruleType: string
}
