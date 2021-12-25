export function getChannelPhoto(channelId: string, size = 100) {
  const nearest = Math.min(Math.max(Math.ceil(size / 50) * 50, 50), 150);
  return `https://holodex.net/statics/channelImg/${channelId}/${nearest}.png`;
}
