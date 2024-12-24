import { useEffect } from "react"
import { NchanClient } from "../utils/nchanclient"
const NchanSubscriber: React.FC = () => {
  useEffect(() => {
    const client = new NchanClient(
      "wss://billiards-network.onrender.com/subscribe"
    )
    client.start()

    return () => {
      client.stop()
    }
  }, [])

  return <div></div>
}

export default NchanSubscriber
