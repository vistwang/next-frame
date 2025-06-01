// app/page.tsx
"use client"; // 因为有状态管理和事件处理，整个页面设为客户端组件更方便

import React, { useState, useCallback, useEffect } from 'react';
import LedScroller from '@/components/LedScroller';
import ConfigPanel from '@/components/ConfigPanel';
import { ScrollerConfig, ScrollerEffectType, ScrollerSpeed } from '@/types';

const initialScrollerConfig: ScrollerConfig = {
  text: 'Next.js 15 LED Scroller! 🎉',
  fontSize: 60,
  textColor: '#FFFFFF',
  backgroundColor: '#000000',
  speed: ScrollerSpeed.MEDIUM,
  effectType: ScrollerEffectType.CLASSIC,
  flashSpeed: 500,
  rainbowSpeed: 100,
};

export default function LedScrollerPage() {
  const [config, setConfig] = useState<ScrollerConfig>(initialScrollerConfig);
  const [isFullscreen, setIsFullscreen] = useState(false); // 新增全屏状态

  const handleConfigChange = useCallback((newConfigPartial: Partial<ScrollerConfig>) => {
    setConfig(prevConfig => ({ ...prevConfig, ...newConfigPartial }));
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  // 监听全屏变化事件，以便在用户按 ESC 退出全屏时更新状态
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);


  return (
    <div className={`min-h-screen flex flex-col ${isFullscreen ? 'bg-transparent' : 'bg-gray-200'}`}>
      {!isFullscreen && ( // 非全屏时显示配置面板和切换按钮
        <header className="p-4 bg-white shadow">
          <h1 className="text-2xl font-bold text-center text-gray-800">手机灯牌生成器</h1>
        </header>
      )}

      <main className={`flex-grow flex ${isFullscreen ? 'items-center justify-center h-screen' : 'flex-col lg:flex-row p-4 gap-4'}`}>
        {!isFullscreen && (
          <div className="lg:w-1/3 w-full">
            <ConfigPanel config={config} onConfigChange={handleConfigChange} />
          </div>
        )}

        <div className={`flex-grow ${isFullscreen ? 'w-full h-full' : 'lg:w-2/3 w-full border border-gray-400 rounded-lg overflow-hidden'}`}>
          <LedScroller {...config} className={isFullscreen ? 'h-full w-full' : 'h-48 lg:h-full'} />
        </div>
      </main>

      {!isFullscreen && (
         <div className="p-4 text-center">
            <button
                onClick={toggleFullscreen}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-150"
            >
                {isFullscreen ? '退出全屏' : '🚀 进入全屏灯牌'}
            </button>
        </div>
      )}
      {/* 全屏时也可以提供一个小的退出按钮，或者依赖 ESC */}
      {isFullscreen && (
         <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 px-3 py-1 bg-gray-700 bg-opacity-50 text-white text-xs rounded hover:bg-opacity-75 z-50"
            title="退出全屏"
          >
            ESC / 退出
          </button>
      )}
    </div>
  );
}