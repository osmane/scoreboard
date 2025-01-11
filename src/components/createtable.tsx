import { useState, useEffect, useRef } from "react"

export function CreateTable({
  userId,
  userName,
  onCreate,
}: {
  readonly userId: string
  readonly userName: string
  readonly onCreate: () => void
}) {
  const [isLoading, setIsLoading] = useState(false)
  const [ruleType, setRuleType] = useState("nineball")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleCreate = async () => {
    setIsLoading(true)
    try {
      await fetch("/api/tables", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, userName, ruleType }),
      })
      onCreate()
    } finally {
      setIsLoading(false)
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="game-button-group">
      <div className="flex items-stretch">
        <button
          onClick={handleCreate}
          disabled={isLoading}
          className={`game-button-main ${
            isLoading ? "game-button-disabled" : "game-button-enabled"
          }`}
        >
          Play {ruleType.charAt(0).toUpperCase() + ruleType.slice(1)}
        </button>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="game-button-dropdown game-button-enabled"
        >
          ▼
        </button>
      </div>
      {dropdownOpen && (
        <div ref={dropdownRef} className="game-dropdown">
          <ul className="game-dropdown-list">
            {["nineball", "snooker", "threecushion"].map((type) => (
              <li
                key={type}
                className={`game-dropdown-item ${
                  ruleType === type ? "game-dropdown-item-selected" : ""
                }`}
                onClick={() => {
                  setRuleType(type)
                  setDropdownOpen(false)
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
