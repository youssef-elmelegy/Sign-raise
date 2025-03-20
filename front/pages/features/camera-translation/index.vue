<template>
  <div>
    <main class="py-8 px-4">
      <div class="container mx-auto">
        <div class="max-w-6xl mx-auto">
          <h1 class="text-3xl font-bold mb-6 text-primary">{{ pageTitle }}</h1>

          <div class="camera-translation-container">
            <div class="settings-panel">
              <SettingsMenu />
            </div>
            <div class="video-panel">
              <VideoPlayer :video-url="store.videoUrl" />
            </div>
          </div>

          <div v-if="store.translatedText"
            class="translation-result mt-6 p-4 bg-primary-50 border border-primary-200 rounded-xl">
            <h2 class="text-lg font-medium text-primary-900 mb-2">Translation</h2>
            <p class="text-2xl font-medium">{{ store.translatedText }}</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useSeoMeta, useHead } from '#imports';
import { usePlaygroundStore } from '@/stores/playgroundStore';
import VideoPlayer from '@/components/VideoPlayer.vue';
import SettingsMenu from '@/components/SettingsMenu.vue';

const store = usePlaygroundStore();

// Support multiple languages with fallback to English
const pageTitle = computed(() => {
  switch (store.language) {
    case 'ar': return 'مترجم الإشارة';
    default: return 'Sign Language Translator';
  }
});

// Set both SEO and document title consistently
useSeoMeta({
  title: pageTitle,
  description: 'Translate sign language in real-time using your camera'
});

useHead({
  title: pageTitle
});

onMounted(() => {
  // Initialize the store with default values
  store.init();
});
</script>

<style scoped>
.camera-translation-container {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 1.5rem;
  min-height: 550px;
  background-color: var(--color-background);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.settings-panel {
  background-color: var(--color-background-soft);
  border-right: 1px solid var(--color-border);
}

.video-panel {
  position: relative;
  height: 100%;
  min-height: 500px;
}

.translation-result {
  background-color: var(--color-background-soft);
  border-color: var(--color-border);
}

@media (max-width: 768px) {
  .camera-translation-container {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }

  .settings-panel {
    border-right: none;
    border-bottom: 1px solid var(--color-border);
  }
}
</style>