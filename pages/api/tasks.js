import { prisma } from '../../lib/prisma';

export default async (req, res) => {
  switch (req.method) {
    case 'GET':
      const tasks = await prisma.task.findMany();
      res.json(tasks);
      break;
    case 'POST':
      const newTask = req.body;
      const createdTask = await prisma.task.create({ data: newTask });
      res.json(createdTask);
      break;
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
};
