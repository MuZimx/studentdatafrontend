# 学生信息管理系统 (SIMS) - 前端

## 项目简介
学生信息管理系统前端，基于 Vue 3 + TypeScript + TDesign 实现。

## 技术栈
- **框架**: Vue 3 (Composition API)
- **语言**: TypeScript
- **UI组件库**: TDesign (腾讯企业级设计系统)
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP客户端**: Axios
- **构建工具**: Vite

## 项目结构
```
studentdatabackend/
├── src/
│   ├── api/              # API接口封装
│   │   ├── auth.ts      # 认证相关接口
│   │   └── request.ts   # Axios请求封装
│   ├── assets/          # 静态资源
│   ├── components/      # 公共组件
│   ├── router/          # 路由配置
│   │   └── index.ts
│   ├── stores/          # Pinia状态管理
│   │   └── auth.ts      # 认证状态
│   ├── types/           # TypeScript类型定义
│   │   └── index.ts
│   ├── views/           # 页面组件
│   │   ├── Login.vue   # 登录页面
│   │   ├── Register.vue # 注册页面
│   │   └── Dashboard.vue # 主页
│   ├── App.vue          # 根组件
│   ├── main.ts          # 应用入口
│   └── vite-env.d.ts    # Vite类型声明
├── index.html
├── package.json
├── tsconfig.json        # TypeScript配置
├── tsconfig.node.json
├── vite.config.ts       # Vite配置
└── README.md
```

## 快速开始

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
npm run dev
```
访问 http://localhost:5173

### 生产构建
```bash
npm run build
```

### 预览构建
```bash
npm run preview
```

## 功能特性

### 已实现
- ✅ 用户注册界面
- ✅ 用户登录界面
- ✅ JWT Token 认证
- ✅ 路由守卫
- ✅ 请求拦截器（自动添加Token）
- ✅ 响应拦截器（统一错误处理）
- ✅ 响应式表单验证
- ✅ 美观的UI设计

### 接口对接
后端API地址：`http://localhost:8080/api`
通过Vite代理转发，前端请求 `/api` 会自动代理到后端

## 认证说明
- 使用JWT Token进行身份认证
- Token存储在localStorage中
- 除登录和注册接口外，所有请求自动携带Token
- Token过期时自动跳转登录页

## 数据类型定义
```typescript
// 用户信息
interface User {
  studentId: string    // 学号
  username: string     // 用户名
  role: 'MANAGER' | 'USER'  // 身份
}

// 注册数据
interface RegisterData {
  studentId: string
  username: string
  password: string
  role: 'MANAGER' | 'USER'
}

// 登录数据
interface LoginData {
  username: string
  password: string
}
```
