<script setup>
import CreateRoom from '~/components/CreateRoom.vue';
import JoinRoom from '~/components/JoinRoom.vue';
import TheButton from "~/components/TheButton.vue";
import signLang from "~/components/SignLanguageTracker.vue"
const tabList = [
  {
    title: 'Create Room',
    component: markRaw(CreateRoom),
  },
  {
    title: 'Join Room',
    component: markRaw(JoinRoom),
  }
]

const selectedTab = ref(tabList[0])

const setActiveTab = (tab) => {
  console.log(tab)
  selectedTab.value = tab
}
async function loadRawCameraFromDaily() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    const videoElement = document.createElement('video');
    videoElement.srcObject = stream;
    videoElement.autoplay = true;
    videoElement.style.position = 'fixed';
    videoElement.style.bottom = '1em';
    videoElement.style.left = '1em';
    videoElement.style.width = '375px';
    videoElement.style.height = '450px';
    videoElement.style.border = '1px solid black';
    document.body.appendChild(videoElement);
  } catch (error) {
    console.error("Error accessing camera:", error);
  }
}
</script>
<template>
  <main class="flex-grow">
    <div class="max-w-lg mx-auto py-12">
      <h1 class="text-3xl font-bold text-center">Video Call with Live Translation</h1>
      <p class="text-center text-gray-600 mt-2">Start a video call with live translation</p>

      <div class="flex justify-center rounded-lg p-2 border border-purple-heart-100 space-x-4 mt-6 mb-8">
        <button
            v-for="tab in tabList"
            :key="tab.title"
            @click="setActiveTab(tab)"
            class="px-4 py-2 rounded-lg w-1/2 transition-colors"
            :class="selectedTab === tab
            ? 'bg-purple-heart-100 text-purple-heart-700'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-700'"
        >
          {{ tab.title }}
        </button>
      </div>

      <div class="flex flex-col justify-center my-4">
        <component :is="selectedTab.component" />
      </div>
    </div>
    <div class="flex">
      <sign-lang />
    </div>
  </main>
</template>