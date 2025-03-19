import { defineStore } from 'pinia';

export const usePlaygroundStore = defineStore('playground', {
    state: () => ({
        receiveVideo: false,
        videoUrl: '',
        language: 'en',
        isLoading: false,
        error: null,
        cameraActive: false,
        translatedText: '',
        isTranslating: false,
        translationHistory: []
    }),

    getters: {
        isVideoActive: (state) => Boolean(state.videoUrl) && !state.receiveVideo,
        isCameraActive: (state) => state.cameraActive,
        isEnglish: (state) => state.language === 'en',
        isArabic: (state) => state.language === 'ar'
    },

    actions: {
        init() {
            if (this.receiveVideo) {
                this.startCamera();
            } else {
                this.setVideo('assets/tmp/example-sentence.mp4');
            }
        },

        async startCamera() {
            this.isLoading = true;
            this.error = null;
            try {
                this.receiveVideo = true;
                this.videoUrl = '';
            } catch (err) {
                console.error('Failed to start camera:', err);
                this.setError('Failed to access camera');
                this.receiveVideo = false;
            } finally {
                this.isLoading = false;
            }
        },

        setCameraActive(isActive) {
            this.cameraActive = isActive;
            if (!isActive && this.receiveVideo) {
                this.receiveVideo = false;
            }
        },

        setVideo(url) {
            if (!url) return;
            if (this.receiveVideo) this.receiveVideo = false;
            this.videoUrl = url;
        },

        setLanguage(lang) {
            if (['en', 'ar'].includes(lang)) {
                this.language = lang;
            }
        },

        setError(message) {
            this.error = message;
        },

        setTranslatedText(text) {
            this.translatedText = text;
            if (text) this.translationHistory.push(text);
        },

        startTranslation() {
            this.isTranslating = true;
        },

        stopTranslation() {
            this.isTranslating = false;
            this.translatedText = '';
        },

        reset() {
            this.receiveVideo = false;
            this.videoUrl = '';
            this.error = null;
            this.cameraActive = false;
            this.stopTranslation();
        }
    }
});