import { NextApiRequest, NextApiResponse } from "next";
import { kv } from "@vercel/kv";
import { Table } from "@/services/table";
import { tableService } from "@/services/TableService"; // TableService'i import ediyoruz

const TABLES_KEY = "tables";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { tableId } = req.query;

  if (req.method === "GET") {
    try {
      const table = await kv.hget<Table>(TABLES_KEY, tableId as string);
      if (!table) {
        return res.status(404).json({ error: "Table not found" });
      }
      return res.status(200).json(table);
    } catch (error) {
      return res.status(500).json({ error: "Failed to fetch table" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { userId } = req.body;
      const table: Table | null = await kv.hget<Table>(TABLES_KEY, tableId as string);

      if (!table) {
        return res.status(404).json({ error: "Table not found" });
      }

      if (table.creator.id !== userId) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      await tableService.deleteTable(tableId as string); // tableService'i kullanıyoruz
      return res.status(200).json({ success: true });
    } catch (error) {
      return res.status(500).json({ error: "Failed to delete table" });
    }
  }

  // Diğer methodlara izin verilmediğini belirtiyoruz
  res.setHeader('Allow', ['GET', 'DELETE']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}