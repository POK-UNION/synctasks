import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // Pastikan prisma sudah dikonfigurasi

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const { namaGroup, deskripsi } = req.body;
    const newGroup = await prisma.group.create({
      data: { namaGroup, deskripsi },
    });

    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: "Error creating group", error });
  }
}
