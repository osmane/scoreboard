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

  const getTableClass = (
    ruleType: string,
    playerCount: number,
    completed: boolean
  ) => {
    if (playerCount >= 2)
      return completed ? "table-completed" : "table-occupied"
    return `table-${ruleType}` || "table-default"
  }

  const getFeltClass = (
    ruleType: string,
    playerCount: number,
    completed: boolean
  ) => {
    if (playerCount >= 2) return completed ? "felt-completed" : "felt-default"
    return `felt-${ruleType}` || "felt-default"
  }

  const handleSpectate = () => {
    const target = GameUrl.create({
      tableId: table.id,
      userName,
      userId,
      ruleType: table.ruleType,
      isSpectator: true,
      isCreator: false,
    })
    createOverlay(target, () => {})
    onSpectate(table.id)
  }

  return (
    <div
      className={`table-card ${getTableClass(table.ruleType, table.players.length, table.completed)} ${isCreator ? "table-card-creator" : ""}`}
    >
      <div className="table-container">
        <div className="table-inner">
          <div
            className={`table-felt ${getFeltClass(table.ruleType, table.players.length, table.completed)}`}
          ></div>
          <div className="table-content">
            <div className="text-center">
              <p className="table-title">{table.ruleType}</p>
              <p className="table-players">
                {table.creator.name} vs{" "}
                {table.players.length > 1 ? table.players[1].name : "..."}
              </p>
            </div>
            <div className="table-actions">
              {!isCreator && (
                <>
                  {table.players.length < 2 && (
                    <button
                      onClick={() => onJoin(table.id)}
                      className="table-button"
                      aria-label="Join Table"
                    >
                      <UserPlusIcon className="h-5 w-5 text-white" />
                    </button>
                  )}
                  {table.players.length >= 2 && (
                    <button
                      onClick={handleSpectate}
                      className="table-button"
                      aria-label="Spectate Table"
                    >
                      <EyeIcon className="h-5 w-5 text-white" />
                      <span className="table-spectator-count">
                        {table.spectators.length}
                      </span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="table-pocket table-pocket-top-left"></div>
          <div className="table-pocket table-pocket-top-right"></div>
          <div className="table-pocket table-pocket-bottom-left"></div>
          <div className="table-pocket table-pocket-bottom-right"></div>
          <div className="table-pocket-middle table-pocket-top"></div>
          <div className="table-pocket-middle table-pocket-bottom"></div>
        </div>
      </div>
    </div>
  )
}
