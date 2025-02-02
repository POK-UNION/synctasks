import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // Ensure prisma is configured correctly

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const { groupID } = req.query;
      console.log("Fetching messages for groupID:", groupID);

      let messages: any[];
      if (groupID !== undefined) {
        messages = await prisma.message.findMany({
          where: { groupID: groupID ? Number(groupID) : null },
          orderBy: { createdAt: 'asc' }
        });
      } else {
        messages = await prisma.message.findMany({
          orderBy: { createdAt: 'asc' }
        });
      }

      // Return an empty array if no messages are found
      if (!messages || messages.length === 0) {
        console.log("No messages found");
        messages = [];
      }

      res.status(200).json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Error fetching messages", error: error instanceof Error ? error.message : "Unknown error" });
    }
  } else if (req.method === "POST") {
    try {
      const { sender, content, groupID } = req.body;
      if (!sender) {
        throw new Error("Sender is required");
      }
      console.log("Creating message with data:", { sender, content, groupID }); // Log received data

      const newMessage = await prisma.message.create({
        data: { sender, content, groupID: groupID ? Number(groupID) : null },
      });

      if (!newMessage) {
        throw new Error("Failed to create message");
      }

      res.status(201).json(newMessage);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Error creating message", error: error instanceof Error ? error.message : "Unknown error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}