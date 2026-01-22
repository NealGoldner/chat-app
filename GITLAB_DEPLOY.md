# GitLab 部署指南

## 步骤一：创建 GitLab 仓库

### 方法 A：通过 GitLab 网页创建

1. **登录 GitLab**
   - 访问 [gitlab.com](https://gitlab.com)
   - 使用你的账号登录

2. **创建新项目**
   - 点击右上角的 "+" 号
   - 选择 "New project"

3. **配置项目信息**
   - Project name: `chat-website`
   - Project slug: `chat-website` (自动生成)
   - Description: `现代化的对话网站，支持 Cloudflare 部署`
   - Visibility Level: Public 或 Private
   - **不要**初始化 README、.gitignore 或 LICENSE

4. **点击 "Create project"**

### 方法 B：使用 GitLab CLI

```bash
# 安装 GitLab CLI (如果未安装)
# 参考: https://gitlab.com/gitlab-org/cli/-/blob/main/docs/installation.md

# 登录 GitLab
glab auth login

# 创建仓库
glab repo create chat-website --public --description "现代化的对话网站，支持 Cloudflare 部署"
```

## 步骤二：推送代码到 GitLab

### 获取仓库 URL

创建项目后，GitLab 会显示项目页面。复制 HTTPS URL，格式类似：
```
https://gitlab.com/你的用户名/chat-website.git
```

### 推送代码

```bash
# 添加远程仓库 (替换为你的实际 URL)
git remote add origin https://gitlab.com/你的用户名/chat-website.git

# 推送到 GitLab
git push -u origin master
```

### 如果遇到认证问题

GitLab 支持多种认证方式：

1. **使用 Personal Access Token**
   - 进入 GitLab User Settings > Access Tokens
   - 创建 token，权限选择 `write_repository`
   - 使用 token 作为密码

2. **使用 SSH Key (推荐)**
   ```bash
   # 生成 SSH Key
   ssh-keygen -t ed25519 -C "your-email@example.com"
   
   # 复制公钥到 GitLab
   cat ~/.ssh/id_ed25519.pub
   
   # 在 GitLab User Settings > SSH Keys 中添加
   
   # 使用 SSH URL 推送
   git remote set-url origin git@gitlab.com:你的用户名/chat-website.git
   git push -u origin master
   ```

## 步骤三：连接到 Cloudflare Pages

1. **登录 Cloudflare Dashboard**
   - 访问 [dash.cloudflare.com](https://dash.cloudflare.com)
   - 登录你的账号

2. **创建 Pages 项目**
   - 进入 "Pages" 部分
   - 点击 "Create a project"
   - 选择 "Connect to Git"

3. **连接 GitLab**
   - 选择 "GitLab"
   - 授权 Cloudflare 访问你的 GitLab 账号
   - 选择刚刚创建的 `chat-website` 项目

4. **配置构建设置**
   - Project name: `chat-website`
   - Production branch: `master`
   - Build command: 留空 (静态网站无需构建)
   - Build output directory: `/` (根目录)

5. **部署**
   - 点击 "Save and Deploy"
   - 等待部署完成

## 步骤四：获取部署 URL

部署完成后，Cloudflare 会提供：
- **Production URL**: `https://chat-website.pages.dev`
- **自定义域名**: 可以在设置中添加你的域名

## GitLab CI/CD 自动部署 (可选)

如果你想要更高级的 CI/CD 流程，可以创建 `.gitlab-ci.yml`：

```yaml
# .gitlab-ci.yml
stages:
  - deploy

pages:
  stage: deploy
  script:
    - echo "Deploying to Cloudflare Pages"
  artifacts:
    paths:
      - .
  only:
    - master
```

### 使用 GitLab Pages 直接部署

如果你不想使用 Cloudflare，也可以直接使用 GitLab Pages：

1. **创建 `.gitlab-ci.yml`**
   ```yaml
   pages:
     stage: deploy
     script:
       - echo "Deploying to GitLab Pages"
     artifacts:
       paths:
         - public
     only:
       - master
   ```

2. **移动文件到 public 目录**
   ```bash
   mkdir public
   cp *.html *.css *.js public/
   cp _redirects _headers public/
   ```

3. **推送代码**
   ```bash
   git add .
   git commit -m "Add GitLab Pages deployment"
   git push
   ```

## 常见问题解决

### 问题 1: 推送失败 - 权限被拒绝
```bash
# 解决方案：使用 Personal Access Token
git remote set-url origin https://oauth2:你的token@gitlab.com/你的用户名/chat-website.git
```

### 问题 2: 分支名称不匹配
```bash
# 如果 GitLab 默认分支是 main 而不是 master
git branch -M main
git push -u origin main
```

### 问题 3: Cloudflare 无法连接 GitLab
- 确保 GitLab 项目是公开的
- 检查 Cloudflare 的 GitLab 集成权限
- 尝试重新授权连接

## 自动部署设置

设置完成后，每次你推送代码到 GitLab，Cloudflare 会自动重新部署：

```bash
# 修改文件后
git add .
git commit -m "更新内容"
git push
# Cloudflare 会自动部署新版本
```

## GitLab 特有功能

### 1. Issue 跟踪
- 创建 Issue 来跟踪功能请求和 bug
- 使用标签分类：`feature`, `bug`, `enhancement`

### 2. Merge Request
- 创建分支进行开发
- 通过 Merge Request 合并代码
- 代码审查和讨论

### 3. Wiki
- 使用 GitLab Wiki 记录项目文档
- 协作编辑和版本控制

### 4. Pipelines
- 设置自动化测试
- 部署到多个环境
- 集成第三方服务

## 下一步

- [ ] 配置自定义域名
- [ ] 设置自动化测试
- [ ] 配置环境变量
- [ ] 设置部署通知
- [ ] 创建项目文档
