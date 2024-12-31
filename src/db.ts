import { knex } from "knex";
import ClientPgLite from "knex-pglite";

export const db = knex({
  client: ClientPgLite,
  dialect: "postgres",
  connection: { connectionString: "idb://my-database" },
});

export async function initDb() {
  // If this is the first time the DB is created, then we need to create the tables:
  if (!(await db.schema.hasTable("spotify_stats"))) {
    await db.schema.createTable("spotify_stats", (table) => {
      table.increments("id");
      table.timestamp("ts");
      table.string("master_metadata_track_name");
      table.string("master_metadata_album_artist_name");
      table.string("master_metadata_album_album_name");
      table.string("spotify_track_uri");
      table.boolean("skipped");

      table.index("ts");
      table.index("master_metadata_track_name");
      table.index("master_metadata_album_artist_name");
      table.index("master_metadata_album_album_name");
      table.index("spotify_track_uri");
      table.index("skipped");
    });
  }
}
