<template>
    <section
        class="relative flex flex-col items-center text-center p-10 md:p-20 bg-gradient-to-b from-[#f7f9fc] to-[#ffffff]">
        <!-- Floating Background Element -->
        <div
            class="absolute top-0 left-1/2 transform -translate-x-1/2 w-[90%] h-[450px] bg-[#6e5df7] opacity-10 blur-3xl">
        </div>

        <!-- Text Content -->
        <div class="relative z-10 max-w-3xl">
            <h1 class="text-4xl md:text-6xl font-extrabold leading-tight text-gray-900">
                Empowering Conversations with AI
            </h1>
            <p class="mt-4 text-lg text-gray-700 md:text-xl">
                Breaking barriers for the deaf community with real-time sign language translation and AI-powered
                communication.
            </p>

            <!-- CTA Buttons -->
            <div class="mt-8 flex flex-col sm:flex-row sm:space-x-6">
                <NuxtLink to="/signup"
                    class="px-6 py-3 text-lg font-semibold bg-[#6e5df7] text-white rounded-lg hover:bg-[#5f3fec] transition-all shadow-lg">
                    Get Started
                </NuxtLink>
                <NuxtLink to="/features"
                    class="mt-4 sm:mt-0 px-6 py-3 text-lg font-semibold bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-all">
                    Learn More
                </NuxtLink>
            </div>
        </div>

        <!-- Illustration -->
        <div class="relative z-10 mt-10 md:mt-16">
            <!-- <img src="/adasdasd.svg" alt="AI-powered communication" class="w-full max-w-2xl" /> -->
        </div>
    </section>
</template>