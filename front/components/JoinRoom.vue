<script setup lang="ts">
import apiClient from '~/utils/apiClient.js';

const name = ref('');
const errorMessage = ref('');

const joinRoom = async () => {
  try {
    const response = await apiClient.post('api/daily/room/'+name.value.trim()+'/');
    console.log(response);
    console.log(response.data);
  } catch (error) {
    console.error("Error joining room:", error);
    errorMessage.value = error.message;
  }
};

</script>

<template>
  <main class="flex-grow">
    <div class="max-w-lg mx-auto py-12">
      <h1 class="text-3xl font-bold text-center">Join Room</h1>
      <InputField v-model="name" id="name" label="Room Name" placeholder="Enter room name" />
      <TheButton @click="joinRoom">Join Room</TheButton>
    </div>
    <div v-if="errorMessage" class="text-center text-red-500">
      {{ errorMessage }}
    </div>
  </main>

</template>
