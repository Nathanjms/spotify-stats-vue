import { db } from "@/db";

export interface SpotifyRecord {
  id: number;
  ts: string;
  master_metadata_track_name: string;
  master_metadata_album_artist_name: string;
  master_metadata_album_album_name: string;
  spotify_track_uri: string;
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
}
