# 风渡 开发者指南

## 项目简介

浪吞飞鸟千帆动，风渡游云一径横。风渡论坛是一个海外学生论坛，提供读书会、课程内容分享、资源互换、交友等服务。

本项目是基于React + FastAPI开发的学生论坛系统，目前提供帖子发布、评论、用户管理等功能。

### 已实现功能

身份和管理板块

- 注册、登录和验证机制
- 等级机制

论坛板块

- 等级机制发帖、回复功能

### 计划实现功能

身份和管理板块

- 密码更改机制
- 昵称、头像和简介设置
- 邮箱和authenticator机制
- 用户评分机制（每个用户可以对其他用户进行星级打分，对方被打分情况可以作为对方声誉的体现，会在对方用户名颜色上显示）
- 管理员用户机制

论坛版块

- 论坛各大板块
- 查看个人帖子
- 删帖和隐藏功能
- 图片和视频发送

小组版块

- 全部功能

组局板块

- 全部功能

## 技术栈

### 前端

- React
- Material-UI
- React Router
- Axios

### 后端

- Python FastAPI
- SQLAlchemy
- PostgreSQL
- JWT认证

## 本地开发环境搭建

### 前端

1. 进入frontend目录
2. 安装依赖:
3. 启动开发服务器:

**npm** **start**

### 后端

1. 进入backend目录
2. 创建虚拟环境:

**python** **-m** **venv** **venv**

**source** **venv/bin/activate**  **# Linux/Mac**

**venv\Scripts\activate**     **# Windows**

3. 安装依赖:

**pip** **install** **-r** **requirements.txt**

4. 启动服务器:

**uvicorn** **main:app** **--reload**

## 开发环境要求

- Node.js >= 14.0.0
- Python >= 3.8
- PostgreSQL >= 12.0
- npm >= 6.14.0

## 环境配置

### 数据库配置

1. 创建PostgreSQL数据库
2. 修改后端配置文件 `.env`:

**DATABASE_URL=postgresql://username:password@localh**ost/student_forum

**JWT_SECRET=your_jwt_secret**

### 前端环境变量

创建 `.env` 文件:

**REACT_APP_API_URL=**http://localhost:8000

## 开发流程

### 1. 分支管理

* main: 生产环境分支
* develop: 开发环境分支
* feature/*: 新功能分支
* bugfix/*: 修复分支

### 2. 提交规范

**# 新功能**

**git** **commit** **-m** **"feat: 添加用户头像上传功能"**

**# 修复bug**

**git** **commit** **-m** **"fix: 修复评论不能换行的问题"**

**# 文档更新**

**git** **commit** **-m** **"docs: 更新API文档"**

### 3. 代码规范

#### 前端代码规范

* 使用ESLint + Prettier
* 组件采用函数式编程
* 状态管理使用React Hooks
* 异步请求统一处理

示例:

**// 组件编写规范**

**const** **PostList** **=** **(**)** **=>** **{

**  **const** **[**posts**, **setPosts**]** **=** **useState**(**[**]**)**;**

**  **const** **[**loading**, **setLoading**]** **=** **useState**(**false**)**;

**  **useEffect**(**(**)** **=>** **{**

**    **fetchPosts**(**)**;**

**  **}**, **[**]**)**;**

**  **// 异步请求处理

**  **const** **fetchPosts** **=** **async** **(**)** **=>** **{**

**    **try** **{

**      **setLoading**(**true**)**;

**      **const** **response** **=** **await** **axios**.**get**(**'/api/posts'**)**;

**      **setPosts**(**response**.**data**)**;

**    **}** **catch** **(**error**)** **{

**      **console**.**error**(**error**)**;

**    **}** **finally** **{

**      **setLoading**(**false**)**;

**    **}

**  **}**;**

**}**

#### 后端代码规范

* 遵循PEP8规范
* 使用类型注解
* 编写单元测试
* 异常统一处理

示例:

**from** typing **import** List

**from** fastapi **import** HTTPException

**async** **def** **get_posts**(**skip**: **int** **=** **0**, **limit**: **int** **=** **10**)** -> List**[**Post**]**:**

**    **try**:**

**        posts **=** **await** db.posts.**find**(**)**.**skip**(**skip**)**.**limit**(**limit**)

**        **return** posts**

**    **except** Exception **as** e:**

**        **raise** **HTTPException**(**status_code**=**500**, **detail**=str**(**e**)**)**

* []()
* []()
* []()
* []()

## 目录结构

**├── frontend/               # 前端目录**

**│   ├── src/               # 源代码**

**│   │   ├── pages/        # 页面组件**

**│   │   ├── components/   # 通用组件**

**│   │   └── utils/        # 工具函数**

**│   └── public/           # 静态资源**

**├── backend/               # 后端目录**

**│   ├── models/           # 数据模型**

**│   ├── routers/          # 路由处理**

**│   ├── schemas/          # 数据验证**

**│   └── utils/            # 工具函数**

## API接口说明

### 用户相关

* POST /api/users/register - 用户注册
* POST /api/users/login - 用户登录
* GET /api/users/profile - 获取个人资料

### 帖子相关

* GET /api/posts - 获取帖子列表
* POST /api/posts/create - 创建新帖
* GET /api/posts/{id} - 获取帖子详情
* POST /api/posts/{id}/like - 点赞
* GET /api/posts/search - 搜索帖子

