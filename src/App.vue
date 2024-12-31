<script setup>
import { onMounted } from "vue";
import SpotifyStats from "./components/SpotifyStats.vue";
import { useAppStore } from "./stores/useAppStore";

const appStore = useAppStore();

onMounted(appStore.init);
</script>

<template>
  <div class="pb-4">
    {{ appStore.anyData }}
    <div v-if="appStore.isInitialising">Loading...</div>
    <SpotifyStats />
  </div>
</template>
