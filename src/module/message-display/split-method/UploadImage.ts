import { responseDataType } from "@/type/ComponentDataType";
import _ from "lodash";
import base from "@/api/base";
import fileManageAPI from "@/api/fileManageAPI";

export default function uploadImage(
  formData: FormData
): Promise<{ code: number; msg: string }> {
  return new Promise((resolve, reject) => {
    // 将图片上传至服务器
    fileManageAPI.upload(formData).then((res: responseDataType) => {
      // 文件上传失败
      if (!_.isEqual(res.code, 0)) {
        alert(res.msg);
        reject({ msg: res.msg, code: -1 });
      }
      // 图片名
      let msgImgName = "";
      const imgSrc = `${base.lkBaseURL}/uploads/chatImg/${res.fileName}`;
      // 获取图片大小
      const img = new Image();
      let imgWidth = 0;
      let imgHeight = 0;
      // 赋值图片地址
      img.src = imgSrc;
      // 判断图片是否有缓存
      if (img.complete) {
        imgWidth = img.width;
        imgHeight = img.height;
        msgImgName = `/${res.fileName}?width:${imgWidth}&height:${imgHeight}/`;
        resolve({ msg: msgImgName, code: 0 });
      } else {
        img.onload = () => {
          imgWidth = img.width;
          imgHeight = img.height;
          msgImgName = `/${res.fileName}?width=${imgWidth}&height=${imgHeight}/`;
          resolve({ msg: msgImgName, code: 0 });
        };
      }
    });
  });
}
