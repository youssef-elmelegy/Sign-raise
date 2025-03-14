<script setup lang="ts">
import { useForm} from "@formwerk/core";
import { userSchema } from "~/schema/userSchema";
import apiClient from "~/utils/apiClient";
const showErrors = ref('');
const schema = userSchema;
const {isSubmitting, handleSubmit } = useForm({schema});

const submitUser = handleSubmit(async (data) => {
  try {
   const  response = await apiClient.post("/api/auth/signup", data);

  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.error &&
      error.response.data.error.message
    ) {
      showErrors.value = error.response.data.error.message;
    } else {
      console.error(error);
    }
  }
});


</script>

<template>
  <form @submit.prevent="submitUser" class="max-w-sm mx-auto mt-8 space-y-4 rounded-lg border flex flex-col justify-center items-center border-purple-heart-400 p-4">
    <NuxtImg src="/images/logo.png" alt="logo signup" />
    <inputField name="name" label="Name" />
    <inputField name="email" label="Email" />
    <inputField name="password" label="Password" type="password" />
    <TheButton type="submit" :disabled="isSubmitting">
      Sign Up
    </TheButton>
    <p v-show="showErrors" class="text-red-500 border border-red-200 bg-red-300 text-sm">{{ showErrors }}</p>
    <p class="text-center text-sm mt-4">
      Already have an account? <NuxtLink to="/log_in" class="text-purple-heart-400">Log In</NuxtLink>
    </p>
  </form>

</template>
