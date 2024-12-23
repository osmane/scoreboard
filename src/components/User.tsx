import React from "react"

interface UserPillProps {
  userName: string
  userId: string
}

export function User({ userName, userId }: UserPillProps) {
  return (
    <div
      className="hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-1 rounded 
                    bg-gray-50 dark:bg-gray-800 cursor-pointer transition-colors
                    text-sm font-medium text-gray-700 dark:text-gray-300"
      title={`${userName}\n${userId}`}
    >
      {userName}
    </div>
  )
}

export default User
