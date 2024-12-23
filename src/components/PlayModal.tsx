import { useEffect } from "react"

const WEBSOCKET_SERVER = "wss://billiards.onrender.com/ws"

export function PlayModal({
  isOpen,
  onClose,
  tableId,
}: {
  isOpen: boolean
  onClose: () => void
  tableId: string
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  const target = new URL("https://tailuge.github.io/billiards/dist/")
  target.searchParams.append("websocketserver", WEBSOCKET_SERVER)
  target.searchParams.append("tableId", tableId)
  target.searchParams.append("name", "Player") // This could be made dynamic
  target.searchParams.append(
    "clientId",
    `p${Math.random().toString(16).slice(2, 8)}`
  )
  target.searchParams.append("ruletype", "threecushion")

  return (
    <div className="top-[-10vh] fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[1px] bg-black/50">
      <div className="bg-white rounded-lg p-8 max-w-sm w-full m-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Opponent Found!</h2>
        <p className="mb-6">
          Your match is ready. Would you like to start the game now?
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.open(target.toString(), "_blank")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Join Game
          </button>
          <button
            onClick={onClose}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
