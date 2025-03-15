<script setup lang="ts">
import apiClient from "~/utils/apiClient";
import * as v from 'valibot'
import {useForm} from '@formwerk/core'

const showErrors = ref('')
const code = v.pipe(
    v.string(),
    v.minLength(6),
    v.maxLength(6),
)
const schema = v.object({
    code,
})
const {handleSubmit,  isSubmitting} = useForm({schema})

const verifyEmail = handleSubmit(async (data) => {
    try {
        const response = await apiClient.post("api/auth/verify-email", data);
        window.location.href = "/log_in";
    } catch (error) {
       if (
        error.response &&
        error.response.data &&
        error.response.data.error &&
        error.response.data.error.message
      ) {
        showErrors.value = error.response.data.error.message;
       }
       else {
        console.error(error);
       }
    }
});

const emit = defineEmits(['close'])
const closePopup = () => {
  console.log('close')
    emit('close')
}

</script>

<template>
  <div>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6 z-50">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">Verify Email</h3>
        <button @click="closePopup" type="button" class="text-gray-400 hover:text-gray-500">
          <span class="sr-only">Close</span>
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <form @submit.prevent="verifyEmail" class="space-y-4">
        <inputField name="code" label="Code" required />
        <div class="flex justify-end">
          <TheButton type="submit" :disabled="isSubmitting">
            {{ isSubmitting ? "Verifying..." : "Verify" }}
          </TheButton>
        </div>
      </form>
      <p v-show="showErrors" class="text-red-500 border border-red-200 bg-red-300 text-sm">{{ showErrors }}</p>
    </div>
  </div>
</div>
</template>
