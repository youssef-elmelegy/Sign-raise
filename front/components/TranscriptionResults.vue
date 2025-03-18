<template>
    <div class="bg-white p-6 rounded-2xl shadow-xl">
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold">Transcription Results</h3>
            <button @click="$emit('download')"
                class="text-purple-heart-600 flex items-center hover:text-purple-heart-800 transition cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-download mr-1">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" x2="12" y1="15" y2="3" />
                </svg>
                Download Transcript
            </button>
        </div>

        <!-- Full Transcript -->
        <div class="bg-purple-heart-50 p-4 rounded-xl mb-6">
            <h4 class="font-medium mb-2">Full Transcript</h4>
            <p class="text-gray-700">{{ transcriptionResult.transcript }}</p>
        </div>

        <!-- Word Analysis -->
        <!-- <div v-if="transcriptionResult.words && transcriptionResult.words.length">
            <h4 class="font-medium mb-3">Word-by-Word Analysis</h4>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div v-for="(word, index) in transcriptionResult.words" :key="index"
                    class="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <p class="font-medium">{{ word.text }}</p>
                    <div class="text-sm text-gray-500 flex justify-between">
                        <span>{{ word.start.toFixed(2) }}s - {{ word.end.toFixed(2) }}s</span>
                        <span class="text-purple-heart-600">{{ (word.confidence * 100).toFixed(0) }}%</span>
                    </div>
                </div>
            </div>
        </div> -->
    </div>
</template>

<script setup>
defineProps({
    transcriptionResult: {
        type: Object,
        required: true
    }
});

defineEmits(['download']);
</script>