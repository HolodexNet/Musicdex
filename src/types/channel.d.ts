interface Channel {
  id: string;
  name: string;
  english_name?: string;
  type: CHANNEL_TYPES;
  org?: string;
  suborg?: string;
  lang?: string;
  twitter?: string;
  photo: string;
  thumbnail: string;
  banner: string;
  published_at: Date;
  view_count: string | number;
  video_count: string | number;
  subscriber_count: string | number;
  comments_crawled_at: Date;
  updated_at: Date;
  yt_uploads_id: string;
  clip_count: number;
  inactive: boolean;
  created_at: Date;
  top_topics: string[];
  crawled_at: Date;
}
