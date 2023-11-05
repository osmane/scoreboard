export class LocalDb implements Db {
  store = new Map<string, string>()

  list(collection: string): Promise<string[]> {
    return new Promise<string[]>((res, rej) => {
      res(["game1"])
      return
    })
  }
}
