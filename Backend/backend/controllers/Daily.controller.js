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

    dailyAxios.post("/rooms", room).then(async (response) => {
      res.status(200).send(response.data);
    }).catch((error) => {
      res.status(error.status).send(error.response.data);
    })

  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}