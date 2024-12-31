import { db } from "@/db";

export interface SpotifyRecord {
  id: number;
  ts: string;
  master_metadata_track_name: string;
  master_metadata_album_artist_name: string;
  master_metadata_album_album_name: string;
  spotify_track_uri: string;
  skipped: boolean;
}

export class SpotifyModel {
  _tableName = "spotify_stats";

  query() {
    return db.table(this._tableName);
  }

  async insertRows(data: SpotifyRecord[]) {
    return await db.table(this._tableName).insert(data);
  }

  async truncate() {
    return await db.table(this._tableName).truncate();
  }

  async getCount() {
    const queryResult = await db.table(this._tableName).count({ count: "*" });

    if (!queryResult) {
      return 0;
    }

    return queryResult[0]?.count;
  }

  async getTopSongs(artist?: string) {
    const queryResult = await this.query()
      .select("master_metadata_track_name", "master_metadata_album_artist_name", "master_metadata_album_album_name")
      .count({ count: "*" })
      .groupBy("master_metadata_track_name", "master_metadata_album_artist_name", "master_metadata_album_album_name")
      .where("master_metadata_album_artist_name", "ilike", `%${artist}%`)
      .where("skipped", false)
      .orderBy("count", "desc")
      .limit(10);

    return queryResult;
  }
}
