This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

styled-components  不支持

## 项目文件夹结构

nextjs-project/
├── public/                        # 静态资源目录（公开访问）
│   ├── images/                    # 图片
│   ├── icons/                     # 图标
│   └── favicon.ico                # 网站图标
├── src/                           # 源代码目录
│   ├── app/                       # Next.js App Router 页面
│   │   ├── layout.tsx             # 全局布局文件
│   │   ├── global-error.tsx       # 全局错误处理页面
│   │   ├── loading.tsx            # 全局加载页面
│   │   ├── page.tsx               # 根页面（Home）
│   │   ├── blog/                  # 博客模块
│   │   │   ├── layout.tsx         # 博客模块的布局
│   │   │   ├── loading.tsx        # 博客模块的加载页面
│   │   │   ├── page.tsx           # 博客列表页面
│   │   │   └── [id]/              # 动态路由（博客详情页面）
│   │   │       ├── page.tsx       # 博客详情页面
│   │   │       ├── loading.tsx    # 博客详情页面的加载组件
│   │   │       └── error.tsx      # 博客详情页面的错误组件
│   │   ├── api/                   # API 路由
│   │   │   └── auth/              # 认证相关的 API
│   │   │       └── route.ts       # 认证 API 的路由定义
│   │   └── ...                    # 其他模块（如用户、设置等）
│   ├── components/                # 通用和可复用组件
│   │   ├── common/                # 通用组件（按钮、输入框等）
│   │   ├── layout/                # 布局相关组件（头部、底部等）
│   │   └── feature/               # 特定功能的复用组件
│   ├── config/                    # 配置文件
│   │   ├── env.ts                 # 环境变量配置
│   │   └── routes.ts              # 路由常量
│   ├── features/                  # 业务模块逻辑
│   │   ├── auth/                  # 认证功能
│   │   │   ├── components/        # 认证页面的组件
│   │   │   ├── api.ts             # 认证 API 请求
│   │   │   └── types.ts           # 认证模块类型
│   │   ├── blog/                  # 博客模块
│   │   └── ...                    # 其他功能模块
│   ├── hooks/                     # 自定义 Hooks
│   ├── lib/                       # 工具库和外部集成
│   │   ├── axios.ts               # Axios 配置
│   │   └── firebase.ts            # Firebase 集成
│   ├── services/                  # API 请求逻辑
│   │   ├── apiClient.ts           # API 客户端实例
│   │   ├── authService.ts         # 认证服务
│   │   └── postService.ts         # 帖子服务
│   ├── store/                     # 状态管理（Redux 或其他）
│   │   ├── index.ts               # Store 配置
│   │   └── authSlice.ts           # 认证状态模块
│   ├── styles/                    # 样式文件
│   │   ├── globals.css            # 全局样式
│   │   ├── variables.css          # CSS 变量
│   │   └── modules/               # CSS 模块
│   │       ├── Header.module.css  # 头部样式
│   │       └── Footer.module.css  # 底部样式
│   ├── types/                     # 全局类型定义
│   │   ├── api.d.ts               # API 响应类型定义
│   │   ├── global.d.ts            # 全局类型
│   │   └── models.d.ts            # 数据模型类型
│   └── utils/                     # 工具函数
│       ├── constants.ts           # 常量
│       └── formatters.ts          # 格式化函数
├── .eslintrc.js                   # ESLint 配置
├── .prettierrc                    # Prettier 配置
├── next.config.js                 # Next.js 配置文件
├── tsconfig.json                  # TypeScript 配置文件
└── package.json                   # 项目依赖和脚本
