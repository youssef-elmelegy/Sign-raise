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
            <p class="text-gray-600 mb-4">
                {{ selectedFile ? selectedFile.name : 'Drag and drop your audio or video file here' }}
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <label for="fileInput" class="cursor-pointer">
                    <TheButton>
                        Browse Files
                    </TheButton>
                    <input type="file" id="fileInput" ref="fileInput" accept="audio/*,video/*" class="hidden"
                        @change="handleFileSelect" />
                </label>
                <TheButton v-if="selectedFile && !isTranscribing" @click="$emit('transcribe')">
                    Transcribe Now
                </TheButton>
            </div>
        </div>

        <!-- Progress Bar -->
        <div v-if="isTranscribing" class="mb-6">
            <div class="flex justify-between mb-2">
                <span class="text-sm font-medium">Processing...</span>
                <span class="text-sm font-medium">{{ progress }}%</span>
            </div>
            <div class="h-2 bg-gray-200 rounded-full">
                <div class="h-2 bg-purple-heart-600 rounded-full transition-all duration-300"
                    :style="{ width: `${progress}%` }"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

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
    }
});

const emit = defineEmits(['file-selected', 'transcribe']);
const fileInput = ref(null);
const isDragging = ref(false);

const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
        emit('file-selected', file);
    }
};

const handleFileDrop = (event) => {
    isDragging.value = false;
    const file = event.dataTransfer.files[0];
    if (file && (file.type.startsWith('audio/') || file.type.startsWith('video/'))) {
        emit('file-selected', file);
    } else {
        emit('file-selected', null);
        emit('error', "Please upload an audio or video file");
    }
};
</script>