import emojiRegex from "emoji-regex";

export function splitPlaylistEmoji(title: string): {
  rest: string;
  emoji: string | undefined;
} {
  try {
    if (title.search(emojiRegex()) === 0) {
      // Pick the first emoji if the first character is an emoji.
      const emoji = title.match(emojiRegex())?.[0];
      // ignore the first emoji IF it is an emoji.
      const rest = emoji ? title.substring(emoji.length).trim() : title;

      return {
        rest,
        emoji,
      };
    }
  } catch (e) {
    console.error(e);
  }
  return {
    rest: title,
    emoji: undefined,
  };
}
