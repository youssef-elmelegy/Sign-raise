import { dailyAxios } from "../utils/dailyAxois.js";
import prisma from "../db/connectDB.js";

const __getUser = async (userId) => {
  return prisma.user.findUnique({
    where: { id: userId },
  });
};

const __createRoom = async (user, room) => {
  console.log(`the data: ${room}`);
  return prisma.userRoom.create({
    data: {
      userId: user.id,
      roomId: room.id,
    },
  });
};

export const createRoom = async (req, res) => {
  const { name, privacy, properties } = req.body;

  // Validate input early
  if (!name) {
    return res.status(400).json({ success: false, message: "Name is required" });
  }
  if (!privacy) {
    return res.status(400).json({ success: false, message: "Privacy is required" });
  }
  if (!properties) {
    return res.status(400).json({ success: false, message: "Properties is required" });
  }

  try {
    const room = { name, privacy, properties };

    // Use async/await without mixing .then()/.catch()
    const response = await dailyAxios.post("/rooms", room);
    const data = response.data;

    // Continue with room creation in your DB
    const user = await __getUser(req.userId);
    await __createRoom(user, data);

    // Send final success response
    return res.status(200).send(data);
  } catch (error) {
    // Handle Axios error responses or any other error gracefully
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    return res.status(400).json({ success: false, message: error.message });
  }
};
