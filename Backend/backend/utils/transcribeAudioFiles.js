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
 * Processes and formats the transcription result from the Deepgram API.
 * @param {object} result - Raw Deepgram API response.
 * @returns {object} Processed transcription result.
 */
function processTranscriptionResult(result) {
  const { transcript, confidence, words } =
    result.results.channels[0].alternatives[0];

  const sentences = [];
  let currentSentence = [];
  let sentenceStart = words[0]?.start || 0;
  let sentenceEnd = words[0]?.end || 0;
  const silenceThreshold = 0.5;
  const maxDuration = 10;

  for (const [index, word] of words.entries()) {
    if (index === 0) {
      currentSentence.push(word);
      continue;
    }

    const previousWord = words[index - 1];
    const gap = word.start - previousWord.end;
    const potentialDuration = word.end - sentenceStart;

    if (gap > silenceThreshold || potentialDuration >= maxDuration) {
      sentences.push({
        start: sentenceStart,
        end: sentenceEnd,
        text: currentSentence.map((w) => w.punctuated_word).join(" "),
        duration: sentenceEnd - sentenceStart,
      });

      currentSentence = [word];
      sentenceStart = word.start;
      sentenceEnd = word.end;
    } else {
      currentSentence.push(word);
      sentenceEnd = word.end;
    }
  }

  if (currentSentence.length > 0) {
    sentences.push({
      start: sentenceStart,
      end: sentenceEnd,
      text: currentSentence.map((w) => w.punctuated_word).join(" "),
      duration: sentenceEnd - sentenceStart,
    });
  }

  return {
    metadata: {
      duration: result.metadata.duration,
      model: result.metadata.model_info,
      requestId: result.metadata.request_id,
    },
    transcript,
    sentences,
    confidence,
    words: words.map((word) => ({
      text: word.punctuated_word,
      start: word.start,
      end: word.end,
      confidence: word.confidence,
    })),
  };
}
