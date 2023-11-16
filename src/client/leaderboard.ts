import { Leaderboard } from "../services/hiscore/leaderboard"

start()

async function start() {
  showLeaderboard()
}

async function showLeaderboard() {
  const res = await fetch("https://tailuge-billiards.cyclic.app/allscores")
  const json = await res.json()
  console.log(json)
  const leaderboard = new Leaderboard(json)
  const element = document.getElementById("leaderboard")!
  element.innerHTML = JSON.stringify(leaderboard.ordered("snooker"))
}
