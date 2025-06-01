// components/ConfigPanel.tsx
"use client";

import React from 'react';
import { ScrollerConfig, ScrollerEffectType, ScrollerSpeed } from '@/types';

interface ConfigPanelProps {
  config: ScrollerConfig;
  onConfigChange: (newConfig: Partial<ScrollerConfig>) => void; // 允许部分更新
}

const ConfigPanel: React.FC<ConfigPanelProps> = ({ config, onConfigChange }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let processedValue: string | number = value;
    if (type === 'number' || name === 'fontSize' || name === 'flashSpeed' || name === 'rainbowSpeed') {
      processedValue = Number(value);
    }
    onConfigChange({ [name]: processedValue });
  };

  return (
    <div className="p-4 space-y-4 bg-gray-100 rounded-lg shadow">
      <h2 className="text-xl font-semibold">灯牌配置</h2>
      <div>
        <label htmlFor="text" className="block text-sm font-medium text-gray-700">滚动文字:</label>
        <input
          type="text"
          name="text"
          id="text"
          value={config.text}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700">字号 (px):</label>
          <input
            type="number"
            name="fontSize"
            id="fontSize"
            value={config.fontSize}
            onChange={handleInputChange}
            min="10"
            max="200"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="speed" className="block text-sm font-medium text-gray-700">滚动速度:</label>
          <select
            name="speed"
            id="speed"
            value={config.speed}
            onChange={handleInputChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            {Object.values(ScrollerSpeed).map(s => (
              <option key={s} value={s}>{s.toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="textColor" className="block text-sm font-medium text-gray-700">文字颜色:</label>
          <input
            type="color"
            name="textColor"
            id="textColor"
            value={config.textColor}
            onChange={handleInputChange}
            className="mt-1 block w-full h-10 p-1 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700">背景颜色:</label>
          <input
            type="color"
            name="backgroundColor"
            id="backgroundColor"
            value={config.backgroundColor}
            onChange={handleInputChange}
            className="mt-1 block w-full h-10 p-1 border border-gray-300 rounded-md shadow-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="effectType" className="block text-sm font-medium text-gray-700">特殊效果:</label>
        <select
          name="effectType"
          id="effectType"
          value={config.effectType}
          onChange={handleInputChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          {Object.values(ScrollerEffectType).map(effect => (
            <option key={effect} value={effect}>{effect.replace('_', ' ').toUpperCase()}</option>
          ))}
        </select>
      </div>

      {config.effectType === ScrollerEffectType.FLASHING_TEXT && (
        <div>
          <label htmlFor="flashSpeed" className="block text-sm font-medium text-gray-700">闪烁速度 (ms):</label>
          <input
            type="number"
            name="flashSpeed"
            id="flashSpeed"
            value={config.flashSpeed || 500}
            onChange={handleInputChange}
            min="100"
            max="2000"
            step="50"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      )}

      {config.effectType === ScrollerEffectType.RAINBOW_TEXT && (
        <div>
          <label htmlFor="rainbowSpeed" className="block text-sm font-medium text-gray-700">彩虹变化速度 (ms):</label>
          <input
            type="number"
            name="rainbowSpeed"
            id="rainbowSpeed"
            value={config.rainbowSpeed || 100}
            onChange={handleInputChange}
            min="30"
            max="500"
            step="10"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      )}
      {/* 更多效果的特定配置可以按此方式添加 */}
    </div>
  );
};

export default ConfigPanel;