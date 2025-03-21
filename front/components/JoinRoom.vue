<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import DailyIframe from '@daily-co/daily-js';
import apiClient from '~/utils/apiClient.js';
import InputField from '@/components/InputField.vue';
import TheButton from '@/components/TheButton.vue';

const name = ref('');
const errorMessage = ref('');
const roomUrl = ref('');
const isLoading = ref(false);

const dailyFrameManager = {
  currentFrame: null as DailyIframe | null,

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

// Setup event listeners that properly handle cleanup
const setupCallEvents = (call: DailyIframe) => {
  dailyFrameManager.currentFrame = call;
  const eventsThatCleanup = [
    'left-meeting',
    'room:left',
    'call-ended',
    'participant-left',
  ];

  eventsThatCleanup.forEach((eventName) => {
    call.on(eventName, () => {
      console.log(`${eventName} event Done`);
      dailyFrameManager.destroyExistingFrames();
    });
  });

  call.on('error', (error: any) => {
    console.error('Daily.co error:', error);
    errorMessage.value = error.errorMsg || 'Call error occurred';
    dailyFrameManager.destroyExistingFrames();
  });

  return call;
};

const joinRoom = async () => {
  try {
    errorMessage.value = '';
    isLoading.value = true;
    const roomName = name.value.trim();

    if (!roomName) {
      errorMessage.value = 'Please enter a room name';
      isLoading.value = false;
      return;
    }

    const response = await apiClient.get(`api/daily/room/${roomName}`);
    const roomData = response.data;

    // Get token
    try {
      const res = await apiClient.post('api/daily/roomToken');
      const token = res.data.token;
      await createRoomFrame(roomData.url, token);
    } catch (tokenError: any) {
      console.error('Error getting token:', tokenError);

      if (
        tokenError.response?.status === 401 ||
        tokenError.response?.status === 403
      ) {
        errorMessage.value = 'Please log in to join this room.';
      } else {
        errorMessage.value =
          tokenError.response?.data?.message || 'Failed to get access token';
      }

      dailyFrameManager.destroyExistingFrames();
    }
  } catch (error: any) {
    console.error('Error joining room:', error);

    if (error.response?.status === 401 || error.response?.status === 403) {
      errorMessage.value = 'Please log in to join a room.';
    } else if (error.response?.status === 404) {
      errorMessage.value = `Room "${name.value.trim()}" does not exist.`;
    } else {
      errorMessage.value =
        error.response?.data?.message || error.message || 'Failed to join room';
    }

    dailyFrameManager.destroyExistingFrames();
  } finally {
    isLoading.value = false;
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

    setupCallEvents(call);

    // Join the room
    await call.join({ url, token });
  } catch (error: any) {
    console.error('Error creating room frame:', error);

    if (error.message?.includes('permission')) {
      errorMessage.value =
        'Permission denied. You may not have access to this room.';
    } else {
      errorMessage.value = error.message || 'Failed to create call frame';
    }

    dailyFrameManager.destroyExistingFrames();
  }
};

function loadCameraFromDaily() {
  // if (dailyFrameManager.currentFrame) {
  //   const stream = dailyFrameManager.currentFrame.localVideo();
    // Retrieve the MediaStream from Daily's call frame.
  //   const stream = dailyFrameManager.currentFrame.getLocalMediaStream();
  //   if (stream) {
  //     const videoElement = document.getElementById("webcam");
  //     videoElement.srcObject = stream;
  //     videoElement.play();
  //     // Start your detection loop once the stream is loaded.
  //     videoElement.addEventListener("loadeddata", predictWebcam);
  //   } else {
  //     console.error("No stream received from Daily call frame.");
  //   }
  // } else {
  //   console.error("Daily call frame is not initialized.");
  //   console.log(dailyFrameManager.currentFrame)
  // } else {
  //   console.error("Daily call frame is not initialized.");
  // }
}

// Lifecycle hooks for cleanup
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
      <h1 class="text-3xl font-bold text-center">Join Room</h1>
      <div class="space-y-4 mt-6">
        <InputField
          v-model="name"
          id="name"
          label="Room Name"
          placeholder="Enter room name"
          @keyup.enter="joinRoom"
        />
        <TheButton @click="joinRoom" :disabled="isLoading" class="w-full">
          {{ isLoading ? 'Joining...' : 'Join Room' }}
        </TheButton>
      </div>
      <div v-if="errorMessage" class="mt-4 text-center text-red-500">
        {{ errorMessage }}
      </div>
    </div>
    <!--    <div v-if="showButton" class="fixed bottom-4 left-4">-->
<!--    <div class="fixed bottom-4 left-4">-->
<!--      <TheButton @click="loadRawCameraFromDaily">Load Camera</TheButton>-->
<!--    </div>-->
  </main>
</template>
