<template>
  <div>
    <main class="py-16 px-4">
      <div class="container mx-auto">
        <!-- Hero Section -->
        <TranscriptionHero />

        <!-- Main Content -->
        <div class="max-w-5xl mx-auto">
          <div class="flex flex-col lg:flex-row items-start gap-12">
            <!-- Left Column - Info -->
            <TranscriptionInfo class="lg:w-2/5" />

            <!-- Right Column - Upload & Results -->
            <div class="lg:w-3/5 w-full">
              <!-- Upload Container -->
              <FileUploader @file-selected="handleFileSelected" @transcribe="transcribeFile" @error="handleError"
                :selectedFile="selectedFile" :isTranscribing="isTranscribing" :progress="progress" />

              <!-- Results Container -->
              <TranscriptionResults v-if="transcriptionResult" :transcriptionResult="transcriptionResult"
                @download-text="downloadTranscriptAsText" @download-subtitle="downloadTranscriptAsSubtitle" />

              <!-- Error Message -->
              <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mt-4">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" x2="12" y1="8" y2="12" />
                    <line x1="12" x2="12.01" y1="16" y2="16" />
                  </svg>
                  <span>{{ error }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import TranscriptionHero from '@/components/transcription/TranscriptionHero.vue';
import TranscriptionInfo from '@/components/transcription/TranscriptionInfo.vue';
import FileUploader from '@/components/transcription/FileUploader.vue';
import TranscriptionResults from '@/components/transcription/TranscriptionResults.vue';
import apiClient from "~/utils/apiClient";

// State variables
const selectedFile = ref(null);
const isTranscribing = ref(false);
const progress = ref(0);
const transcriptionResult = ref(null);
const error = ref(null);

// API endpoint
const API_URL = '/api/trans/transcribe';

// Handle file selection from child component
const handleFileSelected = (file) => {
  selectedFile.value = file;
  error.value = null;
};

// Handle errors from child components
const handleError = (errorMessage) => {
  error.value = errorMessage;
};

// Transcribe the selected file
const transcribeFile = async () => {
  if (!selectedFile.value) {
    error.value = "Please select an audio or video file";
    return;
  }

  error.value = null;
  isTranscribing.value = true;
  progress.value = 10;

  const formData = new FormData();
  formData.append("audio", selectedFile.value);

  try {
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      if (progress.value < 90) {
        progress.value += 5;
      }
    }, 500);

    // Make the API request using apiClient instead of fetch
    const response = await apiClient.post(API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        // Use actual upload progress if available
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        progress.value = Math.min(90, percentCompleted); // Cap at 90% until processing is done
      }
    });

    clearInterval(progressInterval);
    progress.value = 100;

    // With apiClient, we can directly access the data
    const data = response.data;
    console.log("Received data:", data);

    // Set the transcription result
    transcriptionResult.value = {
      transcript: data.transcript,
      words: data.words
    };

  } catch (err) {
    console.error("Transcription error:", err);
    // Extract error message from axios error
    const errorMessage = err.response?.data?.error || err.message || "An error occurred during transcription";
    error.value = errorMessage;
  } finally {
    setTimeout(() => {
      isTranscribing.value = false;
    }, 500);
  }
};

// Download transcript as a text file
const downloadTranscriptAsText = () => {
  if (!transcriptionResult.value || !transcriptionResult.value.transcript) return;

  const transcript = transcriptionResult.value.transcript;
  const blob = new Blob([transcript], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'transcript.txt';
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};

// Format time for SRT (00:00:00,000)
const formatSrtTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);

  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')},${milliseconds.toString().padStart(3, '0')}`;
};

// Download transcript as SRT subtitles
const downloadTranscriptAsSubtitle = () => {
  if (!transcriptionResult.value || !transcriptionResult.value.words || !transcriptionResult.value.words.length) {
    error.value = "Word data not available for subtitle generation";
    return;
  }

  const words = transcriptionResult.value.words;

  // Group words into subtitle chunks (approximately 5-10 words per subtitle)
  const subtitles = [];
  let currentSubtitle = { words: [], start: 0, end: 0 };
  let wordCount = 0;

  for (const word of words) {
    if (wordCount === 0) {
      currentSubtitle.start = word.start;
    }

    currentSubtitle.words.push(word.text);
    currentSubtitle.end = word.end;
    wordCount++;

    // Create a new subtitle every ~7 words or at punctuation
    if (wordCount >= 7 || word.text.match(/[.!?]$/)) {
      subtitles.push({
        start: currentSubtitle.start,
        end: currentSubtitle.end,
        text: currentSubtitle.words.join(' ')
      });

      currentSubtitle = { words: [], start: 0, end: 0 };
      wordCount = 0;
    }
  }

  // Add the last subtitle if there are remaining words
  if (currentSubtitle.words.length > 0) {
    subtitles.push({
      start: currentSubtitle.start,
      end: currentSubtitle.end,
      text: currentSubtitle.words.join(' ')
    });
  }

  // Generate SRT content
  let srtContent = '';
  subtitles.forEach((subtitle, index) => {
    srtContent += `${index + 1}\n`;
    srtContent += `${formatSrtTime(subtitle.start)} --> ${formatSrtTime(subtitle.end)}\n`;
    srtContent += `${subtitle.text}\n\n`;
  });

  // Download the SRT file
  const blob = new Blob([srtContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'subtitles.srt';
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};
</script>