interface Db {
  //    delete(collection: string, key: string): Promise<boolean>
  //    set(collection: string, key: string, value: string): Promise<string>
  list(collection: string): Promise<string[]>
}
