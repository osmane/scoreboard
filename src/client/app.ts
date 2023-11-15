//import { Chart} from "chart.js"
import {
  ChartOptions,
  ChartType,
  TimeScale,
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
} from "chart.js"
import "chartjs-adapter-luxon"
Chart.register(
  TimeScale,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title
)

start()

export async function start() {
  const response = await fetch("https://tailuge-billiards.cyclic.app/usage")
  const data = await response.json()
  const labels = data.map((item) => Date.parse(item.props.created))
  const snooker = data.map((item) => item.props.snooker ?? null)
  const nineball = data.map((item) => item.props.nineball ?? null)
  const fourteenone = data.map((item) => item.props.fourteenone ?? null)
  const threecushion = data.map((item) => item.props.threecushion ?? null)
  const total = data.map(
    (item) => (item.props.play ?? 0) + (item.props.replay ?? 0)
  )
  const multidata = {
    labels: labels,
    datasets: [
      {
        label: "Snooker",
        data: snooker,
      },
      {
        label: "3-Cushion",
        data: threecushion,
      },
      {
        label: "9-ball",
        data: nineball,
      },
      {
        label: "Straight pool",
        data: fourteenone,
      },
      {
        label: "Total games",
        data: total,
        borderWidth: 0.5,
      },
    ],
  }
  const lineType: ChartType = "line"
  const options: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        type: "time" as any,
        time: {
          unit: "day",
        },
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Games",
        },
      },
    },
  }

  const config = {
    type: lineType,
    data: multidata,
    options: options,
  }

  const ctx = document.getElementById("chart")! as HTMLCanvasElement
  new Chart(ctx, config)

  const res = await fetch("https://tailuge-billiards.cyclic.app/replay")
  const count = await res.json()
  const breaks = document.getElementById("breaks")!

  for (let i = 1; i < count; i++) {
    const node = document.createElement("a")
    node.href = `./replay/${i}`
    node.innerHTML = "🎱"
    breaks.appendChild(node)
  }
}
