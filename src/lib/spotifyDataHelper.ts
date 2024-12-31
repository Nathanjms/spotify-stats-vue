import { SpotifyModel, SpotifyRecord } from "@/models/spotifyModel";

export async function insertRows(data: any[]) {
  // Chunk the data into batches of 1000:
  for (let i = 0; i < data.length; i += 1000) {
    const batch = data.slice(i, i + 1000);
    // map the data so it only contains the columns in the interface 'SpotifyRecord':
    await new SpotifyModel().insertRows(mapToInsert(batch));
  }
}

export function mapToInsert(data: any[]): SpotifyRecord[] {
  return data.map(
    (row) =>
      ({
        ts: row.ts,
        master_metadata_track_name: row.master_metadata_track_name,
        master_metadata_album_artist_name: row.master_metadata_album_artist_name,
        master_metadata_album_album_name: row.master_metadata_album_album_name,
        spotify_track_uri: row.spotify_track_uri,
        skipped: row.skipped,
      } as SpotifyRecord)
  );
}
