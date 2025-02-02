import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // Ensure prisma is configured correctly

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { groupID } = req.query;
      console.log("Fetching messages for groupID:", groupID);

      let messages;
      if (groupID) {
        messages = await prisma.message.findMany({
          where: { groupID: groupID as string },
          orderBy: { createdAt: 'asc' }
        });
      } else {
        messages = await prisma.message.findMany({
          where: { groupID: null },
          orderBy: { createdAt: 'asc' }
        });
      }

      if (!messages || messages.length === 0) {
        console.log("No messages found");
        res.status(200).json([]); // Return an empty array if no messages are found
        return;
      }

      res.status(200).json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Error fetching messages", error: error instanceof Error ? error.message : "Unknown error" });
    }
  } else if (req.method === "POST") {
    try {
      const { sender, content, groupID } = req.body;
      console.log("Creating message with data:", { sender, content, groupID });

      const newMessage = await prisma.message.create({
        data: { sender, content, groupID: groupID ? groupID : null },
      });

      if (!newMessage) {
        console.log("Failed to create message");
        res.status(500).json({ message: "Failed to create message" });
        return;
      }

      res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Error creating message", error: error instanceof Error ? error.message : "Unknown error" });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}