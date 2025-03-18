<script setup lang="ts">
import { ref } from 'vue';
import DailyIframe from '@daily-co/daily-js';
import apiClient from '~/utils/apiClient.js';
import InputField from '@/components/InputField.vue';
import TheButton from '@/components/TheButton.vue';

const name = ref('');
const errorMessage = ref('');
const roomUrl = ref('');

const dailyFrameManager = {
  currentFrame: null as DailyIframe | null,

  destroyExistingFrames() {
    if (this.currentFrame) {
      try {
        this.currentFrame.destroy();
      } catch (e) {
        console.error('Error destroying current frame:', e);
      }
      this.currentFrame = null;
    }

    const existingFrames = document.querySelectorAll(
      'iframe[data-daily-frame]',
    );
    existingFrames.forEach((frame) => {
      try {
        frame.parentNode?.removeChild(frame);
      } catch (e) {
        console.error('Error removing iframe:', e);
      }
    });
  },

  async createFrame(options: DailyIframe.Properties) {
    this.destroyExistingFrames();
    await new Promise((resolve) => setTimeout(resolve, 100));
    const frame = DailyIframe.createFrame(options);
    this.currentFrame = frame;
    return frame;
  },
};

const joinRoom = async () => {
  try {
    errorMessage.value = '';
    const roomName = name.value.trim();

    if (!roomName) {
      errorMessage.value = 'Please enter a room name';
      return;
    }

    const response = await apiClient.get(`api/daily/room/${roomName}`);
    const roomData = response.data;

    const res = await apiClient.post('api/daily/roomToken');
    const token = res.data.token;
    await createRoomFrame(roomData.url, token);
  } catch (error: any) {
    console.error('Error joining room:', error);
    errorMessage.value = error.response?.data?.message || error.message;
  }
};

const createRoomFrame = async (url: string, token?: string) => {
  try {
    const call = await dailyFrameManager.createFrame({
      iframeStyle: {
        position: 'fixed',
        border: '1px solid black',
        width: '375px',
        height: '450px',
        right: '1em',
        bottom: '1em',
      },
      dailyConfig: {
        micAudioMode: 'music',
      },
      showLeaveButton: true,
      showFullscreenButton: true,
    });

    call.on('error', (error) => {
      console.error('Daily.co error:', error);
      errorMessage.value = error.errorMsg;
    });

    call.on('room:joined', () => {
      console.log('Successfully joined room');
    });

    call.on('room:left', () => {
      console.log('Left room');
      dailyFrameManager.destroyExistingFrames();
    });

    call.on('left-meeting', () => {
      console.log('Left meeting event triggered');
      dailyFrameManager.destroyExistingFrames();
    });

    await call.join({ url, token });
  } catch (error: any) {
    console.error('Error creating room frame:', error);
    errorMessage.value = error.message;
  }
};
</script>

<template>
  <main class="flex-grow">
    <div class="max-w-lg mx-auto py-12">
      <h1 class="text-3xl font-bold text-center">Join Room</h1>
      <div class="space-y-4 mt-6">
        <InputField
          v-model="name"
          id="name"
          label="Room Name"
          placeholder="Enter room name"
          @keyup.enter="joinRoom"
        />
        <TheButton @click="joinRoom" class="w-full">Join Room</TheButton>
      </div>
      <div v-if="errorMessage" class="mt-4 text-center text-red-500">
        {{ errorMessage }}
      </div>
    </div>
  </main>
</template>