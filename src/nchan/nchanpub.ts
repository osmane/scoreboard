export class NchanPub {
  private readonly publishUrl: string
  private readonly base = "billiards-network.onrender.com"
  private readonly channel: string

  constructor(channel: string) {
    this.channel = channel
    this.publishUrl = `https://${this.base}/publish/${this.channel}`
  }

  async post(event: any) {
    const response = await fetch(this.publishUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(event),
    })
    return response.ok
  }
}
