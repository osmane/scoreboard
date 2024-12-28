import { StarIcon as SolidStarIcon } from "@heroicons/react/24/solid"
import { StarIcon as OutlineStarIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

export function Title() {
  const [clicked, setClicked] = useState(false)

  const openRepo = () => {
    window.open("https://github.com/tailuge/billiards", "_blank")
    setClicked(true)
  }

  return (
    <button
      onClick={openRepo}
      onKeyDown={openRepo}
      className={`px-1 py-1 transition-all duration-300 text-sm text-gray-600 ${clicked ? "bg-green-200" : "bg-gray-100"} hover:text-yellow-500 transition-all duration-300 rounded cursor-pointer flex items-center justify-center relative`}
    >
      {clicked ? (
        <SolidStarIcon className="w-4 h-4 text-yellow-500 z-10" />
      ) : (
        <OutlineStarIcon className="w-4 h-4 text-yellow-500 z-20 transition-all duration-300               hover:text-yellow-500               hover:scale-110               hover:drop-shadow-2xl " />
      )}
    </button>
  )
}
