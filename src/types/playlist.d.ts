interface WriteablePlaylist {
  id?: string;
  title: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
  type: string;
  owner: string | number;
  listed: boolean;
  content?: string[];
}

interface PlaylistStub {
  id: string;
  title: string;
  created_at: Date;
  updated_at: Date;
  type: string;
  owner: string | number;
  listed: boolean;
  // image_song: Song;
}

interface PlaylistFull extends PlaylistStub {
  description?: string;
  content?: Song[];
}

interface Song {
  channel_id: string;
  video_id: string;
  name: string;
  start: number;
  end: number;
  itunesid: number | string;
  art: string;
  amUrl: string;
  available_at: Date;
  original_artist: string;
  creator_id: number;
  approver_id: number;
  is_mv: boolean;
  id: string;
  status: string;
  channel: {
    name: string;
    english_name?: string;
  };
}
