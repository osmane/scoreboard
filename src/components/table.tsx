import { Table } from "@/interfaces"

export function TableItem({
  table,
  onJoin,
  onSpectate,
  userId,
}: {
  table: Table
  onJoin: (tableId: string) => void
  onSpectate: (tableId: string) => void
  userId: string
}) {
  const isCreator = table.creator.id === userId

  const getTableColor = (ruleType: string) => {
    switch (ruleType) {
      case "nineball":
        return "bg-red-700 border-red-900"
      case "snooker":
        return "bg-green-700 border-green-900"
      case "threecushion":
        return "bg-blue-700 border-blue-900"
      default:
        return "bg-gray-700 border-gray-900"
    }
  }

  const getFeltColor = (ruleType: string) => {
    switch (ruleType) {
      case "nineball":
        return "bg-red-500"
      case "snooker":
        return "bg-green-500"
      case "threecushion":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div
      key={table.id}
      className={`relative rounded-xl shadow-lg shadow-black overflow-hidden ${getTableColor(table.ruleType)} border-4 ${
        isCreator ? "border-yellow-400" : ""
      }`}
      style={{ maxWidth: "250px", fontSize: "0.6rem" }}
    >
      {/* Aspect Ratio Container */}
      <div className="relative" style={{ paddingTop: "50%" }}>
        <div className="absolute inset-0 flex flex-col p-3">
          {/* Felt surface */}
          <div className={`absolute inset-2 ${getFeltColor(table.ruleType)} rounded-lg shadow-inner`}></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <p className="text-white leading-tight">
                {table.ruleType}
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
              {!isCreator && (
                <>
                  {table.players.length < 2 && (
                    <button
                      onClick={() => onJoin(table.id)}
                      className="flex-1 px-3 py-2 border border-white rounded-lg bg-transparent hover:bg-gray-800/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50"
                      aria-label="Join Table"
                    >
                      👤➕
                    </button>
                  )}
                  <button
                    onClick={() => onSpectate(table.id)}
                    className="flex-1 px-3 py-2 border border-white rounded-lg bg-transparent hover:bg-gray-800/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50"
                    aria-label="Spectate Table"
                  >
                    👁️
                  </button>
                </>
              )}
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
