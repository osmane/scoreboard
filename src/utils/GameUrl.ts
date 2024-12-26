const WEBSOCKET_SERVER = "wss://billiards.onrender.com/ws"

export class GameUrl {
  static create({
    tableId,
    userName,
    userId,
    ruleType,
    isSpectator = false,
  }: {
    tableId: string
    userName: string
    userId: string
    ruleType: string
    isSpectator?: boolean
  }): URL {
    const target = new URL("https://tailuge.github.io/billiards/dist/")
    target.searchParams.append("websocketserver", WEBSOCKET_SERVER)
    target.searchParams.append("tableId", tableId)
    target.searchParams.append("name", userName)
    target.searchParams.append("clientId", userId)
    target.searchParams.append("ruletype", ruleType)
    if (isSpectator) {
      target.searchParams.append("spectator", "true")
    }
    return target
  }
}