### 评论相关

* GET /api/posts/{id}/comments - 获取评论列表
* POST /api/posts/{id}/comments - 发表评论

## 数据库设计

### User表

* id: int (主键)
* username: varchar
* email: varchar
* password: varchar
* experience: int
* level: int

### Post表

* id: int (主键)
* title: varchar
* content: text
* author_id: int (外键)
* created_at: timestamp
* likes_count: int

### Comment表

* id: int (主键)
* content: text
* post_id: int (外键)
* user_id: int (外键)
* parent_id: int (外键)
* created_at: timestamp

## 主要功能模块

### 用户系统

* 注册/登录
* JWT认证
* 个人资料
* 等级经验系统

### 帖子系统

* 发布/编辑帖子
* 帖子列表/详情
* 搜索功能
* 点赞功能

### 评论系统

* 发表评论
* 多级回复
* @用户功能

## 部署指南

### 前端部署

1. 构建生产版本:

**npm** **run** **build**

2. 将build目录下的文件部署到Web服务器

### 后端部署

1. 安装生产环境依赖
2. 配置环境变量
3. 使用gunicorn启动:

**gunicorn** **main:app**

## 许可证

MIT License

## 项目启动步骤

### 1. 克隆项目

### 2. 数据库初始化

**# 创建数据库**

**createdb** **student_forum**

**# 执行数据库迁移**

**cd** **backend**

**alembic** **upgrade** **head**

### 3. 启动服务

**# 终端1: 启动后端**

**cd** **backend**

**source** **venv/bin/activate**  **# 或 venv\Scripts\activate**

**uvicorn** **main:app** **--reload**

**# 终端2: 启动前端**

**cd** **frontend**

**npm** **start**

### 4. 访问项目

浏览器访问 [http://localhost:3000](vscode-file://vscode-app/c:/Users/%E5%88%98%E4%B8%B0%E9%93%AD/AppData/Local/Programs/Microsoft%20VS%20Code/resources/app/out/vs/code/electron-sandbox/workbench/workbench.html)

## 测试指南

### 单元测试

**# 后端测试**

**cd** **backend**

**pytest**

**# 前端测试**

**cd** **frontend**

**npm** **test**

### E2E测试

**cd** **frontend**

**npm** **run** **cypress:open**

## 功能与文件对应

### 已实现功能

身份和管理板块:

- 注册、登录和验证机制

  - /backend/routers/users.py
  - /backend/models/user.py
  - /frontend/src/pages/Login.js
  - /frontend/src/pages/Register.js
  - /frontend/src/utils/auth.js
- 等级机制

  - /backend/models/user.py (experience和level字段)
  - /backend/utils/experience.py
  - /frontend/src/pages/Profile.js

论坛板块:

- 发帖、回复功能
  - /backend/routers/posts.py
  - /backend/models/post.py
  - /backend/models/comment.py
  - /frontend/src/pages/ForumPage.js
  - /frontend/src/pages/PostDetail.js

### 计划实现功能

身份和管理板块:

- 密码更改机制

  - 修改: /backend/routers/users.py
  - 新增: /frontend/src/pages/ChangePassword.js
  - 修改: /frontend/src/utils/auth.js
- 昵称、头像和简介设置

  - 修改: /backend/models/user.py (添加新字段)
  - 修改: /backend/routers/users.py (添加头像上传接口)
  - 新增: /frontend/src/pages/ProfileEdit.js
  - 新增: /frontend/src/components/AvatarUpload.js
- 邮箱和authenticator机制

  - 新增: /backend/utils/email.py
  - 新增: /backend/utils/authenticator.py
  - 修改: /backend/models/user.py
  - 新增: /frontend/src/pages/Security.js
  - 修改: /frontend/src/utils/auth.js
- 用户评分机制

  - 新增: /backend/models/rating.py
  - 新增: /backend/routers/ratings.py
  - 新增: /frontend/src/components/UserRating.js
  - 修改: /frontend/src/pages/Profile.js
- 管理员用户机制

  - 修改: /backend/models/user.py (添加role字段)
  - 新增: /backend/utils/permissions.py
  - 新增: /frontend/src/pages/Admin/
  - 新增: /frontend/src/utils/permissions.js
  - ......

论坛板块:

- 论坛各大板块

  - 新增: /backend/models/category.py
  - 修改: /backend/models/post.py
  - 新增: /frontend/src/pages/Category/
  - 修改: /frontend/src/pages/ForumPage.js
- 查看个人帖子

  - 修改: /backend/routers/posts.py
  - 新增: /frontend/src/pages/MyPosts.js
- 删帖和隐藏功能

  - 修改: /backend/models/post.py
  - 修改: /backend/routers/posts.py
  - 修改: /frontend/src/pages/PostDetail.js
- 图片和视频发送

  - 新增: /backend/utils/upload.py
  - 修改: /backend/models/post.py
  - 新增: /frontend/src/components/MediaUpload.js
  - 修改: /frontend/src/pages/PostDetail.js

小组版块:

- 新增: /backend/models/group.py
- 新增: /backend/routers/groups.py
- ......

组局板块:

- 新增: /backend/models/activity.py
- 新增: /backend/routers/activities.py
- ......
