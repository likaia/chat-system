/**
 * base64转图片
 * @param urlData
 * @param fileName
 * @param fileType
 */
export default function convertBase64UrlToImgFile(
  urlData: string,
  fileName: string,
  fileType: string
) {
  // 转换为byte
  const bytes = window.atob(urlData);
  // 处理异常,将ascii码小于0的转换为大于0
  const ab = new ArrayBuffer(bytes.length);
  const ia = new Int8Array(ab);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  // 转换成文件，添加文件的type，name，lastModifiedDate属性
  const blob: any = new Blob([ab], { type: fileType });
  blob.lastModifiedDate = new Date();
  blob.name = fileName;
  return blob;
}
