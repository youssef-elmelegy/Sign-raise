<template>
    <div class="settings-menu bg-white dark:bg-gray-800">
        <h2 class="settings-title text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700">Settings
        </h2>

        <div class="settings-section">
            <h3 class="text-gray-800 dark:text-gray-200">Camera</h3>
            <button @click="toggleVideo"
                class="settings-button bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:text-gray-200"
                :class="{ 'active': store.receiveVideo }" :disabled="store.isLoading">
                <span class="icon">
                    <svg v-if="store.receiveVideo" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" />
                        <line x1="8" y1="8" x2="16" y2="16" />
                        <line x1="16" y1="8" x2="8" y2="16" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <path d="M23 7l-7 5 7 5V7z" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                    </svg>
                </span>
                {{ store.receiveVideo ? 'Stop Camera' : 'Start Camera' }}
            </button>
        </div>

        <div class="settings-section">
            <h3 class="text-gray-800 dark:text-gray-200">Language</h3>
            <div class="language-options">
                <button @click="setLanguage('en')"
                    class="language-button bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:text-gray-200"
                    :class="{ 'active': store.language === 'en' }">
                    English
                </button>
                <button @click="setLanguage('ar')"
                    class="language-button bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:text-gray-200"
                    :class="{ 'active': store.language === 'ar' }">
                    العربية
                </button>
            </div>
        </div>

        <div class="settings-section">
            <h3 class="text-gray-800 dark:text-gray-200">Translation</h3>
            <button @click="toggleTranslation"
                class="settings-button bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 dark:text-gray-200"
                :class="{ 'active': store.isTranslating }" :disabled="!store.cameraActive">
                <span class="icon">
                    <svg v-if="store.isTranslating" xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"
                        stroke-linejoin="round">
                        <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                </span>
                {{ store.isTranslating ? 'Stop Translation' : 'Start Translation' }}
            </button>
        </div>

        <div class="settings-section">
            <h3 class="text-gray-800 dark:text-gray-200">Recognized Signs</h3>
            <div class="recognized-signs">
                <div class="sign-item" v-for="sign in recognizedSigns" :key="sign">
                    <span class="sign-badge bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200">{{ sign
                        }}</span>
                </div>
            </div>
        </div>

        <div v-if="store.error"
            class="error-message bg-red-50 text-red-700 border border-red-200 dark:bg-red-900 dark:text-red-100 dark:border-red-800">
            {{ store.error }}
            <button @click="dismissError" class="dismiss-button text-red-700 dark:text-red-100">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { usePlaygroundStore } from '@/stores/playgroundStore';

const store = usePlaygroundStore();

// List of signs our system can recognize
const recognizedSigns = ref([
    'Hello',
    'Thank you',
    'Yes',
    'No',
    'Please',
    'Help',
    'Sorry',
    'Good'
]);

function toggleVideo() {
    store.receiveVideo ? store.reset() : store.startCamera();
}

function setLanguage(lang) {
    store.setLanguage(lang);
}

function toggleTranslation() {
    store.isTranslating ? store.stopTranslation() : store.startTranslation();
}

function dismissError() {
    store.setError(null);
}
</script>

<style scoped>
.settings-menu {
    padding: 1.25rem;
    height: 100%;
    overflow-y: auto;
}

.settings-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
}

.settings-section {
    margin-bottom: 1.5rem;
}

.settings-section h3 {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
}

.settings-button {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
}

.settings-button.active {
    background-color: #3B82F6 !important;
    color: white !important;
    border-color: #2563EB !important;
}

.settings-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.language-options {
    display: flex;
    gap: 0.5rem;
}

.language-button {
    flex: 1;
    padding: 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
}

.language-button.active {
    background-color: #3B82F6 !important;
    color: white !important;
    border-color: #2563EB !important;
}

.error-message {
    position: relative;
    margin-top: 1rem;
    padding: 0.75rem 2rem 0.75rem 0.75rem;
    border-radius: 6px;
}

.dismiss-button {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
}

.recognized-signs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.sign-item {
    margin-bottom: 0.25rem;
}

.sign-badge {
    display: inline-block;
    padding: 0.25rem 0.5rem;
    border-radius: 4px;
    font-size: 0.875rem;
}

.icon {
    display: flex;
    align-items: center;
    justify-content: center;
}

@media (max-width: 768px) {
    .settings-menu {
        padding: 1rem;
    }

    .settings-title {
        margin-bottom: 1rem;
    }
}
</style>