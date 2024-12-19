import RedisMock from "ioredis-mock"

// Create an adapter class for Vercel KV
export class MockVercelKVAdapter {
  private mockRedis: RedisMock

  constructor() {
    this.mockRedis = new RedisMock()
  }

  /**
   * Adapter function to match @vercel/kv's zadd signature using ioredis-mock's zadd.
   * @param key - The name of the sorted set.
   * @param scoreMembers - An array of objects containing score and member.
   * @returns A promise that resolves to the number of elements added to the sorted set.
   */
  async zadd(
    key: string,
    ...scoreMembers: { score: number; member: any }[]
  ): Promise<number> {
    // Prepare arguments for ioredis-mock's zadd
    const args: (string | number)[] = []
    for (const { score, member } of scoreMembers) {
      args.push(score, JSON.stringify(member))
    }

    // Call ioredis-mock's zadd with the prepared arguments
    return this.mockRedis.zadd(key, ...args)
  }

  /**
   * Adapter function to match @vercel/kv's zrange signature using ioredis-mock's zrange.
   * @param key - The name of the sorted set.
   * @param start - The starting index.
   * @param stop - The stopping index.
   * @param options - Optional parameters to include scores.
   * @returns A promise that resolves to an array of members or an array of [member, score] tuples.
   */
  async zrange(
    key: string,
    start: number,
    stop: number,
    options?: { withScores?: boolean }
  ): Promise<string[] | [string, number][]> {
    // Determine if scores should be included
    const withScores = options?.withScores ?? false

    // Call ioredis-mock's zrange with or without 'WITHSCORES'
    const result = withScores
      ? await this.mockRedis.zrange(key, start, stop, "WITHSCORES")
      : await this.mockRedis.zrange(key, start, stop)

    // If WITHSCORES was used, process the result into [member, score] tuples
    if (withScores) {
      const tuples: [string, number][] = []
      for (let i = 0; i < result.length; i += 2) {
        const member = result[i]
        const score = parseFloat(result[i + 1])
        tuples.push([member, score])
      }
      return tuples
    }

    // If no scores, parse the stringified JSON back into an object
    return result.map((item) => {
      try {
        return JSON.parse(item)
      } catch (e) {
        return item
      }
    })
  }

  /**
   * Adapter function to match @vercel/kv's zremrangebyrank signature using ioredis-mock's zremrangebyrank.
   * @param key - The name of the sorted set.
   * @param start - The starting rank.
   * @param stop - The stopping rank.
   * @returns A promise that resolves to the number of elements removed from the sorted set.
   */
  async zremrangebyrank(
    key: string,
    start: number,
    stop: number
  ): Promise<number> {
    // Call ioredis-mock's zremrangebyrank with the provided parameters
    return this.mockRedis.zremrangebyrank(key, start, stop)
  }

  async printMockRedisData() {
    try {
      // Retrieve all keys
      const keys = await this.mockRedis.keys("*")

      // Iterate over each key and retrieve its value
      for (const key of keys) {
        // Determine the type of the key to handle it appropriately
        const type = await this.mockRedis.type(key)

        let value
        switch (type) {
          case "string":
            value = await this.mockRedis.get(key)
            break
          case "hash":
            value = await this.mockRedis.hgetall(key)
            break
          case "list":
            value = await this.mockRedis.lrange(key, 0, -1)
            break
          case "set":
            value = await this.mockRedis.smembers(key)
            break
          case "zset":
            value = await this.mockRedis.zrange(key, 0, -1, "WITHSCORES")
            break
          default:
            value = "Unknown type"
        }

        console.log(`Key: ${key}, Type: ${type}, Value:`, value)
      }
    } catch (error) {
      console.error("Error retrieving data from mockRedis:", error)
    }
  }
}
