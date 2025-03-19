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
 * Transcribes an audio buffer
 * @param {Buffer} audioBuffer - Audio file buffer
 */
export const transcribeLocalAudio = async (audioBuffer) => {
  try {
    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      transcriptionConfig
    );

    if (error) throw new Error(`Transcription failed: ${error.message}`);

    return processTranscriptionResult(result);
  } catch (error) {
    console.error("Error transcribing audio:", error);
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

/**
 * Converts text to speech
 * @param {string} text - Text to convert to speech
 */
export const deepgramSpeak = async (text) => {
  return deepgram.speak.request(
    { text },
    { model: "aura-asteria-en", encoding: "linear16", container: "wav" }
  );
};

/**
 * Converts a stream to an audio buffer
 * @param {ReadableStream} stream - Readable stream
 */
export const getAudioBuffer = async (stream) => {
  const reader = stream.getReader();
  const chunks = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return Buffer.concat(chunks);
};
