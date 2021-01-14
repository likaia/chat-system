/**
 * 获取图片信息
 * @param url
 */
export default async function getImageInfo(
  url: string
): Promise<{ imgWidth: number; imgHeight: number }> {
  const img = new Image();
  img.src = url;
  return new Promise((resolve, reject) => {
    img.onload = () => {
      const imgWidth = img.naturalWidth;
      const imgHeight = img.naturalHeight;
      resolve({ imgWidth: imgWidth, imgHeight: imgHeight });
    };
    img.onerror = e => {
      reject(e);
    };
  });
}
