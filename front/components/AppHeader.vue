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

            <!-- Authentication Buttons -->
            <div>
                <!-- Show when logged out -->
                <template v-if="!isAuthenticated">
                    <NuxtLink to="/log_in" class="text-gray-700 hover:text-purple-heart-600 transition mr-4 hidden md:inline-block">
                        Log In
                    </NuxtLink>
                    <NuxtLink to="/sign_up">
                        <button
                            class="bg-purple-heart-600 text-white px-7 py-2 rounded-full text-lg font-medium hover:bg-purple-heart-700 transition shadow-lg cursor-pointer hidden md:inline-block">
                            Sign Up
                        </button>
                    </NuxtLink>
                </template>

                <!-- Show when logged in -->
                <template v-else>
                    <!-- User dropdown menu -->
                    <div class="relative group">
                        <button class="flex items-center text-gray-700 hover:text-purple-heart-600 transition hidden md:flex">
                            <span class="mr-2">{{ userName }}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" class="lucide lucide-chevron-down ml-1">
                                <path d="m6 9 6 6 6-6" />
                            </svg>
                        </button>
                        <div
                            class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                            <div class="py-1" role="menu" aria-orientation="vertical">
                                <!-- <NuxtLink to="/profile"
                                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-heart-50 hover:text-purple-heart-600"
                                    role="menuitem">
                                    Profile
                                </NuxtLink>
                                <NuxtLink to="/dashboard"
                                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-purple-heart-50 hover:text-purple-heart-600"
                                    role="menuitem">
                                    Dashboard
                                </NuxtLink> -->
                                <button @click="logout"
                                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-purple-heart-50 hover:text-purple-heart-600"
                                    role="menuitem">
                                    Log Out
                                </button>
                            </div>
                        </div>
                    </div>
                </template>
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

                <!-- Mobile Authentication -->
                <template v-if="!isAuthenticated">
                    <NuxtLink to="/log_in" class="block py-2 text-gray-700 hover:text-purple-heart-600">Log In
                    </NuxtLink>
                    <NuxtLink to="/sign_up" class="block py-2 text-gray-700 hover:text-purple-heart-600">Sign Up
                    </NuxtLink>
                </template>
                <template v-else>
                    <!-- <NuxtLink to="/profile" class="block py-2 text-gray-700 hover:text-purple-heart-600">Profile
                    </NuxtLink>
                    <NuxtLink to="/dashboard" class="block py-2 text-gray-700 hover:text-purple-heart-600">Dashboard
                    </NuxtLink> -->
                    <button @click="logout"
                        class="block py-2 text-gray-700 hover:text-purple-heart-600 w-full text-left">
                        Log Out
                    </button>
                </template>
            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import apiClient from '~/utils/apiClient'

// Mobile menu state
const isMobileMenuOpen = ref(false)
const isMobileFeaturesOpen = ref(false)

// Authentication state
const isAuthenticated = ref(false)
const userName = ref('User')

function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
    if (!isMobileMenuOpen.value) {
        isMobileFeaturesOpen.value = false
    }
}

function toggleMobileFeatures() {
    isMobileFeaturesOpen.value = !isMobileFeaturesOpen.value
}

// Check authentication status on component mount and when cookies change
onMounted(() => {
    checkAuth()

    // Set up an interval to check auth status periodically
    const authCheckInterval = setInterval(checkAuth, 5 * 60 * 1000) // Check every 5 minutes

    // Clean up interval on component unmount
    onUnmounted(() => {
        clearInterval(authCheckInterval)
    })
})

async function checkAuth() {
    try {
        // First check sessionStorage for access token
        const accessToken = sessionStorage.getItem('accessToken')

        if (accessToken) {
            // If we have a token, fetch user info or just set the authenticated state
            isAuthenticated.value = true
            await fetchUserInfo()
            return
        }

        // If no token in storage, try the backend's auth checking endpoint
        // Use the endpoint name that exists in backend (chechAuth) نايس ولع
        try {
            const response = await apiClient.get('/api/auth/chechAuth')

            if (response.data.success) {
                isAuthenticated.value = true
                // ربنا يولي من يصلح
                userName.value = response.data.user.name || 'User'

                // Store user info
                if (response.data.user) {
                    sessionStorage.setItem('userInfo', JSON.stringify(response.data.user))
                }
            } else {
                handleLogout()
            }
        } catch (authCheckError) {
            // If that fails, we're not authenticated
            handleLogout()
        }
    } catch (error) {
        console.log('Auth check failed:', error)
        handleLogout()
    }
}
// ربنا يولي من يصلح
// async function fetchUserInfo() {
//     try {
//         // Try to get cached user info first
//         const cachedUserInfo = sessionStorage.getItem('userInfo')
//         if (cachedUserInfo) {
//             const userInfo = JSON.parse(cachedUserInfo)
//             userName.value = userInfo.name || 'User'
//             return
//         }

//         // If using the backend's auth checking endpoint returns user data, use that
//         try {
//             const response = await apiClient.get('/api/auth/chechAuth')
//             if (response.data.user) {
//                 userName.value = response.data.user.name || 'User'
//                 sessionStorage.setItem('userInfo', JSON.stringify(response.data.user))
//                 return
//             }
//         } catch (error) {
//             console.error('Error fetching user info from auth check:', error)
//         }

//         // Fall back to default
//         userName.value = 'User'
//     } catch (error) {
//         console.error('Error in fetchUserInfo:', error)
//         userName.value = 'User'
//     }
// }

// Updated logout function
async function logout() {
    try {
        // Call the backend logout API (which clears the "token" cookie)
        await apiClient.post('/api/auth/logout')

        // Also clear sessionStorage items
        sessionStorage.removeItem('accessToken')
        sessionStorage.removeItem('refreshToken')
        sessionStorage.removeItem('userInfo')

        // Update local state
        isAuthenticated.value = false
        userName.value = 'User'

        // Redirect to home page
        navigateTo('/')
    } catch (error) {
        console.error('Logout error:', error)
        // Even if the API call fails, clear local state
        sessionStorage.removeItem('accessToken')
        sessionStorage.removeItem('refreshToken')
        sessionStorage.removeItem('userInfo')
        isAuthenticated.value = false
        userName.value = 'User'
        navigateTo('/')
    }
}
</script>