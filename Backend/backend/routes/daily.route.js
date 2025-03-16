import express from "express";
import { createRoom } from "../controllers/Daily.controller.js";

const router = express.Router();


/**
  * @swagger
  * /api/daily/rooms:
  *   post:
  *     summary: Create a new room
  *     tags: [Daily]
  *     requestBody:
  *       required: true
  *       content:
  *         application/json:
  *           schema:
  *             type: object
  *             properties:
  *               name:
  *                 type: string
  *                 example: hot-room
  *                 description: Name of the room
  *               privacy:
  *                 type: string
  *                 example: public
  *                 description: Privacy of the room
  *                 enum: [public, private]
  *                 default: public
  *               properties:
  *                 type: object
  *                 example: {}
  *                 description: Properties of the room
  *     responses:
  *       201:
  *         description: Room created successfully
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                     id:
  *                       type: string
  *                       example: e0f4d14b-aa66-4af5-b631-4e39e3aeee07
  *                       description: Room ID
  *                     name:
  *                       type: string
  *                       example: hot-room
  *                       description: Name of the room
  *                     api_created:
  *                       type: boolean
  *                       example: true
  *                       description: Indicates if the room was created via API
  *                     privacy:
  *                       type: string
  *                       example: public
  *                       description: Privacy of the room
  *                     url:
  *                       type: string
  *                       example: https://sharelife.daily.co/hot-room
  *                       description: URL of the room
  *                     created_at:
  *                       type: string
  *                       format: date-time
  *                       example: 2025-03-15T00:48:11.000Z
  *                       description: Creation timestamp
  *                     config:
  *                       type: object
  *                       example: {}
  *                       description: Configuration of the room
  *       400:
  *         description: Bad Request
  *         content:
  *           application/json:
  *             schema:
  *               type: object
  *               properties:
  *                 error:
  *                   type: string
  *                   example: invalid-request-error
  *                   description: Error type
  *                 info:
  *                   type: string
  *                   example: a room named hot-room1 already exists
  *                   description: Error information
  */
router.post("/rooms", createRoom);

export default router;