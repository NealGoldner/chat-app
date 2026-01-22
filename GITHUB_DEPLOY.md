# GitHub 部署指南

## 步骤一：创建 GitHub 仓库

### 方法 A：通过 GitHub 网页创建

1. **登录 GitHub**
   - 访问 [github.com](https://github.com)
   - 使用你的账号登录

2. **创建新仓库**
   - 点击右上角的 "+" 号
   - 选择 "New repository"

3. **配置仓库信息**
   - Repository name: `chat-website` (或你喜欢的名称)
   - Description: `现代化的对话网站，支持 Cloudflare 部署`
   - 选择 Public 或 Private
   - **不要**勾选 "Add a README file" (我们已经有了)
   - **不要**添加 .gitignore (我们已经有了)
   - **不要**选择许可证

4. **点击 "Create repository"**

### 方法 B：使用 GitHub CLI

```bash
# 安装 GitHub CLI (如果未安装)
# Windows: winget install GitHub.cli
# Mac: brew install gh
# Linux: sudo apt install gh

# 登录 GitHub
gh auth login

# 创建仓库
gh repo create chat-website --public --description "现代化的对话网站，支持 Cloudflare 部署"
```

## 步骤二：推送代码到 GitHub

### 获取仓库 URL

创建仓库后，GitHub 会显示快速设置页面。复制 HTTPS URL，格式类似：
```
https://github.com/你的用户名/chat-website.git
```

### 推送代码

```bash
# 添加远程仓库 (替换为你的实际 URL)
git remote add origin https://github.com/你的用户名/chat-website.git

# 推送到 GitHub
git push -u origin master
```

### 如果遇到认证问题

GitHub 现在要求使用 Personal Access Token 而不是密码：

1. **创建 Personal Access Token**
   - 进入 GitHub Settings > Developer settings > Personal access tokens
   - 点击 "Generate new token"
   - 选择权限：`repo` (完整仓库访问权限)
   - 复制生成的 token

2. **使用 Token 推送**
   ```bash
   # 第一次推送时会提示输入用户名和密码
   # 用户名：你的 GitHub 用户名
   # 密码：你刚创建的 Personal Access Token
   ```

## 步骤三：连接到 Cloudflare Pages

1. **登录 Cloudflare Dashboard**
   - 访问 [dash.cloudflare.com](https://dash.cloudflare.com)
   - 登录你的账号

2. **创建 Pages 项目**
   - 进入 "Pages" 部分
   - 点击 "Create a project"
   - 选择 "Connect to Git"

3. **连接 GitHub**
   - 选择 "GitHub"
   - 授权 Cloudflare 访问你的 GitHub 账号
   - 选择刚刚创建的 `chat-website` 仓库

4. **配置构建设置**
   - Project name: `chat-website`
   - Production branch: `master`
   - Build command: 留空 (静态网站无需构建)
   - Build output directory: `/` (根目录)

5. **部署**
   - 点击 "Save and Deploy"
   - 等待部署完成 (通常 1-2 分钟)

## 步骤四：获取部署 URL

部署完成后，Cloudflare 会提供：
- **Production URL**: `https://chat-website.pages.dev`
- **自定义域名**: 可以在设置中添加你的域名

## 常见问题解决

### 问题 1: 推送失败 - 权限被拒绝
```bash
# 解决方案：使用 Personal Access Token
git remote set-url origin https://你的用户名:你的token@github.com/你的用户名/chat-website.git
```

### 问题 2: 分支名称不匹配
```bash
# 如果 GitHub 默认分支是 main 而不是 master
git branch -M main
git push -u origin main
```

### 问题 3: Cloudflare 部署失败
- 检查 `_redirects` 和 `_headers` 文件格式
- 确保所有文件都已推送到 GitHub
- 查看 Cloudflare Pages 的构建日志

## 自动部署设置

设置完成后，每次你推送代码到 GitHub，Cloudflare 会自动重新部署：

```bash
# 修改文件后
git add .
git commit -m "更新内容"
git push
# Cloudflare 会自动部署新版本
```

## 下一步

- [ ] 配置自定义域名
- [ ] 设置分析统计
- [ ] 添加环境变量
- [ ] 配置部署钩子
