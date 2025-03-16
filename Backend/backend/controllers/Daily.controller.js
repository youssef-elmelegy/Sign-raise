// import prisma from "../db/connectDB.js";
import { dailyAxios } from "../utils/dailyAxois.js";
import prisma from "../db/connectDB.js";

const __getUser = async (userId) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

}

const __createRoom = async (user, room) => {
  console.log(room);
  return prisma.userRoom.create({
    data: {
      userId: user.id,
      roomId: room.id,
    },
  });
}


export const createRoom = async (req, res) => {
  const { name, privacy, properties } = req.body;
  let data = ''

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
    const room = {
      name,
      privacy,
      properties,
    };

    dailyAxios.post("/rooms", room).then(async (res) => {
      data = res.data;
    }).catch((error) => {
      res.status(error.status).send(error.response.data);
    })
    const user = await __getUser(req.userId);
    if (! await __createRoom(user, data)) {
      res.status(401).json({ success: false, message: "User already exists" });
    }
    res.status(200).send(data);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}