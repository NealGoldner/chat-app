# 🚀 部署配置指南

## 📋 快速开始

### 1️⃣ 运行部署配置向导
```bash
node setup-deploy.js
```

### 2️⃣ 选择部署环境
- **1**: 开发环境 (本地测试)
- **2**: 生产环境 (正式部署)  
- **3**: 自定义配置

## 🔑 API_KEY 配置说明

### 🏗️ 开发环境
```bash
PORT=3001
API_KEY=demo_key
NODE_ENV=development
```

### 🏭 生产环境
```bash
PORT=3001
API_KEY=chat_app_1642876543210_abc123def456
NODE_ENV=production
```

### ⚙️ 自定义配置
```bash
PORT=你的端口
API_KEY=你的密钥
CORS_ORIGIN=你的域名
```

## 🌐 部署方式

### 📱 本地部署
```bash
# 1. 配置环境
node setup-deploy.js

# 2. 启动API服务器
node api-server.js

# 3. 启动前端服务器
node server.js

# 4. 访问应用
http://localhost:8080
```

### ☁️ 云平台部署

#### Vercel 部署
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署 API
vercel --prod

# 部署前端
vercel --prod
```

#### Railway 部署
```bash
# 安装 Railway CLI
npm i -g @railway/cli

# 登录并部署
railway login
railway up
```

#### Heroku 部署
```bash
# 创建 Heroku 应用
heroku create your-chat-app

# 设置环境变量
heroku config:set API_KEY=your_production_api_key
heroku config:set NODE_ENV=production

# 部署
git push heroku main
```

## 🔒 安全配置

### API_KEY 生成规则
- 格式: `chat_app_{timestamp}_{random}`
- 长度: 32-64字符
- 字符: 字母数字下划线

### 示例
```bash
# 开发环境
API_KEY=demo_key

# 生产环境
API_KEY=chat_app_1642876543210_abc123def456

# 测试环境
API_KEY=chat_app_1642876543210_test789ghi012
```

## 📱 手机访问配置

### 局域网访问
```bash
# 修改 api-server.js
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}/`);
});
```

### 手机访问地址
```
http://你的电脑IP:8080
```

## 🔧 环境变量说明

| 变量名 | 说明 | 示例 |
|--------|------|------|
| PORT | 服务器端口 | 3001 |
| API_KEY | API访问密钥 | chat_app_123_abc |
| NODE_ENV | 运行环境 | development/production |
| CORS_ORIGIN | 跨域允许源 | * 或具体域名 |
| DEBUG | 调试模式 | true/false |

## 🚨 注意事项

1. **生产环境**必须使用强密码作为API_KEY
2. **不要**将API_KEY提交到版本控制系统
3. **定期**更换生产环境的API_KEY
4. **使用**HTTPS协议保护API_KEY传输

## 📊 部署检查清单

- [ ] 运行 `node setup-deploy.js` 配置环境
- [ ] 安装依赖 `npm install`
- [ ] 测试API服务器 `node api-server.js`
- [ ] 测试前端服务器 `node server.js`
- [ ] 验证API_KEY认证功能
- [ ] 测试手机访问
- [ ] 配置HTTPS（生产环境）

## 🆘 故障排除

### 端口占用
```bash
# 查看端口占用
netstat -ano | findstr :3001

# 杀死进程
taskkill /PID <进程ID> /F
```

### API_KEY 错误
```bash
# 重新生成配置
node setup-deploy.js
```

### 依赖缺失
```bash
# 安装所有依赖
npm install express cors dotenv
```
