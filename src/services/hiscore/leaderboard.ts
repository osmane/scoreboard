import { DbItem } from "../../db/db"

export class Leaderboard {
  readonly items
  constructor(items: DbItem[]) {
    this.items = items
  }

  ordered(ruletype: string, wholeGame: boolean): DbItem[] {
    return this.items
      .map((item) => {
        if (item.props.score === 0) {
          item.props.score = 9
        }
        return item
      })
      .filter(
        (item) =>
          item.props.ruletype === ruletype &&
          (item.props?.wholeGame ?? false) === wholeGame
      )
      .sort((a, b) => this.sort(a, b))
  }

  sort(a, b) {
    if (a.props.score < b.props.score) {
      return 1
    }
    if (a.props.score > b.props.score) {
      return -1
    }
    if (a.props?.time < b.props?.time) {
      return 1
    }
    if (a.props?.time > b.props?.time) {
      return -1
    }
    return 0
  }
}
