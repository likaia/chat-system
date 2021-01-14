import initData from "@/module/message-display/main-entrance/InitData";

/**
 * 播放提示音
 */
export default function playSound() {
  const data = initData();
  const audioCtx = new AudioContext();
  const arrFrequency: number[] = data.arrFrequency;
  // 当前频率: 随机产生
  const frequency =
    arrFrequency[Math.floor(Math.random() * arrFrequency.length)];
  // 创建音调控制对象
  const oscillator = audioCtx.createOscillator();
  // 创建音量控制对象
  const gainNode = audioCtx.createGain();
  // 音调音量关联
  oscillator.connect(gainNode);
  // 音量和设备关联
  gainNode.connect(audioCtx.destination);
  // 音调类型指定为正弦波
  oscillator.type = "sine";
  // 设置音调频率: 最终播放的声音
  oscillator.frequency.value = frequency;
  // 先把当前音量设为0
  gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
  // 0.01秒时间内音量从刚刚的0变成1，线性变化
  gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
  // 声音走起
  oscillator.start(audioCtx.currentTime);
  // 2秒时间内音量从刚刚的1变成0.001，指数变化
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2);
  // 2秒后停止声音
  oscillator.stop(audioCtx.currentTime + 2);
}
