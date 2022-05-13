export function resizeArtwork(artworkUrl: string, size: number = 400) {
  // https://is5-ssl.mzstatic.com/image/thumb/Music125/v4/9c/39/27/9c392780-3f34-d322-9dde-002618154f40/source/400x400bb.jpg
  // https://is2-ssl.mzstatic.com/image/thumb/Music122/v4/5d/b2/7e/5db27e44-e8ac-4099-1a4e-5ff8264f14ec/VEATP-39813.jpg/100x100bb.jpg
  const adjustedSize =
    Math.round(Math.floor(window.devicePixelRatio * size) / 50) * 50;
  const match =
    /^https:\/\/(.+?)\.mzstatic\.com\/image\/thumb\/(.+)\/(.+?)\//.exec(
      artworkUrl
    );
  if (!match) return artworkUrl;
  const serv = match[1];
  const thumb = match[2];
  const name = match[3];
  return `https://${serv}.mzstatic.com/image/thumb/${thumb}/${name}/${adjustedSize}x${adjustedSize}bb.jpg`;
}
