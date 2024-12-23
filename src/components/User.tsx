import React, { useState, useRef, useEffect } from "react"
import { UserIcon } from "@heroicons/react/24/solid"

interface UserPillProps {
  userName: string
  userId: string
  onUserNameChange: (newUserName: string) => void
}

export function User({ userName, userId, onUserNameChange }: UserPillProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newUserName, setNewUserName] = useState(userName)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleSave = () => {
    onUserNameChange(newUserName)
    setIsEditing(false)
  }

  return (
    <div
      className="hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1 rounded 
                    bg-green-200 dark:bg-green-900/10 cursor-pointer transition-colors
                    text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
      title={`${userName}\n${userId}`}
      onClick={() => setIsEditing(true)}
    >
      <UserIcon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={newUserName}
          maxLength={12}
          onChange={(e) => setNewUserName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          className="bg-transparent text-gray-700 dark:text-gray-300 outline-none w-full"
        />
      ) : (
        userName
      )}
    </div>
  )
}

export default User
