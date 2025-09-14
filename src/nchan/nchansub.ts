export class NchanSub {
  private socket: WebSocket | null = null
  private readonly subscribeUrl: string
  private readonly notify: (event: string) => void = () => {}
  private shouldReconnect: boolean = false
  private reconnectTimeout: NodeJS.Timeout | null = null
  // Sunucu adresini localhost:8081 olarak değiştirin
  private readonly base = "localhost:8081"
  private readonly channel: string

  constructor(
    channel: string,
    notify: (event: string) => void = (_) => {},
    channelType: string = "lobby"
  ) {
    this.channel = channel
    // Protokolü "ws" olarak değiştirin
    this.subscribeUrl = `ws://${this.base}/subscribe/${channelType}/${this.channel}`
    this.notify = notify
  }

  start() {
    this.shouldReconnect = true
    this.connect()
  }

  private connect() {
    this.socket = new WebSocket(this.subscribeUrl)

    this.socket.onopen = () => {
      console.log(`Connected to ${this.subscribeUrl}`)
    }

    this.socket.onmessage = (event: MessageEvent) => {
      console.log(`Received message: ${event.data}`)
      this.notify(event.data)
    }

    this.socket.onerror = (error: Event) => {
      console.error(`WebSocket error:`, error)
    }

    this.socket.onclose = (event: CloseEvent) => {
      console.log(`Disconnected from ${this.subscribeUrl}:`, event.reason)
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
      console.log(`Closed connection to ${this.subscribeUrl}`)
    }
  }
}