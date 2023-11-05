import db from "@cyclic.sh/dynamodb"

export class CyclicDb implements Db {
  readonly opts = {}

  list(collection: string): Promise<string[]> {
    return db
      .collection(collection)
      .list()
      .then((i) => {
        return [i.results.values.toString()]
      })
      .catch((_) => {
        return [""]
      })
  }

  async set(collection: string, key: string, value: string): Promise<boolean> {
    return db
      .collection(collection)
      .set(key, value, this.opts)
      .then((_) => {
        return true
      })
      .catch((_) => {
        return false
      })
  }
}
