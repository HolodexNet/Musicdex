export function resizeArtwork(artworkUrl: string, size: number = 400) {
  // https://is5-ssl.mzstatic.com/image/thumb/Music125/v4/9c/39/27/9c392780-3f34-d322-9dde-002618154f40/source/400x400bb.jpg
  const adjustedSize = Math.floor(window.devicePixelRatio * size);
  const match =
    /^https:\/\/(.+?)\.mzstatic\.com\/image\/thumb\/(.+?)\/source\//.exec(
      artworkUrl
    );
  if (!match) return artworkUrl;
  const serv = match[1];
  const thumb = match[2];
  return `https://${serv}.mzstatic.com/image/thumb/${thumb}/source/${adjustedSize}x${adjustedSize}bb.jpg`;
}
