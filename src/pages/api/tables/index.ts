import { NextApiRequest, NextApiResponse } from "next"
import TableService from "@/services/TableService"

const tableService = new TableService()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const tables = await tableService.getTables()
    res.status(200).json(tables)
  } else if (req.method === "POST") {
    const { userId, userName } = req.body
    const newTable = await tableService.createTable(userId, userName)
    res.status(201).json(newTable)
  }
}
