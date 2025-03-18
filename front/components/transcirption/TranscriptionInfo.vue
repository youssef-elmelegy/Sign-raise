<template>
    <div>
        <div class="inline-block bg-purple-heart-50 p-3 rounded-2xl mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                class="text-purple-heart-600">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" x2="8" y1="13" y2="13" />
                <line x1="16" x2="8" y1="17" y2="17" />
                <line x1="10" x2="8" y1="9" y2="9" />
            </svg>
        </div>
        <h2 class="text-2xl font-bold mb-4">How It Works</h2>
        <p class="text-gray-600 mb-6">
            Our advanced AI technology can analyze audio and video files to generate accurate transcriptions. Perfect
            for
            converting sign language videos to text or transcribing audio recordings.
        </p>
        <ul class="space-y-4">
            <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="text-purple-heart-600 mr-2 mt-1">
                    <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Upload video or audio files up to 100MB</span>
            </li>
            <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="text-purple-heart-600 mr-2 mt-1">
                    <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>AI converts content into full transcript with high accuracy</span>
            </li>
            <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="text-purple-heart-600 mr-2 mt-1">
                    <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>View detailed word-by-word analysis with confidence scores</span>
            </li>
            <li class="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="text-purple-heart-600 mr-2 mt-1">
                    <path d="M20 6 9 17l-5-5" />
                </svg>
                <span>Download transcripts for offline use or sharing</span>
            </li>
        </ul>

        <div class="mt-8 p-6 bg-purple-heart-50 rounded-xl">
            <h3 class="text-lg font-semibold mb-3">Supported File Types</h3>
            <div class="grid grid-cols-2 gap-2">
                <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="text-purple-heart-600 mr-2">
                        <path d="M18 8a6 6 0 0 0-6-6H8a6 6 0 0 0-6 6v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                        <circle cx="12" cy="12" r="2" />
                        <path d="M10 8v1" />
                        <path d="M14 8v1" />
                        <path d="M10 15v1" />
                        <path d="M14 15v1" />
                    </svg>
                    <span>MP3</span>
                </div>
                <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="text-purple-heart-600 mr-2">
                        <path d="M18 8a6 6 0 0 0-6-6H8a6 6 0 0 0-6 6v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                        <circle cx="12" cy="12" r="2" />
                        <path d="M10 8v1" />
                        <path d="M14 8v1" />
                        <path d="M10 15v1" />
                        <path d="M14 15v1" />
                    </svg>
                    <span>WAV</span>
                </div>
                <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="text-purple-heart-600 mr-2">
                        <path d="M18 8a6 6 0 0 0-6-6H8a6 6 0 0 0-6 6v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                        <circle cx="12" cy="12" r="2" />
                        <path d="M10 8v1" />
                        <path d="M14 8v1" />
                        <path d="M10 15v1" />
                        <path d="M14 15v1" />
                    </svg>
                    <span>M4A</span>
                </div>
                <div class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="text-purple-heart-600 mr-2">
                        <path d="m22 8-6 4 6 4V8Z" />
                        <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
                    </svg>
                    <span>MP4</span>
                </div>
            </div>
        </div>
    </div>
</template>