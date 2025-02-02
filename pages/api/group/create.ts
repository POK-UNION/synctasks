import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // Ensure prisma is configured correctly

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const { namaGroup, deskripsi } = req.body;

    console.log("Creating group with data:", { namaGroup, deskripsi });

    const newGroup = await prisma.group.create({
      data: { namaGroup, deskripsi },
    });

    res.status(201).json(newGroup);
  } catch (error) {
    console.error("Error creating group:", error.message, error.stack);
    res.status(500).json({ message: "Error creating group", error: error.message });
  }
}