<script setup lang="ts">
import { ref } from "vue";
import JSZip from "jszip";
import { mapToInsert } from "@/lib/spotifyDataHelper";
import { SpotifyModel } from "@/models/spotifyModel";

// Define emit "uploaded":
const emit = defineEmits(["uploaded"]);
const jsZip = ref(null);
const zipFile = ref(null);

interface processingFile {
  name: string;
  count: number;
  progress: number;
}

const filesToProcess = ref<processingFile[]>([]);

async function handleFileChange(event) {
  // Error if not a zip file:
  if (event.target.files[0].type !== "application/zip") {
    alert("Not a zip file");
    return;
  }

  const file = event.target.files[0];
  zipFile.value = file;

  jsZip.value = new JSZip();
  const zipContent = await jsZip.value.loadAsync(zipFile.value);

  try {
    for (const fileName in zipContent.files) {
      console.log({ fileName });

      // Check filename contains with Streaming_History_Audio
      if (fileName.endsWith(".json") && fileName.includes("Streaming_History_Audio")) {
        filesToProcess.value.push({ name: fileName, count: 0, progress: 0 });
      }
    }
  } catch (error) {
    alert(error);
  }
}

async function processFile() {
  console.log("Processing...");
  for (let i = 0; i < filesToProcess.value.length; i++) {
    const fileName = filesToProcess.value[i].name;
    const file = await jsZip.value.file(fileName).async("string");
    const data = JSON.parse(file);

    filesToProcess.value[i].count = data.length;
    filesToProcess.value[i].progress = 0;
    // Chunk the data into batches of 1000:
    for (let j = 0; j < data.length; j += 5000) {
      const batch = data.slice(j, j + 5000);
      // map the data so it only contains the columns in the interface 'SpotifyRecord':
      await new SpotifyModel().insertRows(mapToInsert(batch));
      filesToProcess.value[i].progress += 5000;
    }
  }

  // Emit:
  emit("uploaded");
}
</script>

<template>
  <div>
    <div>
      <input @change="handleFileChange" accept=".zip" type="file" ref="fileInput" />

      <button class="bg-zinc-500 px-2 py-1 rounded-3xl" @click="processFile" v-if="filesToProcess.length > 0">
        Process File
      </button>
      <p>Nothing is uploaded and this is all processed locally</p>
    </div>
    <div v-if="filesToProcess.length > 0" class="bg-zinc-500 p-4 rounded-3xl">
      <div v-for="file in filesToProcess" :key="file.name">
        <p>{{ file.name }}</p>
        <p>{{ Math.min(file.progress, file.count) }} / {{ file.count }} rows</p>
        <!-- Progress Bar: -->
        <div class="w-full bg-gray-200 rounded-full dark:bg-gray-700">
          <div
            class="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
            :style="{ width: file.count ? Math.min(1, file.progress / file.count) * 100 + '%' : '0%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>
