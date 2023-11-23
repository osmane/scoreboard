import { Leaderboard } from "../services/hiscore/leaderboard"

const params = new URLSearchParams(location.search)
const id = params.get("id")

start()

async function start() {
  showAll()
  scrollIntoView()
}

async function showAll() {
  const res = await fetch("https://tailuge-billiards.cyclic.app/allscores")
  const json = await res.json()
  console.log(json)
  const elements = document.getElementsByClassName("leaderboard")
  for (let i = 0; i < elements.length; i++) {
    generate(json, elements.item(i) as HTMLDivElement)
  }
}

function generate(json, element: HTMLDivElement) {
  const ruletype = element?.getAttribute("data-ruletype")
  const wholeGame = element?.getAttribute("data-wholeGame") === "true"
  showLeaderboard(json, element, ruletype, wholeGame)
}

async function showLeaderboard(json, element, ruletype, wholeGame) {
  const link = "https://tailuge.github.io/billiards/dist/?ruletype=" + ruletype
  const leaderboard = new Leaderboard(json).ordered(ruletype, wholeGame)
  const table = `<table>
  <caption>${ruletype} ${wholeGame ? " total clearance" : " high break"}
  <a class="pill" href="${link}">&</a>
  </caption>
  ${thead()}
  <tbody>
  ${leaderboard.map((item, i) => row(item, i + 1)).join("")}
  </tbody>
  </table>`
  element.innerHTML = table
}

function thead() {
  return `<thead>
    <tr>
    <th></th>
    <th>rank</th>
    <th>score</th>
    <th>time</th>
    <th></th>
    <th></th>
    </tr>
    </thead>`
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
