import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // Ensure prisma is configured correctly

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "DELETE") return res.status(405).json({ message: "Method Not Allowed" });

  try {
    const { groupID, userID } = req.body;
    await prisma.groupMember.deleteMany({
      where: { groupID: groupID, userID: userID },
    });

    res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Error removing member:", error);
    res.status(500).json({ message: "Error removing member", error: error.message });
  }
}
