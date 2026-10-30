# 任务管理看板 Task Kanban

一个纯前端的任务管理看板应用，基于 Vue3 + Vite + localStorage 构建，无需后端与数据库，打开即用。

## 功能特性

- **三列看板流转**：待办 → 进行中 → 已完成，任务卡片可在任意列之间双向拖拽流转，每列实时显示任务计数
- **星标标记**：重要任务一键加星，卡片视觉高亮区分
- **紧急标记**：紧急任务红色边框醒目提示，优先处理不遗漏
- **分类管理**：自定义分类标签，新增任务时自动补全已有分类
- **多主题切换**：亮色 / 暗色 / 多彩三套主题，下拉悬停即时预览，切换带过渡动画
- **完成庆祝动画**：任务拖入"已完成"列时触发 Canvas 粒子动画（彩带 / 星星 / 爱心）
- **趣味操作提示**：每次操作随机展示鼓励性 Toast 消息，带进度条与悬停暂停
- **数据自动持久化**：所有操作实时写入 localStorage，刷新页面数据不丢失
- **响应式布局**：桌面端三列横排，移动端自动纵向堆叠

## 技术栈

| 类别 | 技术 | 说明 |
|------|------|------|
| 框架 | Vue 3（Composition API + `<script setup>`） | 组件化开发 |
| 构建 | Vite 4 | 极速开发服务器 + HMR |
| 测试 | Vitest + @vue/test-utils + jsdom | 单元测试 32 个用例 |
| 存储 | localStorage | 纯前端持久化，无后端依赖 |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 8085 端口）
npm run dev

# 运行单元测试
npm test

# 构建生产版本
npm run build
```

浏览器访问 http://localhost:8085 即可使用。

## 项目结构

```
task-kanban/
├── src/
│   ├── components/        # 8 个组件：NavBar、KanbanColumn、TaskCard、
│   │                      # AddTaskModal、ThemeSelector、EmptyState、
│   │                      # FunToast、Celebration
│   ├── composables/       # useKanban / useToast / useTheme / useRipple
│   ├── config/            # 主题色板、提示文案库
│   ├── utils/             # storage / timeFormat / cssVariables
│   ├── styles/            # CSS 自定义属性（主题变量）
│   └── assets/            # 全局样式、动画关键帧
└── tests/                 # 4 个单元测试文件，32 个用例
```

## 架构设计

- **状态管理**：`useKanban` 组合式函数集中管理 columns/tasks 响应式状态，所有变更自动持久化到 localStorage，读取时带 JSON 格式校验与降级处理
- **主题系统**：通过 CSS 自定义属性动态注入实现主题切换，无需重载样式表；主题偏好持久化保存
- **组件通信**：父子组件采用 props + emits 单向数据流，跨组件状态（Toast、主题）通过模块级组合式函数共享
- **拖拽实现**：原生 HTML5 Drag & Drop API，`dataTransfer` 传递任务 ID，列容器监听 dragover/drop 事件完成流转