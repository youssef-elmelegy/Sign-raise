<script setup lang="ts">
onMounted(() => {
  const savedSection = localStorage.getItem('selectedBlogSection');
  console.log('Loaded section:', savedSection);
  if (savedSection) {
    toggleSection(savedSection);
  }
});

const sections = ref([
  {
    id: 'resources',
    title: 'Learning Resources',
    icon: 'i-heroicons-book-open',
    active: true
  },
  {
    id: 'testimonials',
    title: 'Success Stories',
    icon: 'i-heroicons-chat-bubble-left-right',
    active: false
  },
  {
    id: 'practice',
    title: 'Practice Sessions',
    icon: 'i-heroicons-academic-cap',
    active: false
  }
]);

const activeSection = ref('resources');
const isSidebarOpen = ref(false);

const toggleSection = (sectionId: string) => {
  activeSection.value = sectionId;
  sections.value = sections.value.map(section => ({
    ...section,
    active: section.id === sectionId
  }));
};

const resources = ref([
  {
    id: 1,
    title: "ASL Fingerspelling Basics",
    description: "Master the ASL alphabet and numbers. Perfect for beginners starting their sign language journey.",
    level: "Beginner",
    duration: "2 hours",
    link: "https://www.handspeak.com/learn/",
    image: "/images/fingerspelling.jpg"
  },
  {
    id: 2,
    title: "Essential ASL Phrases",
    description: "Learn common everyday phrases including greetings, questions, and basic conversations.",
    level: "Beginner",
    duration: "3 hours",
    link: "https://www.startasl.com/basic-phrases/",
    image: "/images/phrases.jpg"
  },
  {
    id: 3,
    title: "ASL Grammar Structure",
    description: "Understanding ASL sentence structure, facial expressions, and proper signing space.",
    level: "Intermediate",
    duration: "4 hours",
    link: "https://www.lifeprint.com/asl101/",
    image: "/images/grammar.jpg"
  },
  {
    id: 4,
    title: "Medical Sign Language",
    description: "Essential signs for healthcare settings and medical emergencies.",
    level: "Advanced",
    duration: "5 hours",
    link: "https://www.nad.org/resources/health-care/",
    image: "/images/medical.jpg"
  },
  {
    id: 5,
    title: "ASL for Emergency Situations",
    description: "Critical signs for emergency communication and safety procedures.",
    level: "Intermediate",
    duration: "2.5 hours",
    link: "https://www.gallaudet.edu/asl-connect/",
    image: "/images/emergency.jpg"
  },
  {
    id: 6,
    title: "Business ASL Communication",
    description: "Professional sign language for workplace environments and business meetings.",
    level: "Advanced",
    duration: "6 hours",
    link: "https://www.signingsavvy.com/wordlist/business",
    image: "/images/business.jpg"
  }
]);
// Add this after the resources ref
// Update the testimonials array
const testimonials = ref([
  {
    id: 1,
    name: "Sarah Chen",
    role: "Medical Student",
    avatar: "https://img.icons8.com/office/40/businesswoman.png",
    isImage: true,
    story: "As a medical student, learning sign language through SignRaise has been invaluable. I can now better communicate with deaf patients during my clinical rotations. The medical terminology section was particularly helpful!"
  },
  {
    id: 2,
    name: "David Martinez",
    role: "Teacher",
    avatar: "https://img.icons8.com/color/48/circled-user-male-skin-type-7--v1.png",
    isImage: true,
    story: "I'm a teacher with two deaf students in my class. SignRaise helped me create a more inclusive classroom environment. The basic phrases and educational terms have made a huge difference in my daily interactions."
  },
  {
    id: 3,
    name: "Emily Thompson",
    role: "Business Professional",
    avatar: "https://img.icons8.com/office/40/businesswoman.png",
    isImage: true,
    story: "Working in a diverse corporate environment, I wanted to be more inclusive. SignRaise's business communication module helped me learn professional sign language. Now I can conduct basic meetings with deaf colleagues!"
  },
  {
    id: 4,
    name: "Michael Okonjo",
    role: "Community Worker",
    avatar: "https://img.icons8.com/color/48/circled-user-male-skin-type-7--v1.png",
    isImage: true,
    story: "In my community outreach work, I meet people from all walks of life. SignRaise's emergency and basic communication modules have helped me break down barriers and provide better support to the deaf community."
  }
]);
</script>

