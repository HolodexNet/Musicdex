interface OrgDiscovery extends Recommendation {
  version: 1;
  recentSingingStreams?: [
    {
      video: Video; // for generating any information around the video.
      playlist?: PlaylistFull; // for generating the playlist. (playlist may not be available)
    },
  ];
  channels: ChannelStub[];
}

interface ChannelDiscovery extends Recommendation {
  version: 1;
  recentSingingStreams?: [
    {
      video: Video; // for generating any information around the video.
      playlist?: PlaylistFull; // for generating the playlist. (playlist may not be available)
    },
  ];
  channels?: ChannelStub[]; //recommended channels?
  // backgroundVideo?: string;
}

interface VideoDiscovery extends Recommendation {}

interface Recommendation {
  recommended: {
    playlists: PlaylistFull[];
  };
}

interface PlaylistList {
  items: PlaylistStub[];
  total: number;
}
