import {
  arrayBufferToBase64,
  arrayBufferToString,
  base64ToArrayBuffer
} from "@/module/login/common-methords/Base64ToBuffer";
import touchIdLoginAPI from "@/api/touchIdLogingAPI";
import { responseDataType } from "@/type/ComponentDataType";

const touchIDLoginOptions = {
  publicKey: {
    challenge: new ArrayBuffer(0), // 凭证(ArrayBuffer)
    allowCredentials: [
      {
        type: "public-key",
        id: new ArrayBuffer(0), // 注册时的rawId(ArrayBuffer)
        transports: ["internal"] // 使用内置指纹
      }
    ]
  }
};
const touchIDOptions = {
  publicKey: {
    rp: { name: "chat-system" }, // 网站信息
    user: {
      name: "", // 用户名
      id: new ArrayBuffer(0), // 用户id(ArrayBuffer)
      displayName: "" // 用户名
    },
    pubKeyCredParams: [
      { type: "public-key", alg: -7 },
      {
        type: "public-key",
        alg: -35
      },
      { type: "public-key", alg: -36 },
      { type: "public-key", alg: -257 },
      {
        type: "public-key",
        alg: -258
      },
      { type: "public-key", alg: -259 },
      { type: "public-key", alg: -37 },
      {
        type: "public-key",
        alg: -38
      },
      { type: "public-key", alg: -39 },
      { type: "public-key", alg: -8 }
    ], // 接受的加密算法
    challenge: new ArrayBuffer(0), // 凭证(ArrayBuffer)
    timeout: 60000, // 授权超时时间
    authenticatorSelection: {
      authenticatorAttachment: "platform"
    } // 只接受指纹登录或windows hello登录
  }
};
const touchIDRegistered = async (
  userName: string,
  userId: string,
  certificate: string
) => {
  // 校验设备是否支持touchID
  const hasTouchID = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  if (
    hasTouchID &&
    window.confirm("检测到您的设备支持TouchID登录，是否启用？")
  ) {
    // 更新注册凭证
    touchIDOptions.publicKey.challenge = base64ToArrayBuffer(certificate);
    // 更新用户名、用户id
    touchIDOptions.publicKey.user.name = userName;
    touchIDOptions.publicKey.user.displayName = userName;
    touchIDOptions.publicKey.user.id = base64ToArrayBuffer(userId);
    // 调用指纹设备，创建指纹
    const publicKeyCredential = await navigator.credentials.create(
      touchIDOptions as any
    );
    if (publicKeyCredential && "rawId" in publicKeyCredential) {
      // 将rowId转为base64
      const rawId = publicKeyCredential["rawId"];
      const touchId = arrayBufferToBase64(rawId);
      const response = publicKeyCredential["response"];
      // 获取客户端信息
      const clientDataJSON = arrayBufferToString(response["clientDataJSON"]);
      // 调用注册TouchID接口
      touchIdLoginAPI
        .registeredTouchID({
          touchId: touchId,
          clientDataJson: clientDataJSON
        })
        .then((res: responseDataType<string>) => {
          if (res.code === 0) {
            // 保存touchId用于指纹登录
            localStorage.setItem("touchId", touchId);
            return;
          }
          alert(res.msg);
        });
    }
  }
};

export { touchIDRegistered, touchIDLoginOptions };
