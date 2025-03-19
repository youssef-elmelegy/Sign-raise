<script setup>
import { ref, onMounted, watchEffect } from 'vue';
import { useHead } from '@vueuse/head';
import { usePlaygroundStore } from '@/stores/playgroundStore';
import VideoPlayer from '@/components/VideoPlayer.vue';
import SettingsMenu from '@/components/SettingsMenu.vue';

const store = usePlaygroundStore();
const receiveVideo = ref(store.receiveVideo);

useHead({
    title: 'Playground'
});

onMounted(() => {
    if (receiveVideo.value) {
        store.startCamera();
    }
    store.setVideo('assets/tmp/example-sentence.mp4');
});

watchEffect(() => {
    useHead({
        title: store.language === 'he' ? 'גן המשחקים' : 'Playground'
    });
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
    height: 100vh;
}

.menu-container {
    width: 250px;
    background: #f4f4f4;
}

.video-container {
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>
