import { Leaderboard } from "../services/hiscore/leaderboard"

start()

async function start() {
  showLeaderboard()
}

async function showLeaderboard() {
  const res = await fetch("https://tailuge-billiards.cyclic.app/allscores")
  const json = await res.json()
  console.log(json)
  const leaderboard = new Leaderboard(json).ordered("snooker")
  const element = document.getElementById("leaderboard")!
  const table = `<table>
  ${leaderboard.map((item,i)=>row(item,i+1))}
  </table>`
  element.innerHTML = table
}

function row(item, index) {
  const link = `<a href="${item.props.shortUrl}">📺</a>`
  return `<tr>
  ${cell(icon(index))}
  ${cell(index)}
  ${cell(item.props.score)}
  ${cell(new Date(item.props.elapsed).toISOString()
    .substring(14, 19))}
  ${cell(item.props.initials)}
  ${cell(link)}
  </tr>`
}

function icon(index:number) {
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