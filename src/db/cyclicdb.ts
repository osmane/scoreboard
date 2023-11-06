import db from "@cyclic.sh/dynamodb"

export class CyclicDb implements Db {
  readonly opts = {}

  set(collection: string, key: string, props: any): Promise<DbItem> {
    return db.collection(collection).set(key, props, this.opts)
  }

  async list(collection: string): Promise<DbItem[]> {
    return db
      .collection(collection)
      .list()
      .then((i) => {
        return i.results
      })
      .catch((_) => {
        return []
      })
  }
}
