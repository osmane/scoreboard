export interface DbItem {
  input?: string
}

export interface Db {
  incr(key: string): Promise<number>
  set(key: string, value: any)
  //<any>(key: string, value: any, opts?: SetCommandOptions) => Promise<any>
  get(key: string): Promise<DbItem | null>
  //<TData>(key: string) => Promise<TData | null>
}
