<template>
    <section id="features" class="py-20">
        <div class="container mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    Our app offers powerful tools to bridge communication gaps between deaf and hearing individuals.
                </p>
            </div>

            <!-- Feature 1: Video Call with Live Translation -->
            <div class="flex flex-col md:flex-row items-center mb-20">
                <div class="md:w-1/2 mb-10 md:mb-0 md:pr-10">
                    <div class="inline-block bg-purple-heart-50 p-3 rounded-2xl mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="text-purple-heart-600">
                            <path d="m22 8-6 4 6 4V8Z" />
                            <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold mb-4">Video Call with Live Translation</h3>
                    <p class="text-gray-600 mb-6">
                        Experience seamless communication with real-time sign language to text and speech translation
                        during video calls.
                    </p>
                    <ul class="space-y-3">
                        <li class="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="text-purple-heart-600 mr-2 mt-1">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                            <span>Live captions for hearing person's speech</span>
                        </li>
                        <li class="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="text-purple-heart-600 mr-2 mt-1">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                            <span>AI converts sign language to text in real-time</span>
                        </li>
                        <li class="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="text-purple-heart-600 mr-2 mt-1">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                            <span>Text-to-speech functionality for the hearing person</span>
                        </li>
                    </ul>
                </div>
                <div class="md:w-1/2">
                    <div class="bg-white p-6 rounded-2xl shadow-xl">
                        <div class="flex flex-col md:flex-row gap-4">
                            <div class="flex-1 bg-gray-100 rounded-xl overflow-hidden">
                                <div class="bg-purple-heart-600 text-white text-center py-2">Hearing Person</div>
                                <div class="p-4">
                                    <img src="/placeholder.svg?height=150&width=250" alt="Hearing person in video call"
                                        class="rounded-lg w-full mb-3" />
                                    <div class="bg-white p-3 rounded-lg shadow-md">
                                        <p class="text-sm">"How are you doing today?"</p>
                                    </div>
                                </div>
                            </div>
                            <div class="flex-1 bg-gray-100 rounded-xl overflow-hidden">
                                <div class="bg-purple-heart-600 text-white text-center py-2">Deaf Person</div>
                                <div class="p-4">
                                    <img src="/placeholder.svg?height=150&width=250"
                                        alt="Deaf person signing in video call" class="rounded-lg w-full mb-3" />
                                    <div class="bg-white p-3 rounded-lg shadow-md">
                                        <p class="text-sm">"I'm doing great, thanks for asking!"</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="mt-4 flex justify-center">
                            <button
                             @click="$router.push('/features/video-call')"
                                class="flex items-center bg-purple-heart-600 text-white px-4 py-2 rounded-full hover:bg-purple-heart-700 transition">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="lucide lucide-volume-2 mr-2">
                                    <path d="M11 5 6 9H2v6h4l5 4V5z" />
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                </svg>
                                <span>Speaker</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Feature 2: Live Camera Translation -->
            <div class="flex flex-col md:flex-row-reverse items-center mb-20">
                <div class="md:w-1/2 mb-10 md:mb-0 md:pl-10">
                    <div class="inline-block bg-purple-heart-50 p-3 rounded-2xl mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="text-purple-heart-600">
                            <path
                                d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
                            <circle cx="12" cy="13" r="3" />
                        </svg>
                    </div>
                    <h3 class="text-2xl font-bold mb-4">Live Camera Translation</h3>
                    <p class="text-gray-600 mb-6">
                        Use your phone's camera to translate sign language on the go, perfect for everyday situations.
                    </p>
                    <ul class="space-y-3">
                        <li class="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="text-purple-heart-600 mr-2 mt-1">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                            <span>Real-time sign language to text translation</span>
                        </li>
                        <li class="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="text-purple-heart-600 mr-2 mt-1">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                            <span>Text-to-speech functionality</span>
                        </li>
                        <li class="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="text-purple-heart-600 mr-2 mt-1">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                            <span>Ideal for airports, restaurants, hospitals, etc.</span>
                        </li>
                    </ul>
                </div>
                <div class="md:w-1/2">
                    <div class="relative mx-auto" style="max-width: 300px;">
                        <div class="border-8 border-black rounded-3xl overflow-hidden shadow-xl">
                            <div class="bg-black text-white text-center py-1 relative">
                                <div
                                    class="absolute top-0 left-1/2 transform -translate-x-1/2 w-20 h-5 bg-black rounded-b-xl">
                                </div>
                            </div>
                            <div class="relative bg-gray-100">
                                <img src="/placeholder.svg?height=500&width=300" alt="Person signing in front of camera"
                                    class="w-full" />
                                <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 p-4">
                                    <p class="text-white text-center">"Can you help me find the gate for my flight?"</p>
                                    <div class="flex justify-center mt-2">
                                        <button
                                         @click="$router.push('/features/camera-translation')"
                                            class="flex items-center bg-purple-heart-600 text-white px-3 py-1 rounded-full text-sm hover:bg-purple-heart-700 transition">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round"
                                                class="lucide lucide-volume-2 mr-1">
                                                <path d="M11 5 6 9H2v6h4l5 4V5z" />
                                                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                            </svg>
                                            <span>Speaker</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div class="bg-black text-white text-center py-1">
                                <div class="inline-block w-16 h-1 bg-gray-300 rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Feature 3: Upload Video/Audio for AI Transcription -->
            <div class="flex flex-col md:flex-row items-center">
                <div class="md:w-1/2 mb-10 md:mb-0 md:pr-10">
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
                    <h3 class="text-2xl font-bold mb-4">Upload Video/Audio for AI Transcription</h3>
                    <p class="text-gray-600 mb-6">
                        Convert sign language videos or audio files into text transcripts with our powerful AI.
                    </p>
                    <ul class="space-y-3">
                        <li class="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="text-purple-heart-600 mr-2 mt-1">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                            <span>Upload video or audio files</span>
                        </li>
                        <li class="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="text-purple-heart-600 mr-2 mt-1">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                            <span>AI converts content into full transcript</span>
                        </li>
                        <li class="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="text-purple-heart-600 mr-2 mt-1">
                                <path d="M20 6 9 17l-5-5" />
                            </svg>
                            <span>Download or read transcripts on-screen</span>
                        </li>
                    </ul>
                </div>
                <div class="md:w-1/2">
                    <div class="bg-white p-6 rounded-2xl shadow-xl">
                        <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="text-purple-heart-600 mx-auto mb-4">
                                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                                <path d="M12 12v9" />
                                <path d="m16 16-4-4-4 4" />
                            </svg>
                            <p class="text-gray-600 mb-4">Drag and drop your video or audio file here</p>
                            <button
                                @click="$router.push('/features/transcription')"
                                class="bg-purple-heart-600 text-white px-6 py-2 rounded-lg hover:bg-purple-heart-700 transition">
                                Browse Files
                            </button>
                        </div>
                        <div class="bg-gray-50 rounded-xl p-4">
                            <div class="flex justify-between items-center mb-4">
                                <h4 class="font-medium">Transcript Preview</h4>
                                <button
                                    class="text-purple-heart-600 flex items-center hover:text-purple-heart-700 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                        stroke-linejoin="round" class="lucide lucide-download mr-1">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" x2="12" y1="15" y2="3" />
                                    </svg>
                                    Download
                                </button>
                            </div>
                            <div class="bg-white p-3 rounded-lg border border-gray-200">
                                <p class="text-gray-700 text-sm">
                                    "Hello, my name is Sarah. I'm excited to share with you our new project that focuses
                                    on accessibility for the deaf community. We believe that technology should be
                                    inclusive and available to everyone..."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>