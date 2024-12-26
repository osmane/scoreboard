import { NextApiRequest, NextApiResponse } from "next"
import { TableService } from "@/services/TableService"

const tableService = new TableService()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { tableId } = req.query

  if (req.method === "PUT") {
    try {
      const table = await tableService.completeTable(tableId as string)
      res.status(200).json(table)
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  } else {
    res.status(405).json({ error: "Method not allowed" })
  }
}
