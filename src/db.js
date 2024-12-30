import { knex } from "knex";
import ClientPgLite from "knex-pglite";

export const db = knex({
  client: ClientPgLite,
  dialect: "postgres",
  connection: { connectionString: "idb://my-database" },
});

initDb();

async function initDb() {
  // If this is the first time the DB is created, then we need to create the tables:
  if (!(await db.schema.hasTable("users"))) {
    // Create a table
    await db.schema.createTable("users", (table) => {
      table.increments("id");
      table.string("user_name");
    });
  }

  if (!(await db.schema.hasTable("spotify_stats"))) {
    await db.schema.createTable("spotify_stats", (table) => {
      table.increments("id");
      table.timestamp("ts");
      table.string("platform");
      table.integer("ms_played");
      table.string("conn_country");
      table.string("ip_addr");
      table.string("master_metadata_track_name");
      table.string("master_metadata_album_artist_name");
      table.string("master_metadata_album_album_name");
      table.string("spotify_track_uri");
      table.string("episode_name");
      table.string("episode_show_name");
      table.string("spotify_episode_uri");
      table.string("reason_start");
      table.string("reason_end");
      table.boolean("shuffle");
      table.boolean("skipped");
      table.boolean("offline");
      table.timestamp("offline_timestamp");
      table.boolean("incognito_mode");
    });
  }
}
