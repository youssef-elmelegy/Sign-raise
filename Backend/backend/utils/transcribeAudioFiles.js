import fs from "fs";
import { createClient } from "@deepgram/sdk";
import dotenv from "dotenv";
dotenv.config();

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

const transcriptionConfig = {
  model: "nova-3",
  smart_format: true,
  utterances: false,
  punctuate: true,
  diarize: true,
};

/**
 * Transcribes a local audio file
 * @param {string} filePath - Path to local audio file
 */
export const transcribeLocalAudio = async (filePath) => {
  try {
    const audioBuffer = fs.readFileSync(filePath);
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      transcriptionConfig
    );

    if (error) throw new Error(`Transcription failed: ${error.message}`);

    return processTranscriptionResult(result);
  } catch (error) {
    console.error("Error transcribing local audio:", error);
    throw error;
  }
};

/**
 * Processes and formats the transcription result
 * @param {object} result - Raw Deepgram API response
 */
function processTranscriptionResult(result) {
  const { transcript, confidence, words } =
    result.results.channels[0].alternatives[0];

  return {
    metadata: {
      duration: result.metadata.duration,
      model: result.metadata.model_info,
      requestId: result.metadata.request_id,
    },
    transcript,
    confidence,
    words: words.map((word) => ({
      text: word.punctuated_word,
      start: word.start,
      end: word.end,
      confidence: word.confidence,
    })),
  };
}
