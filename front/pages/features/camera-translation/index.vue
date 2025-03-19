<script setup>
import { ref, onMounted, computed } from 'vue';
import { useSeoMeta, useHead } from '#imports';
import { usePlaygroundStore } from '@/stores/playgroundStore';
import VideoPlayer from '@/components/VideoPlayer.vue';
import SettingsMenu from '@/components/SettingsMenu.vue';

const store = usePlaygroundStore();

// Using computed for Arabic title instead of Hebrew
const pageTitle = computed(() => store.language === 'ar' ? 'مترجم الإشارة' : 'Sign Translator');

// Set both SEO and document title consistently
useSeoMeta({
  title: pageTitle
});

useHead({
  title: pageTitle
});

onMounted(() => {
  // Initialize the store with default values
  store.init();
});
</script>

<template>
  <div class="playground-container">
    <div class="menu-container">
      <SettingsMenu />
    </div>
    <div class="video-container">
      <VideoPlayer :video-url="store.videoUrl" />
    </div>
  </div>
</template>

<style scoped>
.playground-container {
  display: flex;
  height: calc(100vh - var(--header-height, 0px) - var(--footer-height, 0px));
}

.menu-container {
  width: 250px;
  background: #f4f4f4;
  overflow-y: auto;
}

.video-container {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

@media (max-width: 768px) {
  .playground-container {
    flex-direction: column;
  }

  .menu-container {
    width: 100%;
    height: auto;
  }
}
</style>