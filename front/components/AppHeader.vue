<template>
    <header class="bg-white shadow-sm sticky top-0 z-50">
        <div class="container mx-auto px-4 py-4 flex justify-between items-center">
            <div class="flex items-center">
                <h1 class="text-2xl pr-3 font-bold text-purple-heart-600">SignRaise</h1>
                <NuxtLink to="/">
                    <img src="/logo.svg" alt="Logo" class="h-10 w-auto fill-current text-purple-heart-600" />
                </NuxtLink>
            </div>

            <div class="hidden md:flex space-x-8">
                <NuxtLink to="/" class="text-gray-700 hover:text-purple-heart-600 transition">Home</NuxtLink>

                <!-- Features Dropdown -->
                <div class="relative group">
                    <button class="flex items-center text-gray-700 hover:text-purple-heart-600 transition">
                        Features
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-chevron-down ml-1">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>
                    <div
                        class="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                        <div class="py-1" role="menu" aria-orientation="vertical">
                            <NuxtLink to="/features/video-call"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-heart-50 hover:text-purple-heart-600"
                                role="menuitem">
                                Video Call with Live Translation
                            </NuxtLink>
                            <NuxtLink to="/features/camera-translation"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-heart-50 hover:text-purple-heart-600"
                                role="menuitem">
                                Live Camera Translation
                            </NuxtLink>
                            <NuxtLink to="/features/transcription"
                                class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-heart-50 hover:text-purple-heart-600"
                                role="menuitem">
                                AI Transcription
                            </NuxtLink>
                        </div>
                    </div>
                </div>

                <NuxtLink to="/blog" class="text-gray-700 hover:text-purple-heart-600 transition">Blog</NuxtLink>
                <NuxtLink to="/contact" class="text-gray-700 hover:text-purple-heart-600 transition">Contact Us
                </NuxtLink>
            </div>

            <div>
                <NuxtLink to="/sign_up">
                    <TheButton>
                        Sign Up
                    </TheButton>
                </NuxtLink>
            </div>

            <!-- Mobile Menu Button -->
            <button @click="toggleMobileMenu" class="md:hidden text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                    class="lucide lucide-menu">
                    <line x1="4" x2="20" y1="12" y2="12" />
                    <line x1="4" x2="20" y1="6" y2="6" />
                    <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
            </button>
        </div>

        <!-- Mobile Menu (Hidden by default) -->
        <div v-show="isMobileMenuOpen" class="md:hidden bg-white border-t">
            <div class="container mx-auto px-4 py-3">
                <NuxtLink to="/" class="block py-2 text-gray-700 hover:text-purple-heart-600">Home</NuxtLink>

                <!-- Mobile Features Dropdown -->
                <div class="py-2">
                    <button @click="toggleMobileFeatures"
                        class="flex items-center text-gray-700 hover:text-purple-heart-600 w-full justify-between">
                        Features
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-chevron-down">
                            <path d="m6 9 6 6 6-6" />
                        </svg>
                    </button>
                    <div v-show="isMobileFeaturesOpen" class="pl-4 mt-2 space-y-2">
                        <NuxtLink to="/features/video-call"
                            class="block py-1 text-gray-700 hover:text-purple-heart-600">
                            Video Call with Live Translation
                        </NuxtLink>
                        <NuxtLink to="/features/camera-translation"
                            class="block py-1 text-gray-700 hover:text-purple-heart-600">
                            Live Camera Translation
                        </NuxtLink>
                        <NuxtLink to="/features/transcription"
                            class="block py-1 text-gray-700 hover:text-purple-heart-600">
                            AI Transcription
                        </NuxtLink>
                    </div>
                </div>

                <NuxtLink to="/blog" class="block py-2 text-gray-700 hover:text-purple-heart-600">Blog</NuxtLink>
                <NuxtLink to="/contact" class="block py-2 text-gray-700 hover:text-purple-heart-600">Contact Us
                </NuxtLink>

                <!-- <div class="py-3">
                    <NuxtLink to="/sign_up">
                        <TheButton>
                            Sign Up
                        </TheButton>
                    </NuxtLink>
                </div> -->
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref } from 'vue'

// Mobile menu state
const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
    // Close features dropdown when closing the menu
    if (!isMobileMenuOpen.value) {
        isMobileFeaturesOpen.value = false
    }
}

// Mobile features dropdown state
const isMobileFeaturesOpen = ref(false)

function toggleMobileFeatures() {
    isMobileFeaturesOpen.value = !isMobileFeaturesOpen.value
}
</script>