export function Title() {
  const openRepo = () => {
    window.open("https://github.com/tailuge/billiards", "_blank")
  }

  return (
    <div
      role="button"
      onClick={openRepo}
      onKeyDown={openRepo}
      className="px-2 py-1 text-sm text-gray-600 bg-gray-100 rounded cursor-pointer"
    >
      🟊
    </div>
  )
}
