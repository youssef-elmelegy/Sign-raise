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
                            <FileUploader @file-selected="handleFileSelected" @transcribe="transcribeFile"
                                :selectedFile="selectedFile" :isTranscribing="isTranscribing" :progress="progress" />

                            <!-- Results Container -->
                            <TranscriptionResults v-if="transcriptionResult" :transcriptionResult="transcriptionResult"
                                @download="downloadTranscript" />

                            <!-- Error Message -->
                            <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mt-4">
                                <div class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="mr-2">
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
import TranscriptionHero from '~/components/transcirption/TranscriptionHero.vue';
import TranscriptionInfo from '~/components/transcirption/TranscriptionInfo.vue';
import FileUploader from '~/components/transcirption/FileUploader.vue';
import TranscriptionResults from '~/components/transcirption/TranscriptionResults.vue';

// State variables
const selectedFile = ref(null);
const isTranscribing = ref(false);
const progress = ref(0);
const transcriptionResult = ref(null);
const error = ref(null);

// Handle file selection from child component
const handleFileSelected = (file) => {
    selectedFile.value = file;
    error.value = null;
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

        // Make the API request
        const response = await fetch("http://localhost:3000/transcribe", {
            method: "POST",
            body: formData,
        });

        clearInterval(progressInterval);
        progress.value = 100;

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Received data:", data);

        // Set the transcription result
        transcriptionResult.value = {
            transcript: data.transcript,
            words: data.words
        };

    } catch (err) {
        console.error("Transcription error:", err);
        error.value = err.message || "An error occurred during transcription";
    } finally {
        setTimeout(() => {
            isTranscribing.value = false;
        }, 500);
    }
};

// Download transcript as a text file
const downloadTranscript = () => {
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
</script>