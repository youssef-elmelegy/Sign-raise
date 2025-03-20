import {
  deepgramSpeak,
  getAudioBuffer,
  transcribeLocalAudio,
} from "../utils/transcribeAudioFiles.js";

const allowedTypes = [
  "audio/mpeg",
  "audio/wav",
  "audio/webm",
  "audio/mp3",
  "audio/mpg",
  "audio/x-mpeg",
  "audio/x-mp3",
];

export const transcribeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    if (req.file.size > 10 * 1024 * 1024) {
      return res.status(413).json({ error: "File size exceeds 10MB limit" });
    }

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(415).json({ error: "Unsupported file type" });
    }

    const result = await transcribeLocalAudio(req.file.buffer);

    res.status(200).send(result);
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const textToVoice = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    const response = await deepgramSpeak(text);

    const stream = await response.getStream();
    const audioBuffer = await getAudioBuffer(stream);

    res.setHeader("Content-Type", "audio/wav");
    res.send(audioBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate speech" });
  }
};
