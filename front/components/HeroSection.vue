<template>
    <section class="py-20 bg-gradient-to-br from-purple-heart-50 to-white">
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row items-center">
                <div class="md:w-1/2 mb-10 md:mb-0">
                    <h1 class="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        Breaking Communication Barriers with AI Sign Language Translation
                    </h1>
                    <p class="text-xl text-gray-600 mb-8">
                        Connect seamlessly with the deaf community through real-time sign language translation, video
                        calls, and more.
                    </p>
                    <div class="flex flex-col sm:flex-row gap-4">
                        <NuxtLink to="/sign_up">
                            <button
                                class="bg-purple-heart-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-purple-heart-700 transition shadow-lg cursor-pointer">
                                Get Started
                            </button>
                            <!-- <TheButton>
                                Get Started
                            </TheButton> -->
                        </NuxtLink>
                        <!-- TODO: Replace with actual demo video link -->
                         <NuxtLink to="/">
                        <button
                            class="border-2 border-purple-heart-600 text-purple-heart-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-purple-heart-50 transition cursor-pointer">
                            Watch Demo
                        </button>
                        </NuxtLink>
                    </div>
                </div>
                <div class="md:w-1/2">
                    <div class="relative">
                        <!-- TODO: Replace with actual image -->
                        <img src="/placeholder.svg?height=400&width=500"
                            alt="Sign language translation app demonstration" class="rounded-xl shadow-2xl mx-auto" />
                        <div
                            class="absolute -bottom-5 -right-5 bg-purple-heart-600 text-white p-4 rounded-lg shadow-lg">
                            <div class="flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" class="lucide lucide-hand mr-2">
                                    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
                                    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
                                    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
                                    <path
                                        d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
                                </svg>
                                <span>AI-Powered Translation</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>