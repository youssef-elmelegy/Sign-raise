import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createRoom,
  myRooms,
  getRoomByName,
} from "../controllers/Daily.controller.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * /api/daily/rooms:
 *   post:
 *     summary: Create a new room
 *     tags: [Daily]
 *     security:
 *       - BearerAuth: []
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
router.post("/rooms", verifyToken, createRoom);

/**
 * @swagger
 * /api/daily/myRooms:
 *  get:
 *    summary: Get all rooms created by the user
 *    tags: [Daily]
 *    security:
 *      - BearerAuth: []
 *    responses:
 *       200:
 *         description: Rooms fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "49b86388-b9e2-4c43-bb59-9c496aa32327"
 *                   userId:
 *                     type: string
 *                     example: "860c0d39-8b54-42b8-9b70-479b1bf8f799"
 *                   roomName:
 *                     type: string
 *                     example: "kokiii"
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-16T22:01:19.357Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-03-16T22:01:19.357Z"
 */
router.get("/myRooms", verifyToken, myRooms);

/**
 * @swagger
 * /api/daily/room/{roomName}:
 *   get:
 *     summary: Get room by name
 *     tags: [Daily]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomName
 *         required: true
 *         description: Name of the room
 *         schema:
 *           type: string
 *           example: hot-room
 *           default: hot-room
 *           format: string
 *           minLength: 1
 *           maxLength: 100
 *           pattern: "^[a-zA-Z0-9-_]*$"
 *     responses:
 *       200:
 *         description: Room fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "49b86388-b9e2-4c43-bb59-9c496aa32327"
 *                 userId:
 *                   type: string
 *                   example: "860c0d39-8b54-42b8-9b70-479b1bf8f799"
 *                 roomName:
 *                   type: string
 *                   example: "kokiii"
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-03-16T22:01:19.357Z"
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-03-16T22:01:19.357Z"
 */
router.get("/room/:roomName", verifyToken, getRoomByName);

export default router;
