import JSONCrush from "jsoncrush"
const a = { x: 1, y: 2 }

console.log(JSON.stringify(a))
console.log(JSONCrush.crush(JSON.stringify(a)))

const embed = document.getElementById("embed")! as HTMLIFrameElement
embed.src =
  "https://tailuge.github.io/billiards/dist/embed.html" + location.search
