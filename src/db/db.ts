export interface DbItem {
  collection?: string
  key?: string
  props?: any
}

export interface Db {
  delete(collection: string, key: string): Promise<boolean>
  set(collection: string, key: string, props: any): Promise<DbItem>
  get(collection: string, key: string): Promise<DbItem>
  list(collection: string): Promise<DbItem[]>
}
