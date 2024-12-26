import { useEffect } from "react"

const WEBSOCKET_SERVER = "wss://billiards.onrender.com/ws"

const isInsideIframe = () => {
  try {
    return window.self !== window.top
  } catch (e) {
    return true // Assume it's in an iframe if there's a cross-origin error
  }
}

function useBodyOverflow(isOpen: boolean) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset"
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])
}

async function markComplete(tableId: string) {
  const response = await fetch(`/api/tables/${tableId}/complete`, {
    method: "PUT",
  })
}

function createOverlay(target: URL, onClose: () => void) {
  const overlay = document.createElement("div")
  overlay.className =
    "fixed inset-0 bg-black/50 flex items-center justify-center z-50"

  const iframeContainer = document.createElement("div")
  iframeContainer.className =
    "relative bg-white rounded-lg w-4/5 h-4/5 shadow-lg"

  const iframe = document.createElement("iframe")
  iframe.src = target.toString()
  iframe.className = "w-full h-full border-none"

  iframeContainer.appendChild(iframe)
  overlay.appendChild(iframeContainer)
  document.body.appendChild(overlay)

  const closeButton = document.createElement("button")
  closeButton.textContent = "Close"
  closeButton.className =
    "absolute top-2 right-2 bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
  closeButton.onclick = () => {
    document.body.removeChild(overlay)
    onClose()
  }

  iframeContainer.appendChild(closeButton)
}

export function PlayModal({
  isOpen,
  onClose,
  tableId,
  userName,
  userId,
  ruleType,
}: {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly tableId: string
  readonly userName: string
  readonly userId: string
  readonly ruleType: string
}) {
  useBodyOverflow(isOpen)

  if (!isOpen) return null

  const target = new URL("https://tailuge.github.io/billiards/dist/")
  target.searchParams.append("websocketserver", WEBSOCKET_SERVER)
  target.searchParams.append("tableId", tableId)
  target.searchParams.append("name", userName)
  target.searchParams.append("clientId", userId)
  target.searchParams.append("ruletype", ruleType)

  const handleStartGame = async () => {
    await markComplete(tableId)
    if (isInsideIframe()) {
      createOverlay(target, onClose)
    } else {
      window.open(target.toString(), "_blank")
    }
    if (!isInsideIframe() && onClose) {
      onClose()
    }
  }

  const handleCancel = async () => {
    await markComplete(tableId)
    onClose()
  }

  return (
    <div className="top-[-10vh] fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[1px] bg-black/50">
      <div
        className={`bg-white rounded-lg p-4 max-w-sm w-full m-4 text-center`}
      >
        <h2 className="text-2xl text-gray-800 font-bold mb-4">
          Opponent Ready
        </h2>
        <p className="mb-6 text-gray-800">Your table is ready to play</p>
        <div className="flex gap-2 justify-center">
          <button
            onClick={handleStartGame}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Start Game
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
