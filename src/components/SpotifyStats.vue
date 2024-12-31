<script setup lang="ts">
import { ref, onMounted } from "vue";
import { db } from "@/db";
import { SpotifyModel, SpotifyRecord } from "@/models/spotifyModel";
import * as spotifyDataHelper from "@/lib/spotifyDataHelper";
import DataUpload from "./DataUpload.vue";

const fileInput = ref(null);

onMounted(searchTopSongs);

const searchTopSongsQuery = ref("");
const totalRows = ref(0);
const dbTableData = ref([]);

async function truncateTable() {
  try {
    await new SpotifyModel().truncate();
    await searchTopSongs();
  } catch (error) {
    alert(error);
  }
}

async function searchTopSongs() {
  try {
    const topSongs = await new SpotifyModel().getTopSongs(searchTopSongsQuery.value);
    console.log({ topSongs });

    // const query = new SpotifyModel().query();
    // if (searchTopSongsQuery.value) {
    //   query.where("master_metadata_album_artist_name", "ilike", `%${searchTopSongsQuery.value}%`);
    // }
    // const rows = await query.select("*")
    //   .groupBy('master_metadata_track_name')
    //   .limit(10);

    totalRows.value = (await new SpotifyModel().getCount()).toLocaleString();
    dbTableData.value = topSongs;
  } catch (error) {
    alert(error);
  }
}

function handleUpload() {
  alert("refresh now");
}
</script>
<template>
  <div>
    <div class="text-center">
      <h1 class="text-4xl font-bold mb-4">Your Music History</h1>
      <p class="text-xl mb-8">Upload your data file and visualize it instantly!</p>
    </div>

    <DataUpload class="mb-5" @uploaded="handleUpload" />
    <button @click="truncateTable">Truncate table</button>

    <input @keyup.enter="searchTopSongs" type="text" v-model="searchTopSongsQuery" />
    <button @click="() => searchTopSongs()">SearchTopSongs</button>
    <table>
      <tbody>
        <tr>
          <th>Spotify</th>
        </tr>
        <tr v-if="dbTableData.length === 0">
          <td>No data</td>
        </tr>
        <!-- <tr v-else-if="dbTableData.length > 100">
          <td>Too many rows to display and I haven't bothered with pagination - maybe try searchTopSongsing?</td>
        </tr> -->
        <template v-else>
          <tr v-for="row in dbTableData.slice(0, 100)" :key="row.id">
            <td>
              <pre>{{ row }}</pre>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<style lang="scss" scoped></style>
