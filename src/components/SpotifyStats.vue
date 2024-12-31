<script setup lang="ts">
import { ref, onMounted } from "vue";
import { db } from "@/db";
import { SpotifyModel, SpotifyRecord } from "@/models/spotifyModel";
import * as spotifyDataHelper from "@/lib/spotifyDataHelper";

const fileInput = ref(null);

onMounted(search);

const searchQuery = ref("");
const totalRows = ref(0);
const dbTableData = ref([]);

const inserting = ref(false);
const progress = ref(0);
async function insertRows(data: SpotifyRecord[]) {
  inserting.value = true;
  progress.value = 0;
  try {
    await spotifyDataHelper.insertRows(data);
  } catch (error) {
    alert(error);
  } finally {
    inserting.value = false;
  }
}

async function truncateTable() {
  try {
    await new SpotifyModel().truncate();
    await search();
  } catch (error) {
    alert(error);
  }
}

async function search() {
  try {
    const query = new SpotifyModel().query();
    if (searchQuery.value) {
      query.where("master_metadata_album_artist_name", "like", `%${searchQuery.value}%`);
    }
    const rows = await query.select("*").limit(50);

    totalRows.value = (await new SpotifyModel().getCount()).toLocaleString();
    dbTableData.value = rows;
  } catch (error) {
    alert(error);
  }
}

async function handleFileChange(event) {
  const file = event.target.files[0];
  const fileReader = new FileReader();
  fileReader.readAsText(file);
  fileReader.onload = async () => {
    const data = JSON.parse(fileReader.result as string);
    await insertRows(data);
  };
  fileInput.value = null;
}
</script>
<template>
  <div>
    <h1>Spotify</h1>
    <h2>{{ totalRows }} total rows</h2>
    <button @click="truncateTable">Truncate table</button>

    <h3 v-if="inserting">Inserting...</h3>
    <input type="file" @change="handleFileChange" ref="fileInput" />

    <input @keyup.enter="search" type="text" v-model="searchQuery" />
    <button @click="() => search()">Search</button>
    <table>
      <tbody>
        <tr>
          <th>Spotify</th>
        </tr>
        <tr v-if="dbTableData.length === 0">
          <td>No data</td>
        </tr>
        <!-- <tr v-else-if="dbTableData.length > 100">
          <td>Too many rows to display and I haven't bothered with pagination - maybe try searching?</td>
        </tr> -->
        <template v-else>
          <tr v-for="row in dbTableData" :key="row.user">
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
