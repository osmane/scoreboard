import { useEffect } from "react"

const WEBSOCKET_SERVER = "wss://billiards.onrender.com/ws"

const isInsideIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true; // Assume it's in an iframe if there's a cross-origin error
  }
};

export function PlayModal({
  isOpen,
  onClose,
  tableId,
  userName, // Add userName prop
  userId, // Add userId prop
  ruleType, // Add ruletype prop
}: {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly tableId: string
  readonly userName: string // Add userName prop
  readonly userId: string // Add userId prop
  readonly ruleType: string // Add ruletype prop
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
  target.searchParams.append("name", userName) // Use userName
  target.searchParams.append("clientId", userId) // Use userId
  target.searchParams.append("ruletype", ruleType) // Use ruletype of the table

  return (
    <div className="top-[-10vh] fixed inset-0 z-50 flex items-center justify-center backdrop-blur-[1px] bg-black/50">
      <div className={`bg-white rounded-lg p-8 ${isInsideIframe() ? 'w-full h-[80vh] max-w-none m-0' : 'max-w-sm w-full m-4'} text-center`}>
        <h2 className="text-2xl text-gray-800 font-bold mb-4">
          Opponent Ready
        </h2>
        <p className="mb-6 text-gray-800">Your table is ready to play</p>
        <div className="flex gap-2 justify-center">
        <button
  onClick={() => {
    if (isInsideIframe()) {
      // Create the overlay container
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Optional: Add a backdrop
      overlay.style.display = 'flex';
      overlay.style.justifyContent = 'center';
      overlay.style.alignItems = 'center';
      overlay.style.zIndex = '1000'; // Ensure it's on top

      // Create the iframe container
      const iframeContainer = document.createElement('div');
      iframeContainer.style.width = '80%'; // Adjust as needed
      iframeContainer.style.height = '80%'; // Adjust as needed
      iframeContainer.style.backgroundColor = 'white'; // Optional: Background for the iframe area

      // Create the iframe
      const iframe = document.createElement('iframe');
      iframe.src = target.toString();
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';

      iframeContainer.appendChild(iframe);
      overlay.appendChild(iframeContainer);
      document.body.appendChild(overlay); // Append to the current iframe's body

      // Optional: Add a close button to the overlay
      const closeButton = document.createElement('button');
      closeButton.textContent = 'Close';
      closeButton.style.position = 'absolute';
      closeButton.style.top = '10px';
      closeButton.style.right = '10px';
      closeButton.onclick = () => {
        document.body.removeChild(overlay);
        if (onClose) {
          onClose(); // Still call onClose if it's relevant within this context
        }
      };
      iframeContainer.appendChild(closeButton);

    } else {
      window.open(target.toString(), "_blank");
    }
    if (!isInsideIframe() && onClose) { // Only call onClose for the parent window case
      onClose();
    }
  }}
  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
>
  Start Game
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
