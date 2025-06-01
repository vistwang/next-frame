"use client";

import React, { useEffect, useRef, useState } from 'react';
import { LedScrollerProps, ScrollerEffectType, ScrollerSpeed } from '@/types';
import styles from './LedScroller.module.css'; // 我们将在这里定义 CSS 动画

const LedScroller: React.FC<LedScrollerProps> = ({
  text,
  fontSize,
  textColor,
  backgroundColor,
  speed,
  effectType,
  flashSpeed = 500, // 默认闪烁速度
  rainbowSpeed = 100, // 默认彩虹变化速度
  className,
}) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [currentTextColor, setCurrentTextColor] = useState(textColor);
  const [currentBackgroundColor, setCurrentBackgroundColor] = useState(backgroundColor);

  // 1. 动态计算滚动持续时间
  const getAnimationDuration = (s: ScrollerSpeed): string => {
    // 估算：假设屏幕宽度 + 文字宽度的总和，除以一个速度因子
    // 这里简化处理，实际可能需要根据文字长度和容器宽度动态计算
    const baseDuration = text.length > 10 ? text.length * 0.5 : 5; // 秒
    switch (s) {
      case ScrollerSpeed.SLOW:
        return `${baseDuration * 2}s`;
      case ScrollerSpeed.MEDIUM:
        return `${baseDuration}s`;
      case ScrollerSpeed.FAST:
        return `${baseDuration * 0.5}s`;
      case ScrollerSpeed.VERY_FAST:
        return `${baseDuration * 0.25}s`;
      default:
        return `${baseDuration}s`;
    }
  };

  // 2. 处理特殊效果
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    setCurrentTextColor(textColor); // 重置文字颜色
    setCurrentBackgroundColor(backgroundColor); // 重置背景颜色

    if (effectType === ScrollerEffectType.RAINBOW_TEXT) {
      let hue = 0;
      intervalId = setInterval(() => {
        hue = (hue + 5) % 360;
        setCurrentTextColor(`hsl(${hue}, 100%, 50%)`);
      }, rainbowSpeed);
    } else if (effectType === ScrollerEffectType.FLASHING_TEXT) {
      let visible = true;
      intervalId = setInterval(() => {
        setCurrentTextColor(visible ? textColor : 'transparent');
        visible = !visible;
      }, flashSpeed);
    } else if (effectType === ScrollerEffectType.BACKGROUND_BEAT) {
      // 简单实现背景色亮度变化
      let increasing = true;
      let lightness = 50; // 假设基础背景色是 hsl(..., ..., 50%)
      // 注意：这个实现比较粗糙，实际应用中可能需要解析backgroundColor并调整其亮度
      intervalId = setInterval(() => {
        if (increasing) {
          lightness += 5;
          if (lightness >= 70) increasing = false;
        } else {
          lightness -= 5;
          if (lightness <= 30) increasing = true;
        }
        // 假设 backgroundColor 是一个可以被解析的颜色
        // 这里简化，实际应用中可能需要 color-fns 或类似库
        // setCurrentBackgroundColor(`hsl(HUE, SATURATION, ${lightness}%)`);
        // 为了演示，我们让它在原始背景色和稍亮/稍暗之间切换
        setCurrentBackgroundColor(lightness > 50 ? adjustBrightness(backgroundColor, 20) : adjustBrightness(backgroundColor, -20) );

      }, 300);
    } else if (effectType === ScrollerEffectType.INVERSE) {
      setCurrentTextColor(backgroundColor);
      setCurrentBackgroundColor(textColor);
    } else {
      // CLASSIC
      setCurrentTextColor(textColor);
      setCurrentBackgroundColor(backgroundColor);
    }

    return () => clearInterval(intervalId);
  }, [effectType, textColor, backgroundColor, flashSpeed, rainbowSpeed]);

  // 辅助函数：调整颜色亮度 (简单实现)
  const adjustBrightness = (color: string, percent: number): string => {
    // 这是一个非常简化的版本，仅适用于 HEX
    if (!color.startsWith('#') || color.length !== 7) return color;
    try {
        let r = parseInt(color.substring(1, 3), 16);
        let g = parseInt(color.substring(3, 5), 16);
        let b = parseInt(color.substring(5, 7), 16);

        r = Math.max(0, Math.min(255, r + (255 * percent / 100)));
        g = Math.max(0, Math.min(255, g + (255 * percent / 100)));
        b = Math.max(0, Math.min(255, b + (255 * percent / 100)));

        return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
    } catch (e) {
        return color; // 解析失败则返回原色
    }
  };


  const animationDuration = getAnimationDuration(speed);

  const textStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    color: currentTextColor,
    animationDuration: animationDuration,
    // 使用 CSS 变量传递动画时长，以便在 CSS Module 中使用
    // 或者直接在这里设置 animationName 和 animationIterationCount 等
  };

  // 为长文本创建足够宽的内部span，确保动画流畅
  // 可以简单地重复文本几次，或者设置一个非常大的宽度
  const repetitions = Math.max(5, Math.ceil(2000 / (text.length * (fontSize * 0.6))) || 5) ; // 经验值
  const scrollingText = text.length > 0 ? Array(repetitions).fill(text).join(' \u00A0 \u00A0 ') : '';


  return (
    <div
      ref={scrollerRef}
      className={`${styles.scrollerContainer} ${className || ''}`}
      style={{ backgroundColor: currentBackgroundColor, lineHeight: `${fontSize * 1.2}px` }} // 保证文字垂直居中且不被裁剪
    >
      <div
        className={styles.scrollingText}
        style={textStyle}
        // key 属性用于在文本变化时强制重新渲染并重启动画
        key={text + JSON.stringify(textStyle) + effectType}
      >
        {scrollingText || " "} {/* 添加一个空格确保即使空文本也有高度 */}
      </div>
    </div>
  );
};

export default LedScroller;