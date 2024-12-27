import { Table } from "@/services/table"
import { UserPlusIcon, EyeIcon } from "@heroicons/react/24/solid"
import { GameUrl } from "@/utils/GameUrl"
import { createOverlay } from "@/components/PlayModal"

export function TableItem({
  table,
  onJoin,
  onSpectate,
  userId,
  userName,
}: {
  readonly table: Table
  readonly onJoin: (tableId: string) => void
  readonly onSpectate: (tableId: string) => void
  readonly userId: string
  readonly userName: string
}) {
  const isCreator = table.creator.id === userId

  const getTableColor = (
    ruleType: string,
    playerCount: number,
    completed: boolean
  ) => {
    if (playerCount >= 2)
      return completed
        ? "bg-gray-400 border-gray-600"
        : "bg-gray-700 border-gray-900"

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

  const getFeltColor = (
    ruleType: string,
    playerCount: number,
    completed: boolean
  ) => {
    if (playerCount >= 2) return completed ? "bg-gray-300" : "bg-gray-500"

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

  const handleSpectate = () => {
    const target = GameUrl.create({
      tableId: table.id,
      userName,
      userId,
      ruleType: table.ruleType,
      isSpectator: true,
    })
    createOverlay(target, () => {})
    onSpectate(table.id)
  }

  return (
    <div
      key={table.id}
      className={`relative rounded-xl shadow-lg shadow-black overflow-hidden ${getTableColor(table.ruleType, table.players.length, table.completed)} border-2 ${
        isCreator ? "border-yellow-400" : ""
      }`}
      style={{ maxWidth: "250px", fontSize: "0.6rem" }}
    >
      {/* Aspect Ratio Container */}
      <div className="relative" style={{ paddingTop: "50%" }}>
        <div className="absolute inset-0 flex flex-col p-3">
          {/* Felt surface */}
          <div
            className={`absolute inset-2 ${getFeltColor(table.ruleType, table.players.length, table.completed)} rounded-lg shadow-[inset_0_4px_5px_rgba(0,0,0,0.6)]`}
          ></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="text-center">
              <p className="text-white py-2 leading-tight">{table.ruleType}</p>
              <p
                className="text-white font-bold text-sm leading-tight"
                style={{ textShadow: "1px 1px 2px rgba(0, 0, 0, 0.4)" }}
              >
                {table.creator.name} vs{" "}
                {table.players.length > 1 ? table.players[1].name : "..."}
              </p>
            </div>
            <div className="flex space-x-2">
              {!isCreator && (
                <>
                  {table.players.length < 2 && (
                    <button
                      onClick={() => onJoin(table.id)}
                      className="flex-1 px-2 py-1 border border-white/50 rounded-lg bg-transparent hover:bg-gray-800/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50"
                      aria-label="Join Table"
                    >
                      <UserPlusIcon className="h-5 w-5 text-white" />
                    </button>
                  )}
                  <button
                    onClick={handleSpectate}
                    className="flex-1 flex items-center px-2 py-2 border border-white/50 rounded-lg bg-transparent hover:bg-gray-800/20 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-opacity-50"
                    aria-label="Spectate Table"
                  >
                    <EyeIcon className="h-5 w-5 text-white" />
                    <span className="text-white text-lg ml-2">
                      {table.spectators.length}
                    </span>
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
