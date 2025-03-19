<script setup>
import { ref, onMounted, watch } from 'vue';

const hearingTranscript = ref('');
const deafTranscript = ref('');
const isRecording = ref(false);
const hearingTranscriptHistory = ref([]);
const deafTranscriptHistory = ref([]);
const errorMessage = ref('');
const selectedLanguage = ref('en-US');

const languages = ref([
  { code: 'en-US', name: 'English' },
  { code: 'ar-SA', name: 'Arabic' },
]);

const commands = ref([
  { phrase: 'stop recording', action: () => stopRecording() },
  { phrase: 'clear transcript', action: () => clearTranscript() },
  { phrase: 'توقف عن التسجيل', action: () => stopRecording() },
  { phrase: 'امسح النص', action: () => clearTranscript() },
]);

let recognition = null;

onMounted(() => {
  initializeSpeechRecognition();
});

// Watch for language changes and reinitialize recognition
watch(selectedLanguage, () => {
  if (isRecording.value) {
    stopRecording();
  }
  initializeSpeechRecognition();
});

const initializeSpeechRecognition = () => {
  try {
    const Recognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!Recognition) {
      errorMessage.value =
        'Speech recognition is not supported in this browser';
      return;
    }
    recognition = new Recognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLanguage.value;
    recognition.onstart = handleStart;
    recognition.onend = handleEnd;
    recognition.onresult = handleResult;
    recognition.onerror = handleError;
  } catch (err) {
    errorMessage.value = `Error initializing speech recognition: ${err.message}`;
    console.error(err);
  }
};

// Event handlers (recognition lifecycle)
const handleStart = () => {
  isRecording.value = true;
  errorMessage.value = '';
};

const handleEnd = () => {
  isRecording.value = false;

  if (isRecording.value) {
    setTimeout(() => {
      startRecording();
    }, 500);
  }
};

const handleResult = (event) => {
  let interimTranscript = '';
  let finalTranscript = '';

  for (let i = event.resultIndex; i < event.results.length; i++) {
    const result = event.results[i];
    const transcriptText = result[0].transcript.trim();

    if (result.isFinal) {
      finalTranscript += ' ' + transcriptText;
      hearingTranscriptHistory.value.push(finalTranscript.trim());
      checkForCommands(transcriptText);
    } else {
      interimTranscript += ' ' + transcriptText;
    }
  }

  hearingTranscript.value = (
    hearingTranscriptHistory.value.join('. ') +
    (interimTranscript ? '. ' + interimTranscript : '')
  ).trim();
};

const handleError = (event) => {
  errorMessage.value = `Recognition error: ${event.error}`;
  isRecording.value = false;
};

// Controls and Command actions
const checkForCommands = (text) => {
  const normalizedText = text.toLowerCase().trim();
  for (const command of commands.value) {
    if (normalizedText.includes(command.phrase)) {
      command.action();
      return;
    }
  }
};

const stopRecording = () => {
  if (recognition && isRecording.value) {
    recognition.stop();
  }
};

const clearTranscript = () => {
  hearingTranscript.value = '';
  deafTranscript.value = '';
  hearingTranscriptHistory.value = [];
  deafTranscriptHistory.value = [];
};

const startRecording = () => {
  if (recognition && !isRecording.value) {
    try {
      recognition.start();
    } catch (err) {
      initializeSpeechRecognition();
      setTimeout(() => recognition.start(), 100);
    }
  }
};

const toggleMic = () => {
  if (isRecording.value) {
    stopRecording();
  } else {
    startRecording();
  }
};

const changeLanguage = (langCode) => {
  selectedLanguage.value = langCode;
};
</script>

