export class NchanClient {
  private socket: WebSocket | null = null
  private readonly url: string
  private readonly notify: (event: MessageEvent) => void = () => {}
  private shouldReconnect: boolean = false
  private reconnectTimeout: NodeJS.Timeout | null = null

  constructor(url: string, notify: (event: MessageEvent) => void = (_) => {}) {
    this.url = url
    this.notify = notify
  }

  start() {
    this.shouldReconnect = true
    this.connect()
  }

  private connect() {
    this.socket = new WebSocket(this.url)

    this.socket.onopen = () => {
      console.log(`Connected to ${this.url}`)
    }

    this.socket.onmessage = (event: MessageEvent) => {
      console.log(`Received message: ${event.data}`)
      this.notify(event)
    }

    this.socket.onerror = (error: Event) => {
      console.error(`WebSocket error:`, error)
    }

    this.socket.onclose = (event: CloseEvent) => {
      console.log(`Disconnected from ${this.url}:`, event.reason)
      if (this.shouldReconnect) {
        this.reconnectTimeout = setTimeout(() => this.connect(), 30000)
      }
    }
  }

  stop() {
    this.shouldReconnect = false
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout)
      this.reconnectTimeout = null
    }
    if (this.socket) {
      this.socket.close()
      this.socket = null
      console.log(`Closed connection to ${this.url}`)
    }
  }
}
