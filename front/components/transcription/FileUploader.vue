<template>
    <div class="bg-white p-6 rounded-2xl shadow-xl mb-8">
        <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6"
            @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleFileDrop"
            :class="{ 'bg-purple-heart-50 border-purple-heart-300': isDragging }">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="text-purple-heart-600 mx-auto mb-4">
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                <path d="M12 12v9" />
                <path d="m16 16-4-4-4 4" />
            </svg>

            <!-- File information -->
            <div v-if="selectedFile" class="mb-4">
                <p class="text-gray-600">{{ selectedFile.name }}</p>
                <p class="text-sm text-gray-500">
                    {{ formatFileSize(selectedFile.size) }} •
                    {{ selectedFile.type.startsWith('video/') ? 'Video' : 'Audio' }}
                </p>
            </div>
            <p v-else class="text-gray-600 mb-4">
                Drag and drop your audio or video file here
            </p>

            <!-- File format info -->
            <p class="text-xs text-gray-500 mb-4">
                Supported formats: MP3, WAV, M4A, MP4, MOV, AVI, etc.
            </p>

            <!-- Action buttons -->
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <button @click="triggerFileInput"
                    class="bg-purple-heart-600 hover:bg-purple-heart-700 transition-colors justify-center items-center flex gap-2 w-full text-white px-7 cursor-pointer py-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="mr-1">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    Browse Files
                </button>
                <input type="file" id="fileInput" ref="fileInput" accept="audio/*,video/*" class="hidden"
                    @change="handleFileSelect" />

                <button v-if="selectedFile && !isTranscribing" @click="$emit('transcribe')"
                    class="bg-purple-heart-600 hover:bg-purple-heart-700 transition-colors justify-center items-center flex gap-2 w-full text-white px-7 cursor-pointer py-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="mr-1">
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    Transcribe Now
                </button>
            </div>
        </div>

        <!-- Processing Info -->
        <div v-if="isTranscribing">
            <!-- Status message -->
            <div class="mb-2">
                <span class="text-sm font-medium">
                    {{ processingMessage }}
                </span>
                <span class="text-sm font-medium float-right">{{ progress }}%</span>
            </div>

            <!-- Progress bar -->
            <div class="h-2 bg-gray-200 rounded-full mb-2">
                <div class="h-2 bg-purple-heart-600 rounded-full transition-all duration-300"
                    :style="{ width: `${progress}%` }"></div>
            </div>

            <!-- Additional info for video files -->
            <p v-if="selectedFile && selectedFile.type.startsWith('video/')" class="text-xs text-gray-500 italic">
                Video files require audio extraction before transcription
            </p>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    selectedFile: {
        type: Object,
        default: null
    },
    isTranscribing: {
        type: Boolean,
        default: false
    },
    progress: {
        type: Number,
        default: 0
    },
    processingStage: {
        type: String,
        default: 'uploading' // 'uploading', 'extracting', 'transcribing'
    }
});

const emit = defineEmits(['file-selected', 'transcribe', 'error']);
const fileInput = ref(null);
const isDragging = ref(false);

// Compute progress message based on stage
const processingMessage = computed(() => {
    if (props.processingStage === 'extracting') {
        return 'Extracting audio from video...';
    } else if (props.processingStage === 'transcribing') {
        return 'Transcribing audio...';
    }
    return 'Processing...';
});

// Format file size for display
const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
};

// Trigger file input click
const triggerFileInput = () => {
    fileInput.value.click();
};

// Handle file selection from input
const handleFileSelect = (event) => {
    const file = event.target.files[0];
    validateAndEmitFile(file);
};

// Handle file drop
const handleFileDrop = (event) => {
    isDragging.value = false;
    const file = event.dataTransfer.files[0];
    validateAndEmitFile(file);
};

// Validate file and emit selection
const validateAndEmitFile = (file) => {
    if (!file) return;

    // Check if file is audio or video
    if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
        // Check file size (10MB limit)
        const MAX_SIZE = 10 * 1024 * 1024; // 10MB
        if (file.size > MAX_SIZE) {
            emit('error', `File size (${formatFileSize(file.size)}) exceeds the 10MB limit`);
            return;
        }

        emit('file-selected', file);
    } else {
        emit('error', "Please upload an audio or video file");
    }
};
</script>