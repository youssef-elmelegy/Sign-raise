<template>
    <section class="py-20 bg-gradient-to-r from-purple-heart-600 to-purple-heart-700 text-white">
        <div class="container mx-auto px-4 text-center">
            <h2 class="text-3xl md:text-4xl font-bold mb-6">Ready to Break Communication Barriers?</h2>
            <p class="text-xl mb-8 max-w-2xl mx-auto">
                Join thousands of users who are already transforming how they communicate with the deaf community.
            </p>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <NuxtLink to="/sign-up">
                    <button
                        class="bg-white text-purple-heart-600 px-8 py-3 rounded-full text-lg font-medium hover:bg-purple-heart-50 transition shadow-lg cursor-pointer">
                        Get Started for Free
                    </button>
                </NuxtLink>
                <NuxtLink to="/features/video-call">
                    <button
                        class="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-purple-heart-600 hover:bg-opacity-10 transition cursor-pointer">
                        Schedule a Demo
                    </button>
                </NuxtLink>
            </div>
        </div>
    </section>
</template>