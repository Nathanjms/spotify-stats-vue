<script setup>
import { onMounted } from "vue";
import SpotifyStats from "./components/SpotifyStats.vue";
import { useAppStore } from "./stores/useAppStore";

const appStore = useAppStore();

onMounted(appStore.init);
</script>

<template>
  <div class="flex flex-col column justify-between min-h-screen bg-zinc-100 dark:bg-zinc-700 dark:text-zinc-100">
    <div>
      <div class="container mx-auto">
        <main>
          {{ appStore.anyData }}
          <div v-if="appStore.isInitialising">Loading...</div>
          <SpotifyStats />
        </main>
      </div>
    </div>
    <div class="sm:py-4 mt-4 sm:mt-0">
      <div class="max-w-7xl mx-auto sm:px-4 lg:px-6">
        <div class="bg-white dark:bg-zinc-800 shadow-sm sm:rounded-lg px-6 py-2">
          <div class="text-sm italic">
            <div class="my-2 flex justify-between gap-1">
              <a href="https://github.co.uk/nathanjms" target="_blank" rel="noopener noreferrer" class="underline"
                >GitHub
              </a>
              <a href="https://ko-fi.com/nathanjms" target="_blank" rel="noopener noreferrer" class="underline"
                >Buy me a coffee ☕
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
