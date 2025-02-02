import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // Ensure prisma is configured correctly

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const { groupID } = req.query;
    const members = await prisma.groupMember.findMany({
      where: { groupID: String(groupID) },
      include: { user: true },
    });
    res.status(200).json(members);
  } catch (error) {
    console.error("Error fetching group members:", error);
    res.status(500).json({ message: "Error fetching group members", error: error.message });
  }
}
