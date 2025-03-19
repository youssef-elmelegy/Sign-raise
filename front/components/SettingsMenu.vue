<template>
    <div class="settings-menu">
        <h2 class="settings-title">Settings</h2>

        <div class="settings-section">
            <h3>Video Options</h3>
            <button @click="toggleVideo" class="settings-button" :class="{ 'active': store.receiveVideo }"
                :disabled="store.isLoading">
                {{ store.receiveVideo ? 'Stop Video' : 'Start Video' }}
            </button>
        </div>

        <div class="settings-section">
            <h3>Language</h3>
            <div class="language-options">
                <button @click="setLanguage('en')" class="language-button"
                    :class="{ 'active': store.language === 'en' }">
                    English
                </button>
                <button @click="setLanguage('ar')" class="language-button"
                    :class="{ 'active': store.language === 'ar' }">
                    العربية
                </button>
            </div>
        </div>

        <div class="settings-section">
            <h3>Translation</h3>
            <button @click="toggleTranslation" class="settings-button" :class="{ 'active': store.isTranslating }"
                :disabled="!store.cameraActive">
                {{ store.isTranslating ? 'Stop Translation' : 'Start Translation' }}
            </button>
        </div>

        <div v-if="store.error" class="error-message">
            {{ store.error }}
        </div>
    </div>
</template>

<script setup>
import { usePlaygroundStore } from '@/stores/playgroundStore';

const store = usePlaygroundStore();

function toggleVideo() {
    store.receiveVideo ? store.reset() : store.startCamera();
}

function setLanguage(lang) {
    store.setLanguage(lang);
}

function toggleTranslation() {
    store.isTranslating ? store.stopTranslation() : store.startTranslation();
}
</script>

<style scoped>
.settings-menu {
    padding: 20px;
    background: white;
    border-right: 1px solid #ddd;
    height: 100%;
}

.settings-title {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #eee;
}

.settings-section {
    margin-bottom: 1.5rem;
}

.settings-section h3 {
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
}

.settings-button {
    padding: 0.5rem 1rem;
    background-color: #f1f1f1;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
    width: 100%;
}

.settings-button:hover {
    background-color: #e9e9e9;
}

.settings-button.active {
    background-color: #4a5568;
    color: white;
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
    background-color: #f1f1f1;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
}

.language-button.active {
    background-color: #4a5568;
    color: white;
}

.error-message {
    margin-top: 1rem;
    padding: 0.5rem;
    color: #e53e3e;
    background-color: #fff5f5;
    border: 1px solid #fc8181;
    border-radius: 4px;
}

@media (max-width: 768px) {
    .settings-menu {
        border-right: none;
        border-bottom: 1px solid #ddd;
    }
}
</style>