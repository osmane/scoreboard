export class NchanPub {
  private readonly publishUrl: string

  private readonly base = "osmane-billiards-network.onrender.com"
  private readonly channel: string
              
  private readonly statusUrl = `https://${this.base}/basic_status`

  constructor(channel: string) {
    this.channel = channel;
    
    this.publishUrl = `https://${this.base}/publish/lobby/${this.channel}`;
  }

  async post(event: any) {
    const response = await fetch(this.publishUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(event),
    })
    return await response.json()
  }

  async get() {
    const response = await fetch(this.statusUrl, {
      method: "GET",
      mode: "cors",
    })

    const textData = await response.text()
    console.log(textData)

    const activeConnectionsMatch = textData.match(/Active connections:\s+(\d+)/)
    const activeConnections = activeConnectionsMatch
      ? parseInt(activeConnectionsMatch[1], 10) - 1
      : 0

    console.log("Active Connections:", activeConnections)
    return activeConnections
  }
}