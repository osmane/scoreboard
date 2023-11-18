import { Leaderboard } from "../services/hiscore/leaderboard"

const params = new URLSearchParams(location.search)
const id = params.get("id")

start()

async function start() {
  showLeaderboard(document.getElementById("snooker")!, "snooker", false)
  showLeaderboard(document.getElementById("nineball")!, "nineball", false)
  showLeaderboard(
    document.getElementById("threecushion")!,
    "threecushion",
    false
  )
  showLeaderboard(document.getElementById("fourteenone")!, "fourteenone", false)
  showLeaderboard(document.getElementById("snookerspeed")!, "snooker", true)
  scrollIntoView()
}

async function showLeaderboard(element, ruletype, wholeGame) {
  const res = await fetch("https://tailuge-billiards.cyclic.app/allscores")
  const json = await res.json()
  const leaderboard = new Leaderboard(json).ordered(ruletype, wholeGame)
  const table = `<table>
  ${leaderboard.map((item, i) => row(item, i + 1)).join("")}
  </table>`
  console.log(table)
  element.innerHTML = table
}

function row(item, index) {
  console.log(item)
  const link = `<a href="${item.props.shortUrl}">📺</a>`
  const trclass = item.key === id ? `class="highlight" id="highlight"` : ""
  return `<tr ${trclass}>
  ${cell(icon(index))}
  ${cell(index)}
  ${cell(item.props.score)}
  ${cell(new Date(item.props.elapsed).toISOString().substring(14, 19))}
  ${cell(item.props.initials)}
  ${cell(link)}
  </tr>`
}

function icon(index: number) {
  switch (index) {
    case 1:
      return "🏆"
    default:
      return ""
  }
}
function cell(value) {
  return `<td>${value}</td>`
}

function scrollIntoView() {
  const element = document.getElementById("highlight")
  if (element) {
    element.scrollIntoView()
  }
}
