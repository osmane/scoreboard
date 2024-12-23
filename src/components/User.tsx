import React, { useState } from "react"

interface UserPillProps {
  userName: string
  userId: string
  onUserNameChange: (newUserName: string) => void
}

export function User({ userName, userId, onUserNameChange }: UserPillProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [newUserName, setNewUserName] = useState(userName)

  const handleSave = () => {
    onUserNameChange(newUserName)
    setIsEditing(false)
  }

  return (
    <div
      className="hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1 rounded 
                    bg-gray-50 dark:bg-gray-800 cursor-pointer transition-colors
                    text-sm font-medium text-gray-700 dark:text-gray-300"
      title={`${userName}\n${userId}`}
      onClick={() => setIsEditing(true)}
    >
      {isEditing ? (
        <input
          type="text"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
          className="bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
        />
      ) : (
        userName
      )}
    </div>
  )
}

export default User
