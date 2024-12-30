<script setup>
import { db } from "./db";
import { ref, onMounted } from "vue";
import SpotifyStats from "./components/SpotifyStats.vue";

const dbTableData = ref([]);

// onMounted(search);

const searchQuery = ref("");
const totalRows = ref(0);

async function insertRows() {
  // Insert 5000 rows:
  try {
    await db("users").insert(Array.from({ length: 5_000 }, (_, i) => ({ user_name: `User ${i}` })));
    await search();
  } catch (error) {
    alert(error);
  }
}

async function truncateTable() {
  try {
    await db("users").truncate();
    await search();
  } catch (error) {
    alert(error);
  }
}

async function search() {
  try {
    const query = db("users");
    if (searchQuery.value) {
      query.where("user_name", "like", `%${searchQuery.value}%`);
    }
    const rows = await query.select("id", "user_name");

    const totalRowQuery = await db("users").count();
    totalRows.value = totalRowQuery[0].count.toLocaleString();
    dbTableData.value = rows;
  } catch (error) {
    alert(error);
  }
}
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <div class="pb-4">
    <SpotifyStats />
  </div>
  <!-- <h1>Table</h1>
  <h2>{{ totalRows }} total rows</h2>
  <button @click="insertRows">Insert 5,000 rows</button>
  <button @click="truncateTable">Truncate table</button>
  <input @keyup.enter="search" type="text" v-model="searchQuery" />
  <button @click="() => search()">Search</button>
  <table>
    <tbody>
      <tr>
        <th>User</th>
      </tr>
      <tr v-if="dbTableData.length === 0">
        <td>No data</td>
      </tr>
      <tr v-else-if="dbTableData.length > 5000">
        <td>Too many rows to display and I haven't bothered with pagination - maybe try searching?</td>
      </tr>
      <template v-else>
        <tr v-for="row in dbTableData" :key="row.user">
          <td>{{ row.user_name }}</td>
        </tr>
      </template>
    </tbody>
  </table> -->
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
