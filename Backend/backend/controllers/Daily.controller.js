// import prisma from "../db/connectDB.js";
import { dailyAxios } from "../utils/dailyAxois.js";


export const createRoom = async (req, res) => {
  const { name, privacy, properties } = req.body;

  try {
    if (!name) {
      throw new Error("Name is required");
    }
    if (!privacy) {
      throw new Error("Privacy is required");
    }
    if (!properties) {
      throw new Error("Properties is required");
    }

    const room = {
      name,
      privacy,
      properties,
    };

    const { data: newRoom } = await dailyAxios.post("/rooms", room);

    res.status(201).json({
      success: true,
      message: "Room created successfully",
      room: newRoom,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}