<script setup>
import apiClient from '~/utils/apiClient.js';
const privacy = ref('private');
const name = ref('');

const createRoom = async () => {
  const response = await apiClient.post('api/daily/rooms', {
    name: name.value.trim(),
    privacy: privacy.value,
    properties: {
      enable_chat: true,
      enable_knocking: true,
      enable_screenshare: true,
      enable_video: true,
      enable_recording: true,
      enable_transcription: true,
      enable_waiting_room: true,
      enable_watermark: true,
      start_video_off: true,
      start_audio_off: true,
      auto_recording: 'local',
      enable_live_translation: true,
      enable_live_translation_for: 'all',
      enable_recording_transcription: true,
      enable_recording_translation: true,
      enable_recording_transcription_for: 'all',
      enable_recording_transcription_type: 'automatic',
      enable_recording_transcription_languages: ['ar', 'en', 'es', 'fr', 'de', 'it', 'ja', 'ko', 'pt', 'ru', 'zh'],
      enable_recording_transcription_languages_for: 'all',
      enable_recording_transcription_languages_type: 'automatic',
    }
  });
  console.log(response);
};
</script>
<template>

    <main class="flex-grow">
      <div class="max-w-lg mx-auto py-12">
        <h1 class="text-3xl font-bold text-center">Video Call with Live Translation</h1>
        <p class="text-center text-gray-600 mt-2">Start a video call with live translation</p>
        <div class="flex flex-col justify-center my-4">
          <div class="flex mb-4  justify-center  items-center space-x-4">
            <div>
            <InputField v-model="name" id="name" label="Room Name" placeholder="Enter room name" /></div>
            <div class="flex flex-col items-center">
            <label for="privacy" class="text-gray-600">Room privacy</label>
            <select v-model="privacy" id="privacy" class="border border-gray-300 rounded-md px-4 py-1">
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>
          </div>
          <TheButton @click="createRoom" >Start Video Call</TheButton>
        </div>
      </div>
    </main>

</template>