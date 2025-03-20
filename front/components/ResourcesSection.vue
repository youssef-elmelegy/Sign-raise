<template>
    <section id="resources" class="py-20">
      <div class="container mx-auto px-4">
        <div class="text-center mb-16">
          <h2 class="text-3xl md:text-4xl font-bold mb-4">Learn & Connect</h2>
          <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our resources to learn sign language and connect with the deaf community.
          </p>
        </div>
  
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Card 1 -->
          <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <img src="/placeholder.svg?height=200&width=400" alt="Sign language basics"
              class="w-full h-48 object-cover" />
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2">Sign Language Basics</h3>
              <p class="text-gray-600 mb-4">
                Learn the fundamentals of sign language with our beginner-friendly guides.
              </p>
              <NuxtLink 
                @click="(e) => saveSection('resources', e)"
                to="/blog#resources" 
                class="text-purple-heart-600 hover:text-purple-heart-700 font-medium flex items-center transition"
              >
                Learn More
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" class="lucide lucide-arrow-right ml-1">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </NuxtLink>
            </div>
          </div>
  
          <!-- Card 2 -->
          <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <img src="/placeholder.svg?height=200&width=400" alt="Deaf community stories"
              class="w-full h-48 object-cover" />
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2">Community Stories</h3>
              <p class="text-gray-600 mb-4">
                Read inspiring stories from the deaf community and their experiences.
              </p>
              <NuxtLink 
                @click="(e) => saveSection('testimonials', e)"
                to="/blog#testimonials" 
                class="text-purple-heart-600 hover:text-purple-heart-700 font-medium flex items-center transition"
              >
                Read Stories
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" class="lucide lucide-arrow-right ml-1">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </NuxtLink>
            </div>
          </div>
  
          <!-- Card 3 -->
          <div class="bg-white rounded-xl shadow-md overflow-hidden">
            <img src="/placeholder.svg?height=200&width=400" alt="Practice sign language"
              class="w-full h-48 object-cover" />
            <div class="p-6">
              <h3 class="text-xl font-bold mb-2">Practice Sessions</h3>
              <p class="text-gray-600 mb-4">
                Join our virtual practice sessions to improve your sign language skills.
              </p>
              <NuxtLink 
                @click="(e) => saveSection('practice', e)"
                to="/blog#practice" 
                class="text-purple-heart-600 hover:text-purple-heart-700 font-medium flex items-center transition"
              >
                Join Session
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" class="lucide lucide-arrow-right ml-1">
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script setup>
  const router = useRouter();
  
  const saveSection = async (section, event) => {
    event.preventDefault();
    console.log(section);
    localStorage.setItem('selectedBlogSection', section);
    await router.push(`/blog#${section}`);
  };
  </script>
  