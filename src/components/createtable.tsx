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
    <div className="inline-block text-left relative">
      <div className="flex items-stretch">
        <button
          onClick={handleCreate}
          disabled={isLoading}
          className={`px-4 py-1 text-white rounded-l-md flex items-center ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-indigo-500 hover:bg-indigo-600"
          }`}
        >
          Play {ruleType.charAt(0).toUpperCase() + ruleType.slice(1)}
        </button>
        <button
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="px-2 py-1 text-white bg-indigo-500 hover:bg-indigo-600 rounded-r-md flex items-center justify-center border-l border-indigo-400"
        >
          ▼
        </button>
      </div>
      {dropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute mt-1 bg-indigo-500 rounded-md shadow-lg z-[100] min-w-full"
        >
          <ul className="py-1">
            {["nineball", "snooker", "threecushion"].map((type) => (
              <li
                key={type}
                className={`px-4 py-2 text-white cursor-pointer hover:bg-indigo-600 ${
                  ruleType === type ? "font-semibold" : ""
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
