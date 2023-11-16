import JSONCrush from "jsoncrush"

start()

async function start() {
  showReplay()
  actionHandler()
  reportInfo()
}

function showReplay() {
  const link = "https://tailuge.github.io/billiards/dist/embed.html"
  const embed = document.getElementById("embed")! as HTMLIFrameElement
  embed.src = link + location.search
}

function reportInfo() {
  const params = new URLSearchParams(location.search)
  const replay = params.get("state")!
  const ruletype = params.get("ruletype") ?? "nineball"
  const breakState = parse(decodeURIComponent(replay))
  const elapsed = new Date(breakState.now - breakState.start)
    .toISOString()
    .substring(14, 19)
  const info = document.getElementById("info")!
  info.innerHTML = `${ruletype} break of ${breakState.score} in ${elapsed}`
}

function parse(s) {
  try {
    return JSON.parse(s)
  } catch (_) {
    return JSON.parse(JSONCrush.uncrush(s))
  }
}

function actionHandler() {
  const submit = document.getElementById("submit")! as HTMLButtonElement
  submit.onclick = () => {
    submitHiscore()
  }
}

async function submitHiscore() {
  const params = new URLSearchParams(location.search)
  const replay = params.get("state")!
  const breakState = parse(decodeURIComponent(replay))
  const initials = document.getElementById("initials")! as HTMLInputElement
  const res = await fetch(`./hiscore${location.search}`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      initials: initials.value || "...",
      score: breakState.score,
      start: breakState.start,
      now: breakState.now,
    }),
  })
  const result = await res.json()
  console.log(result)
}
