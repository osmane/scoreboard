export class NchanClient {
  private socket: WebSocket | null = null
  private url: string

  constructor(url: string) {
    this.url = url
  }

  start() {
    this.socket = new WebSocket(this.url)

    this.socket.onopen = () => {
      console.log(`Connected to ${this.url}`)
    }

    this.socket.onmessage = (event: MessageEvent) => {
      console.log(`Received message: ${event.data}`)
    }

    this.socket.onerror = (error: Event) => {
      console.error(`WebSocket error:`, error)
    }

    this.socket.onclose = (event: CloseEvent) => {
      console.log(`Disconnected from ${this.url}:`, event.reason)
    }
  }

  stop() {
    if (this.socket) {
      this.socket.close()
      console.log(`Closed connection to ${this.url}`)
    }
  }
}
