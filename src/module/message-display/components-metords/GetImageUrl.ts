export default function getImageUrl(fileName: string, isEmoji = false) {
  if (isEmoji) {
    return new URL(`/src/assets/img/emoji/${fileName}`, import.meta.url).href;
  }
  return new URL(`/src/assets/img/${fileName}`, import.meta.url).href;
}
