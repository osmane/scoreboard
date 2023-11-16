start()

async function start() {
  showLeaderboard()
}

async function showLeaderboard() {
  const res = await fetch("https://tailuge-billiards.cyclic.app/allscores")
  const data = await res.json()
  console.log(data)
  const leaderboard = document.getElementById("leaderboard")!
  leaderboard.innerHTML = JSON.stringify(data)
}
