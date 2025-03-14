<template>
    <nav class="flex justify-between items-center px-6 py-4 border-b bg-white z-50">
        <!-- Logo -->
        <NuxtLink to="/">
            <img src="/logo.svg" alt="Logo" class="h-10 w-auto" />
        </NuxtLink>

        <!-- Navigation Links -->
        <ul class="hidden md:flex space-x-8 text-lg font-semibold">
            <li>
                <NuxtLink to="/" class="hover:text-[#5f3fec] transition">Home</NuxtLink>
            </li>

            <!-- Features Dropdown -->
            <li class="relative group">
                <button class="flex items-center gap-1 hover:text-[#5f3fec] transition">
                    Features
                    <svg xmlns="http://www.w3.org/2000/svg"
                        class="w-5 h-5 transition-transform transform group-hover:rotate-180" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                <!-- Dropdown Menu -->
                <ul
                    class="absolute left-0 mt-2 w-64 bg-white border rounded-lg shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                    <li>
                        <NuxtLink to="/video-call" class="block px-5 py-3 text-gray-700 hover:bg-[#dfe2ff] transition">
                            🎥 AI-Powered Calls
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/live-camera" class="block px-5 py-3 text-gray-700 hover:bg-[#dfe2ff] transition">
                            📸 Instant Sign-to-Text
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/upload-media"
                            class="block px-5 py-3 text-gray-700 hover:bg-[#dfe2ff] transition">
                            🎬 Video & Audio Transcription
                        </NuxtLink>
                    </li>
                </ul>
            </li>

            <li>
                <NuxtLink to="/blog" class="hover:text-[#5f3fec] transition">Blog</NuxtLink>
            </li>
            <li>
                <NuxtLink to="/contact-us" class="hover:text-[#5f3fec] transition">Contact Us</NuxtLink>
            </li>
        </ul>

        <!-- Sign Up Button -->
        <NuxtLink to="/signup" class="px-6 py-2 bg-[#6e5df7] text-white rounded-lg hover:bg-[#5f3fec] transition-all">
            Sign Up
        </NuxtLink>

        <!-- Mobile Menu Button -->
        <button @click="toggleMenu" class="md:hidden p-2 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-8 h-8 text-gray-700" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
        </button>

        <!-- Mobile Menu -->
        <div v-if="isMenuOpen"
            class="absolute top-0 left-0 w-full h-screen bg-white flex flex-col items-center space-y-6 p-6 shadow-lg md:hidden">
            <button @click="toggleMenu" class="absolute top-4 right-6 text-gray-700">
                ✖
            </button>

            <NuxtLink to="/" class="text-xl" @click="toggleMenu">Home</NuxtLink>
            <NuxtLink to="/features" class="text-xl" @click="toggleMenu">Features</NuxtLink>
            <NuxtLink to="/blog" class="text-xl" @click="toggleMenu">Blog</NuxtLink>
            <NuxtLink to="/contact-us" class="text-xl" @click="toggleMenu">Contact Us</NuxtLink>
            <NuxtLink to="/signup"
                class="px-6 py-2 bg-[#6e5df7] text-white rounded-lg hover:bg-[#5f3fec] transition-all"
                @click="toggleMenu">
                Sign Up
            </NuxtLink>
        </div>
    </nav>
</template>

<script setup>
import { ref } from "vue";

const isMenuOpen = ref(false);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};
</script>