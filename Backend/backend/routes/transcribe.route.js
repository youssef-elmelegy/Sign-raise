import express, { text } from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import upload from "../config/multer.config.js";
import {
  textToVoice,
  transcribeFile,
} from "../controllers/transcribe.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/trans/transcribe:
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

/**
 * @swagger
 * /api/trans/text-to-voice:
 *   post:
 *     summary: Convert text to speech
 *     description: Converts the provided text into speech and returns an audio file.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 description: The text to be converted into speech.
 *     responses:
 *       200:
 *         description: Successfully generated speech.
 *         content:
 *           audio/wav:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Bad request. Text is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Text is required"
 *       500:
 *         description: Internal server error. Failed to generate speech.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to generate speech"
 */

router.post("/text-to-voice", verifyToken, textToVoice);

export default router;
