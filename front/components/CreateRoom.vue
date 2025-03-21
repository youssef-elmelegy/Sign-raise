<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import apiClient from '~/utils/apiClient.js';
import DailyIframe from '@daily-co/daily-js';

const privacy = ref('private');
const name = ref('');
const roomUrl = ref('');
const showButton = ref(false);
const errorMessage = ref('');
const isLoading = ref(false);

const dailyFrameManager = {
  currentFrame: null,

  destroyExistingFrames() {
    if (this.currentFrame) {
      try {
        this.currentFrame.destroy();
      } catch (e) {
        console.error('Error destroying frame:', e);
      }
      this.currentFrame = null;
    }

    document.querySelectorAll('iframe[data-daily-frame]').forEach((frame) => {
      frame.parentNode?.removeChild(frame);
    });
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

const setupCallEvents = (call) => {
  dailyFrameManager.currentFrame = call;
  const eventsThatCleanup = [
    'left-meeting',
    'room:left',
    'call-ended',
    'participant-left',
  ];

  eventsThatCleanup.forEach((eventName) => {
    call.on(eventName, () => {
      console.log(`${eventName} event triggered`);
      dailyFrameManager.destroyExistingFrames();
    });
  });

  call.on('error', (error) => {
    console.error('Daily.co error:', error);
    errorMessage.value = error.errorMsg || 'Call error occurred';
    dailyFrameManager.destroyExistingFrames();
  });
};

const createRoom = async () => {
  try {
    errorMessage.value = '';
    isLoading.value = true;

    if (!name.value.trim()) {
      errorMessage.value = 'Please enter a room name';
      isLoading.value = false;
      return;
    }

    try {
      const checkResponse = await apiClient.get(`api/daily/room/${name.value.trim()}`);
      if (checkResponse.status === 200) {
        errorMessage.value = `Room "${name.value.trim()}" already exists. Please choose a unique name.`;
        isLoading.value = false;
        return;
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Error checking room existence:', error);
      }
    }

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

    roomUrl.value = response.data.url;

    if (privacy.value === 'private') {
      await getToken(name.value.trim());
    } else {
      await createRoomFrame(roomUrl.value);
    }
  } catch (error) {
    console.error('Error creating room:', error);
    errorMessage.value = error.response?.data?.message || 'Failed to create room';
    dailyFrameManager.destroyExistingFrames();
  } finally {
    isLoading.value = false;
  }
};

const getToken = async (roomName) => {
  try {
    const response = await apiClient.post('api/daily/roomToken');
    const token = response.data.token;
    await createRoomFrame(roomUrl.value, token);
  } catch (err) {
    console.error('Error getting token:', err);
    errorMessage.value = err.response?.data?.message || 'Failed to get access token';
    dailyFrameManager.destroyExistingFrames();
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
        zIndex: 9999,
      },
      dailyConfig: {
        micAudioMode: 'music',
      },
      showLeaveButton: true,
      showFullscreenButton: true,
    });

    setupCallEvents(call);
    if (token) {
      await call.join({ url: roomUrl, token });
    } else {
      await call.join({ url: roomUrl });
    }
    showButton.value = true;
  } catch (e) {
    console.error('Error in createRoomFrame:', e);
    errorMessage.value = e.message || 'Failed to create call frame';
    dailyFrameManager.destroyExistingFrames();
  }
};

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
                placeholder="Enter an unique name"
                @keyup.enter="createRoom"
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
        <TheButton @click="createRoom" :disabled="isLoading">
          {{ isLoading ? 'Creating...' : 'Start Video Call' }}
        </TheButton>
      </div>

      <div v-if="errorMessage" class="mt-4 text-center text-red-500">
        {{ errorMessage }}
      </div>
    </div>
  </main>
</template>