<template>
  <div class="relative bg-gray-50">
    <!-- Mobile Sidebar Toggle -->
    <div class="lg:hidden fixed top-24 left-4 z-30">
      <button @click="isSidebarOpen = !isSidebarOpen" class="p-2 bg-white rounded-lg shadow-md">
        <span class="sr-only">Toggle Sidebar</span>
        <i class="i-heroicons-bars-3 w-6 h-6"></i>
      </button>
    </div>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed z-20 h-[calc(100vh-5rem)] transition-transform',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
      class="w-64 bg-white border-r border-gray-200 top-20"
    >
      <nav class="p-4 space-y-2">
        <button
          v-for="section in sections"
          :key="section.id"
          @click="toggleSection(section.id)"
          :class="[
            'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left',
            section.active
              ? 'bg-purple-heart-50 text-purple-heart-600'
              : 'hover:bg-gray-50 text-gray-700'
          ]"
        >
          <i :class="[section.icon, 'w-5 h-5']"></i>
          <span class="font-medium">{{ section.title }}</span>
        </button>
      </nav>
    </aside>

    <!-- Main Content -->
    <main class="min-h-screen lg:ml-64 p-8 pt-20">
      <!-- Updated Resources Section -->
      <div id="resources" v-if="activeSection === 'resources'" class="space-y-8">
        <h1 class="text-3xl font-bold text-gray-900">Sign Language Learning Resources</h1>
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="resource in resources" 
            :key="resource.id" 
            class="bg-white rounded-xl shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
          >
            <div class="aspect-video bg-purple-heart-50 relative overflow-hidden">
              <img 
                :src="resource.image" 
                :alt="resource.title"
                class="object-cover w-full h-full"
              />
              <span class="absolute top-2 right-2 px-3 py-1 bg-purple-heart-600 text-white text-sm rounded-full">
                {{ resource.level }}
              </span>
            </div>
            <div class="p-6">
              <div class="flex items-center gap-2 mb-3">
                <i class="i-heroicons-clock w-4 h-4 text-gray-500"></i>
                <span class="text-sm text-gray-500">{{ resource.duration }}</span>
              </div>
              <h3 class="text-lg font-semibold mb-2">{{ resource.title }}</h3>
              <p class="text-gray-600 mb-4">{{ resource.description }}</p>
              <a 
                :href="resource.link" 
                target="_blank" 
                class="inline-flex items-center text-purple-heart-600 font-medium hover:underline"
              >
                Start Learning 
                <i class="i-heroicons-arrow-right w-4 h-4 ml-1"></i>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Testimonials Section -->
      <div id="testimonials" v-if="activeSection === 'testimonials'" class="space-y-8">
        <h1 class="text-3xl font-bold text-gray-900">Success Stories</h1>
        <div class="grid md:grid-cols-2 gap-6">
          <div 
            v-for="testimonial in testimonials" 
            :key="testimonial.id" 
            class="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div class="flex items-center gap-4 mb-4">
              <div class="w-12 h-12 bg-purple-heart-100 rounded-full flex items-center justify-center overflow-hidden">
                <template v-if="testimonial.isImage">
                  <img :src="testimonial.avatar" :alt="testimonial.name" class="w-full h-full object-cover" />
                </template>
                <template v-else>
                  <i :class="[testimonial.avatar, 'w-8 h-8 text-purple-heart-600']"></i>
                </template>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900">{{ testimonial.name }}</h3>
                <p class="text-purple-heart-600 text-sm">{{ testimonial.role }}</p>
              </div>
            </div>
            <p class="text-gray-600 italic">
              "{{ testimonial.story }}"
            </p>
          </div>
        </div>
      </div>

      <div id="practice" v-if="activeSection === 'practice'" class="space-y-8">
        <h1 class="text-3xl font-bold text-gray-900">Practice Sessions</h1>
        <div class="flex flex-col items-center justify-center p-12 text-center">
          <svg class="w-64 h-64 mb-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#7e22ce" stroke-width="2" stroke-dasharray="4 4"/>
            <path d="M12 8V12L15 15" stroke="#7e22ce" stroke-width="2" stroke-linecap="round"/>
            <path d="M12 6V8" stroke="#7e22ce" stroke-width="2" stroke-linecap="round"/>
            <path d="M16 8L18 6" stroke="#7e22ce" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <h2 class="text-2xl font-bold text-purple-heart-600 mb-4">Coming Soon!</h2>
          <p class="text-gray-600 max-w-md">
            We're working hard to bring you interactive practice sessions. Stay tuned for an immersive learning experience that will help you master sign language.
          </p>
        </div>
      </div>

    </main>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>