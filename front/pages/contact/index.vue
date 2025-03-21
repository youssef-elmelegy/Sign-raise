<script setup lang="ts">
import emailjs from '@emailjs/browser';

const config = useRuntimeConfig();

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
});

const isSubmitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const submitContact = async (e: Event) => {
  e.preventDefault();
  isSubmitting.value = true;
  errorMessage.value = "";
  
  try {
    const templateParams = {
      from_name: formData.value.name,
      from_email: formData.value.email,
      subject: formData.value.subject,
      message: formData.value.message,
    };
   
    await emailjs.send(
      config.public.EMAIL_SERVICE_ID,
      config.public.EMAIL_TEMPLATE_ID,
      templateParams,
      config.public.EMAIL_PUBLIC_KEY
    );

    successMessage.value = "Thank you for your message! We'll get back to you soon.";
    formData.value = { name: '', email: '', subject: '', message: '' }; // Reset form
  } catch (error) {
    errorMessage.value = "Failed to send message. Please try again later.";
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="mx-auto py-12 px-4 md:px-12 lg:px-24">
    <div class="flex flex-col lg:flex-row gap-8">
      <!-- Info Section -->
      <div class="lg:w-1/3">
        <div class="bg-purple-50 rounded-lg p-6 shadow-sm sticky top-24">
          <h2 class="text-2xl font-semibold text-purple-heart-600 mb-4">Welcome to SignRaise</h2>
          <div class="space-y-4 text-gray-600">
            <p class="leading-relaxed">
              We're dedicated to breaking communication barriers through innovative sign language technology. Whether you need:
            </p>
            <ul class="list-disc list-inside space-y-2 ml-4">
              <li>Technical support for our services</li>
              <li>Business inquiries and partnerships</li>
              <li>Custom solutions for your organization</li>
              <li>Information about our features and pricing</li>
            </ul>
            <p class="mt-4">
              Our team is here to help! You can also check out our open-source project on 
              <a 
                href="https://github.com/youssef-elmelegy/Sign-raise" 
                target="_blank" 
                class="text-purple-heart-600 hover:text-purple-heart-700 underline"
              >
                GitHub
              </a>.
            </p>
          </div>
        </div>
      </div>

      <!-- Form Section -->
      <div class="lg:w-2/3">
        <h1 class="text-3xl font-bold text-center mb-8">Contact Us</h1>
        <p class="text-center text-gray-600 mb-8">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>

        <form @submit="submitContact" class="space-y-6">
          <div class="grid grid-cols-1 gap-6">
            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                v-model="formData.name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-heart-500 focus:border-transparent"
                placeholder="Your name"
              />
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                v-model="formData.email"
                type="email"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-heart-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Subject</label>
              <input
                v-model="formData.subject"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-heart-500 focus:border-transparent"
                placeholder="What is this regarding?"
              />
            </div>

            <div class="col-span-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
              <textarea
                v-model="formData.message"
                rows="4"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-heart-500 focus:border-transparent"
                placeholder="Your message here..."
              ></textarea>
            </div>

            <div class="col-span-1">
              <TheButton type="submit" :disabled="isSubmitting" class="w-full">
                {{ isSubmitting ? "Sending..." : "Send Message" }}
              </TheButton>
            </div>

            <p v-if="successMessage" class="text-green-600 text-center p-3 bg-green-50 rounded-md">
              {{ successMessage }}
            </p>

            <p v-if="errorMessage" class="text-red-600 text-center p-3 bg-red-50 rounded-md">
              {{ errorMessage }}
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
