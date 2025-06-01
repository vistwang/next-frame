export interface BlogPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

// 灯牌效果类型
export enum ScrollerEffectType {
  CLASSIC = "classic", // 经典纯色滚动
  RAINBOW_TEXT = "rainbow_text", // 文字彩虹色变化
  FLASHING_TEXT = "flashing_text", // 文字闪烁
  BACKGROUND_BEAT = "bg_beat", // 背景色呼吸/跳动
  INVERSE = "inverse", // 反色（背景和文字颜色互换）
}

// 滚动速度
export enum ScrollerSpeed {
  SLOW = "slow",
  MEDIUM = "medium",
  FAST = "fast",
  VERY_FAST = "very_fast",
}

// 灯牌配置项接口
export interface ScrollerConfig {
  text: string; // 显示的文字
  fontSize: number; // 字号 (px)
  textColor: string; // 文字颜色 (hex)
  backgroundColor: string; // 背景颜色 (hex)
  speed: ScrollerSpeed; // 滚动速度
  effectType: ScrollerEffectType; // 特殊效果类型
  // 可以根据 effectType 扩展更多配置
  flashSpeed?: number; // 闪烁速度 (ms, 仅当 effectType 为 FLASHING_TEXT)
  rainbowSpeed?: number; // 彩虹变化速度 (ms, 仅当 effectType 为 RAINBOW_TEXT)
  // ... 更多未来可能的配置
}

// LedScroller 组件的 Props
export interface LedScrollerProps extends ScrollerConfig {
  // 可能有其他非配置类的 props
  className?: string;
}

// ConfigPanel 组件的 Props
export interface ConfigPanelProps {
  initialConfig: ScrollerConfig;
  onConfigChange: (newConfig: ScrollerConfig) => void;
}
