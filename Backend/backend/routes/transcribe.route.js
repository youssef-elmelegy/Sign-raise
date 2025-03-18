import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../config/multer.config.js";
import { transcribeFile } from "../controllers/transcribe.controller.js";

const router = express.Router();

/**
 * @swagger
 * /transcribe:
 *   post:
 *     summary: Transcribe an audio file
 *     description: Transcribe an audio file to text
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               audio:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Transcription successful
 *       400:
 *         description: No file uploaded
 *       413:
 *         description: File size exceeds 10MB limit
 *       415:
 *         description: Unsupported file type
 *       500:
 *         description: Internal server error
 */

router.post("/transcribe", verifyToken, upload.single("audio"), transcribeFile);

export default router;
