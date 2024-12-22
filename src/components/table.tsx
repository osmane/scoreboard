import { Table } from "@/interfaces"

export function TableItem({
  table,
  onJoin,
  onSpectate,
}: {
  table: Table
  onJoin: (tableId: string) => void
  onSpectate: (tableId: string) => void
}) {
  return (
    <div
      key={table.id}
      className="relative rounded-xl shadow-lg shadow-black overflow-hidden bg-green-700 border-4 border-green-900"
      style={{ maxWidth: "250px", fontSize: "0.6rem" }}
    >
      {/* Aspect Ratio Container */}
      <div className="relative" style={{ paddingTop: "50%" }}>
        <div className="absolute inset-0 flex flex-col p-3">
          {/* Felt surface */}
          <div className="absolute inset-2 bg-green-500 rounded-lg shadow-inner"></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <p className="text-white leading-tight">
                Table #{table.id.split("-")[0]}
              </p>
              <p className="text-gray-200 text-sm leading-tight">
                Created by: {table.creator.name}
              </p>
              <p className="text-gray-200 text-sm leading-tight">
                Players: {table.players.length}/2
              </p>
              <p className="text-gray-200 text-sm leading-tight">
                Spectators: {table.spectators.length}
              </p>
            </div>
            <div className="flex space-x-2">
              {table.players.length < 2 && (
                <button
                  onClick={() => onJoin(table.id)}
                  className="flex-1 px-3 py-2 text-white bg-green-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  aria-label="Join Table"
                >
                  👤➕ {/* Unicode Plus for "Join" */}
                </button>
              )}
              <button
                onClick={() => onSpectate(table.id)}
                className="flex-1 px-3 py-2 text-white bg-green-600 rounded hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
                aria-label="Spectate Table"
              >
                👁️ {/* Unicode Eye for "Spectate" */}
              </button>
            </div>
          </div>
          {/* Corner Pockets */}
          <div className="absolute top-0 left-0 w-7 h-7 bg-black rounded-full -mt-3 -ml-3 shadow-inner"></div>
          <div className="absolute top-0 right-0 w-7 h-7 bg-black rounded-full -mt-3 -mr-3 shadow-inner"></div>
          <div className="absolute bottom-0 left-0 w-7 h-7 bg-black rounded-full -mb-3 -ml-3 shadow-inner"></div>
          <div className="absolute bottom-0 right-0 w-7 h-7 bg-black rounded-full -mb-3 -mr-3 shadow-inner"></div>
          {/* Middle Pockets */}
          <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-6 h-6 bg-black rounded-full -mt-2.5 shadow-inner"></div>
          <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 w-6 h-6 bg-black rounded-full -mb-2.5 shadow-inner"></div>{" "}
        </div>
      </div>
    </div>
  )
}
