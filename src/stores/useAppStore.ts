import { initDb } from "@/db";
import { SpotifyModel } from "@/models/spotifyModel";
import { defineStore } from "pinia";

export const useAppStore = defineStore("app", {
  state: () => ({
    isInitialising: true,
    anyData: false,
  }),
  getters: {},
  actions: {
    async init() {
      try {
        await initDb();
        await this.checkIfAnyData();
      } catch (error) {
        alert(error);
      } finally {
        this.isInitialising = false;
      }
    },
    async checkIfAnyData() {
      this.anyData = !!(await new SpotifyModel().query().first());
    },
  },
});
