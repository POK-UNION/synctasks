import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // Pastikan prisma dikonfigurasi dengan benar

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const groups = await prisma.group.findMany();
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: "Error fetching groups", error });
  }
}
