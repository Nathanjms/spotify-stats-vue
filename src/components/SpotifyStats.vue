<script setup>
import { db } from "../db";
import { ref, onMounted } from "vue";

const fileInput = ref(null);

onMounted(search);

const searchQuery = ref("");
const totalRows = ref(0);
const dbTableData = ref([]);

const inserting = ref(false);
async function insertRows(data) {
  inserting.value = true;
  try {
    // Chunk the data into batches of 1000:
    for (let i = 0; i < data.length; i += 1000) {
      const batch = data.slice(i, i + 1000);
      await db("spotify_stats").insert(batch);
    }
  } catch (error) {
    alert(error);
  } finally {
    inserting.value = false;
  }
}

async function truncateTable() {
  try {
    await db("spotify_stats").truncate();
    await search();
  } catch (error) {
    alert(error);
  }
}

async function search() {
  try {
    const query = db("spotify_stats");
    if (searchQuery.value) {
      query.where("master_metadata_album_artist_name", "like", `%${searchQuery.value}%`);
    }
    const rows = await query.select("*").limit(50);
    
    const totalRowQuery = await db("spotify_stats").count();
    totalRows.value = totalRowQuery[0].count.toLocaleString();
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
    const data = JSON.parse(fileReader.result);
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