<template>
  <section class="py-20">
    <div class="container mx-auto px-4">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">
          Live Translation Call
        </h2>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
          Experience seamless communication with real-time translation between
          sign language and speech.
        </p>
      </div>

      <div
        v-if="errorMessage"
        class="mb-8 p-4 bg-red-100 text-red-700 rounded-lg text-center"
      >
        {{ errorMessage }}
      </div>

      <!-- Language selector -->
      <div class="mb-8 flex justify-center">
        <div class="inline-block">
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Select Language:</label
          >
          <div class="flex space-x-3">
            <button
              v-for="lang in languages"
              :key="lang.code"
              @click="changeLanguage(lang.code)"
              class="px-4 py-2 rounded-lg text-sm font-medium"
              :class="
                selectedLanguage === lang.code
                  ? 'bg-purple-heart-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              "
            >
              {{ lang.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Video Call Interface -->
      <div class="bg-white p-6 rounded-2xl shadow-xl">
        <div class="flex flex-col md:flex-row gap-4">
          <!-- Hearing Person -->
          <div class="flex-1 bg-gray-100 rounded-xl overflow-hidden">
            <div class="bg-purple-heart-600 text-white text-center py-2">
              Hearing Person
            </div>
            <div class="p-4">
              <div
                class="bg-gray-200 rounded-lg w-full h-48 flex items-center justify-center mb-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-gray-400"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div
                class="bg-white p-3 rounded-lg shadow-md h-24 overflow-y-auto"
                :dir="selectedLanguage === 'ar-SA' ? 'rtl' : 'ltr'"
              >
                <p v-if="!hearingTranscript" class="text-gray-400 italic">
                  {{
                    selectedLanguage === 'ar-SA'
                      ? 'سيظهر كلامك هنا...'
                      : 'Speech will appear here...'
                  }}
                </p>
                <p v-else class="text-sm">{{ hearingTranscript }}</p>
              </div>
            </div>
          </div>

          <!-- Deaf Person -->
          <div class="flex-1 bg-gray-100 rounded-xl overflow-hidden">
            <div class="bg-purple-heart-600 text-white text-center py-2">
              Deaf Person
            </div>
            <div class="p-4">
              <div
                class="bg-gray-200 rounded-lg w-full h-48 flex items-center justify-center mb-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="text-gray-400"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </div>
              <div
                class="bg-white p-3 rounded-lg shadow-md h-24 overflow-y-auto"
                :dir="selectedLanguage === 'ar-SA' ? 'rtl' : 'ltr'"
              >
                <p v-if="!deafTranscript" class="text-gray-400 italic">
                  {{
                    selectedLanguage === 'ar-SA'
                      ? 'ستظهر لغة الإشارة هنا...'
                      : 'Sign language will appear here...'
                  }}
                </p>
                <p v-else class="text-sm">{{ deafTranscript }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Controls -->
        <div class="mt-6 flex justify-center gap-4">
          <TheButton class="px-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-2"
            >
              <path
                d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
              ></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
            <span>Listen</span>
          </TheButton>

          <TheButton
            @click="toggleMic"
            class="flex items-center bg-purple-heart-600 text-white px-5 py-2 rounded-full hover:bg-purple-heart-700 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              :stroke="isRecording ? '#10B981' : 'currentColor'"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-2"
            >
              <path
                d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"
              ></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
            <span v-if="!isRecording">Start Recording</span>
            <span v-else>Stop</span>
          </TheButton>

          <TheButton
            @click="clearTranscript"
            class="flex items-center border-2 border-purple-heart-600 text-purple-heart-600 px-5 py-2 rounded-full hover:bg-purple-heart-50 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="mr-2"
            >
              <path d="M3 6h18"></path>
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            </svg>
            <span>Clear</span>
          </TheButton>
        </div>

        <!-- Status indicator -->
        <div class="mt-4 text-center">
          <p class="text-sm text-gray-600">
            Status:
            <span
              :class="
                isRecording ? 'text-green-600 font-medium' : 'text-gray-500'
              "
            >
              {{ isRecording ? 'Recording active' : 'Recording inactive' }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
