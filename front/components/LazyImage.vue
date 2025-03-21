<template>
    <img :src="loaded ? src : placeholderSrc" :alt="alt" :class="imgClass" @load="onLoad" @error="onError" ref="img" />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
    src: {
        type: String,
        required: true
    },
    alt: {
        type: String,
        default: ''
    },
    imgClass: {
        type: String,
        default: ''
    },
    placeholderSrc: {
        type: String,
        default: '/placeholder.svg'
    }
});

const loaded = ref(false);
const error = ref(false);
const img = ref(null);
const observer = ref(null);

const onLoad = () => {
    loaded.value = true;
};

const onError = () => {
    error.value = true;
    console.error(`Failed to load image: ${props.src}`);
};

const setupIntersectionObserver = () => {
    if (!window.IntersectionObserver) {
        // Fallback for browsers that don't support IntersectionObserver
        loaded.value = true;
        return;
    }

    observer.value = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
            // Preload the image
            const tempImage = new Image();
            tempImage.src = props.src;
            tempImage.onload = onLoad;
            tempImage.onerror = onError;

            // Disconnect observer after image is loaded
            observer.value.disconnect();
        }
    }, {
        rootMargin: '50px 0px',
        threshold: 0.1
    });

    if (img.value) {
        observer.value.observe(img.value);
    }
};

onMounted(() => {
    setupIntersectionObserver();
});

// Clean up observer when component is unmounted
watch(() => props.src, () => {
    loaded.value = false;
    error.value = false;

    if (observer.value) {
        observer.value.disconnect();
    }

    setupIntersectionObserver();
});
</script>