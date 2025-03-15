<script setup lang="ts">
import { useForm } from "@formwerk/core";
import { loginSchema } from "~/schema/userSchema";
import apiClient from "~/utils/apiClient";

const schema = loginSchema;
const loginErrorMessage = ref("");

const {handleSubmit, isSubmitting} = useForm({
  schema
});

const logIn = handleSubmit(async (data) => {
  try {
    const response = await apiClient.post("api/auth/login", data);
    sessionStorage.setItem("accessToken", response.data.accessToken);
    sessionStorage.setItem("refreshToken", response.data.refreshToken);
    window.location.href = "/";
    console.log(response);
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.error &&
      error.response.data.error.message
    ) {
      if (error.response.data.error.message === "Invalid credentials") {
        loginErrorMessage.value =
          "Invalid username or password, please try again.";
      } else {
        loginErrorMessage.value = error.response.data.error.message;
      }
    } else {
      console.error(error);
    }
  }
});
</script>

<template>
  <form @submit.prevent="logIn"  class="max-w-sm mx-auto mt-8 space-y-4 rounded-lg border flex flex-col justify-center items-center border-purple-heart-400 p-4">
    <NuxtImg src="/images/logo.png" alt="logo" />
    <inputField name="email" label="Email" />
    <inputField name="password" label="Password" type="password" />
    <TheButton :disabled="isSubmitting" type="submit" >
      {{ isSubmitting ? "login..." : "login" }}
      <img
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAy0lEQVR4nM3TUUqCURAF4J+MelFXILmKENTA1Si1CteQuQJRtxDtxUpsEb59MXTJ+Pv/bqAPnrfLmTn3cGamKE4N3GGJLfb4wBrDXGMDc7zhAV1coYMxXhN/WSfwhBe0a/gmnkOkiuxhE0UZl63kcJBJ4gBMS+8JVsV/4QvfIriJYKuKchil2uuYzjEOutgdk8F97Em56DbNOTeFNt7RryJnaQ9afzQHP6tTv8BjaRMjsEg9bMfP8Un1Jv4QGmCRGuIWduk2fts+C3wCojcuU/AEC20AAAAASUVORK5CYII="
          alt="login-rounded-right"
      />
    </TheButton>
    <p v-show="loginErrorMessage" class="text-red-500 border border-red-200 bg-red-300 text-sm">{{ loginErrorMessage }}</p>
    <p class="text-center text-sm">
      Don't have an account? <NuxtLink to="/sign_up" class="text-purple-heart-400">Sign Up</NuxtLink>
    </p>
  </form>
</template>
