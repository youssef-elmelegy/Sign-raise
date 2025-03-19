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
              <!-- API Status Warning -->
              <div v-if="showApiWarning"
                class="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-xl mb-4">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mr-2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z">
                    </path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                  <span>Transcription service may be unavailable. If you encounter issues, please try again
                    later.</span>
                </div>
              </div>

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
                  <span class="whitespace-pre-line">{{ error }}</span>
                </div>
              </div>

              <!-- Troubleshooting Tips -->
              <div v-if="showTroubleshootingTips" class="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 class="font-medium text-blue-800 mb-2">Troubleshooting Tips:</h3>
                <ul class="list-disc pl-5 text-blue-700 space-y-1">
                  <li>Make sure your file is under 10MB in size</li>
                  <li>Try using a different audio or video format (MP3, WAV, MP4)</li>
                  <li>Check your internet connection</li>
                  <li>Try again in a few minutes if the service might be temporarily down</li>
                  <li>Clear your browser cache and cookies</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import TranscriptionHero from '@/components/transcription/TranscriptionHero.vue';
import TranscriptionInfo from '@/components/transcription/TranscriptionInfo.vue';
import FileUploader from '@/components/transcription/FileUploader.vue';
import TranscriptionResults from '@/components/transcription/TranscriptionResults.vue';
import apiClient from "~/utils/apiClient";

// Constants
const MAX_FILE_SIZE_MB = 10;
const PRIMARY_ENDPOINT = '/api/trans/transcribe';

// State variables
const selectedFile = ref(null);
const isTranscribing = ref(false);
const progress = ref(0);
const transcriptionResult = ref(null);
const error = ref(null);
const apiErrorCount = ref(0);
const showTroubleshootingTips = ref(false);

// Computed property
const showApiWarning = computed(() => apiErrorCount.value > 0);

// Handle file selection
const handleFileSelected = (file) => {
  selectedFile.value = file;
  error.value = null;
  showTroubleshootingTips.value = false;
};

// Handle errors
const handleError = (errorMessage) => {
  error.value = errorMessage;
};

// Transcribe file
const transcribeFile = async () => {
  if (!selectedFile.value) {
    error.value = "Please select an audio or video file";
    return;
  }

  // Check file size
  const fileSizeMB = selectedFile.value.size / (1024 * 1024);
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    error.value = `File size (${fileSizeMB.toFixed(2)}MB) exceeds the maximum limit of ${MAX_FILE_SIZE_MB}MB`;
    return;
  }

  // Reset states
  error.value = null;
  showTroubleshootingTips.value = false;
  isTranscribing.value = true;
  progress.value = 10;

  // Prepare form data
  const formData = new FormData();
  formData.append("audio", selectedFile.value);

  // Progress simulation interval
  let progressInterval = setInterval(() => {
    if (progress.value < 90) {
      progress.value += 5;
    }
  }, 500);

  try {
    // Configure request
    const requestConfig = {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 180000, // 3 minutes
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        progress.value = Math.min(90, percentCompleted);
      }
    };

    // Send request
    const response = await apiClient.post(PRIMARY_ENDPOINT, formData, requestConfig);

    // Process response
    progress.value = 100;
    transcriptionResult.value = {
      transcript: response.data.transcript,
      words: response.data.words
    };

    // Reset API error count on success
    apiErrorCount.value = 0;

  } catch (err) {
    // Handle errors
    apiErrorCount.value++;
    let errorMsg = "An error occurred during transcription";

    if (err.code === 'ERR_NETWORK') {
      errorMsg = "Network Error: Could not connect to the transcription service.";
      showTroubleshootingTips.value = true;
    } else if (err.code === 'ECONNABORTED') {
      errorMsg = "The request timed out. The file might be too large or the server is busy.";
      showTroubleshootingTips.value = true;
    } else if (err.response) {
      // Server responded with an error
      errorMsg = err.response.data?.error || `Server error: ${err.response.status}`;

      if (err.response.status === 413) {
        errorMsg += "\n\nThe file is too large for the server to process. Try a smaller file.";
      } else if (err.response.status === 401 || err.response.status === 403) {
        errorMsg += "\n\nAuthentication error. You might need to log in again.";
      } else if (err.response.status === 404) {
        errorMsg += "\n\nThe transcription service endpoint could not be found.";
      } else if (err.response.status >= 500) {
        errorMsg += "\n\nThe server encountered an error. Please try again later.";
        showTroubleshootingTips.value = true;
      }
    } else if (err.request) {
      errorMsg = "No response received from the transcription service.";
      showTroubleshootingTips.value = true;
    }

    error.value = errorMsg;
  } finally {
    clearInterval(progressInterval);
    isTranscribing.value = false;
  }
};

// Format time for SRT (00:00:00,000)
const formatSrtTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const milliseconds = Math.floor((seconds % 1) * 1000);

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(milliseconds).padStart(3, '0')}`;
};

// Download transcript as text
const downloadTranscriptAsText = () => {
  if (!transcriptionResult.value?.transcript) return;

  downloadFile(transcriptionResult.value.transcript, 'transcript.txt', 'text/plain');
};

// Download transcript as SRT subtitles
const downloadTranscriptAsSubtitle = () => {
  if (!transcriptionResult.value?.words?.length) {
    error.value = "Word data not available for subtitle generation";
    return;
  }

  const words = transcriptionResult.value.words;
  const subtitles = [];
  let currentSubtitle = { words: [], start: 0, end: 0 };
  let wordCount = 0;

  // Group words into subtitle chunks
  for (const word of words) {
    if (wordCount === 0) {
      currentSubtitle.start = word.start;
    }

    currentSubtitle.words.push(word.text);
    currentSubtitle.end = word.end;
    wordCount++;

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

  // Add remaining words if any
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

  downloadFile(srtContent, 'subtitles.srt', 'text/plain');
};

// Helper function for file downloads
const downloadFile = (content, filename, type) => {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');

  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();

  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
};
</script>