import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // 启用基于 class 的暗黑模式
  theme: {
    extend: {
      colors: {
        // 定义你的主题色
        primary: {
          DEFAULT: "#FFD100", // 默认主题色
        },
        // 为浅色和深色模式定义背景和文本颜色
        background: {
          light: "#FFFFFF",
          dark: "#111827", // Tailwind gray-900
        },
        foreground: {
          light: "#1F2937", // Tailwind gray-800
          dark: "#F9FAFB", // Tailwind gray-50
        },
        card: {
          light: "#FFFFFF",
          dark: "#1F2937", // Tailwind gray-800
        },
        'card-foreground': {
          light: "#1F2937", // Tailwind gray-800
          dark: "#F9FAFB", // Tailwind gray-50
        },
        // 添加 muted-foreground 以便全局样式使用
         muted: {
           foreground: {
             light: '#6B7280', // gray-500
             dark: '#9CA3AF', // gray-400
           }
         }
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      // 如果你想自定义动画，可以在这里添加 keyframes
      // keyframes: {
      //   fadeInUp: { ... }
      // },
      // animation: {
      //   fadeInUp: 'fadeInUp 1s ease-out',
      // }
    },
  },
  plugins: [
    require("tailwindcss-animate") // <-- 启用动画插件
  ],
};
export default config;