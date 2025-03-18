<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import apiClient from '~/utils/apiClient.js';
import DailyIframe from '@daily-co/daily-js';

const privacy = ref('private');
const name = ref('');
const roomUrl = ref('');
const dailyFrameManager = {
  currentFrame: null,

  destroyExistingFrames() {
    const existingFrames = document.querySelectorAll(
      'iframe[data-daily-frame]',
    );
    existingFrames.forEach((frame) => {
      try {
        const frameInstance = DailyIframe.wrap(frame);
        frameInstance.destroy();
      } catch (e) {
        console.log('Error destroying frame:', e);
        if (frame.parentNode) {
          frame.parentNode.removeChild(frame);
        }
      }
    });
    this.currentFrame = null;
  },

  createFrame(options) {
    this.destroyExistingFrames();

    return new Promise((resolve) => {
      setTimeout(() => {
        const frame = DailyIframe.createFrame(options);
        this.currentFrame = frame;
        resolve(frame);
      }, 100);
    });
  },
};

const createRoom = async () => {
  try {
    const response = await apiClient.post('api/daily/rooms', {
      name: name.value.trim(),
      privacy: privacy.value,
      properties: {
        enable_chat: true,
        enable_prejoin_ui: true,
        start_audio_off: false,
        start_video_off: false,
        enable_screenshare: true,
      },
    });
    console.log(response);
    console.log(response.data);
    roomUrl.value = response.data.url;
    if (privacy.value === 'private') {
      await getToken(name.value.trim());
    } else {
      await createRoomFrame(roomUrl.value);
    }
  } catch (error) {
    console.error('Error creating room:', error);
  }
};

const getToken = async (roomName) => {
  try {
    const response = await apiClient.post('api/daily/roomToken');
    const token = response.data.token;
    await createRoomFrame(roomUrl.value, token);
  } catch (err) {
    console.error('Error getting token:', err);
  }
};

const createRoomFrame = async (roomUrl, token = null) => {
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
      errorMessage.value = error.errorMsg || 'Call error occurred';
    });

    call.on('left-meeting', () => {
      console.log('Left meeting');
      callActive.value = false;
      dailyFrameManager.destroyExistingFrames();
    });

    call.on('room:left', () => {
      console.log('Left room');
      callActive.value = false;
      dailyFrameManager.destroyExistingFrames();
    });

    if (token) {
      call.join({ url: roomUrl, token });
    } else {
      call.join({ url: roomUrl });
    }
  } catch (e) {
    console.error('Error in createRoomFrame:', e);
  }
};

// Lifecycle hooks to manage frames
onMounted(() => {
  dailyFrameManager.destroyExistingFrames();
});

onBeforeUnmount(() => {
  dailyFrameManager.destroyExistingFrames();
});
</script>

<template>
  <main class="flex-grow">
    <div class="max-w-lg mx-auto py-12">
      <h1 class="text-3xl font-bold text-center">
        Video Call with Live Translation
      </h1>
      <p class="text-center text-gray-600 mt-2">
        Start a video call with live translation
      </p>

      <div class="flex flex-col justify-center my-4">
        <div class="flex mb-4 justify-center items-center space-x-4">
          <div>
            <InputField
              v-model="name"
              id="name"
              label="Room Name"
              placeholder="Enter room name"
            />
          </div>
          <div class="flex flex-col items-center">
            <label for="privacy" class="text-gray-600">Room privacy</label>
            <select
              v-model="privacy"
              id="privacy"
              class="border border-gray-300 rounded-md px-4 py-1"
            >
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>
        </div>
        <TheButton @click="createRoom">Start Video Call</TheButton>
      </div>
    </div>
  </main>
</template>
