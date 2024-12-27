export function Title() {
  const openRepo = () => {
    window.open("https://github.com/tailuge/billiards", "_blank")
  }

  return (
    <button
      onClick={openRepo}
      onKeyDown={openRepo}
      className="px-2 py-1 text-sm text-gray-600 hover:text-yellow-500 hover:shadow-lg hover:shadow-yellow-200/50 transition-all duration-300 bg-gray-100 rounded cursor-pointer"
    >
      🟊
    </button>
  )
}
