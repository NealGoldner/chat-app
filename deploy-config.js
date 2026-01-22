// 部署配置系统
const fs = require('fs');
const path = require('path');

class DeployConfig {
    constructor() {
        this.configPath = path.join(__dirname, '.env');
        this.config = this.loadConfig();
    }

    loadConfig() {
        try {
            if (fs.existsSync(this.configPath)) {
                const content = fs.readFileSync(this.configPath, 'utf8');
                return this.parseEnv(content);
            }
        } catch (error) {
            console.error('Error loading config:', error);
        }
        return this.getDefaultConfig();
    }

    parseEnv(content) {
        const config = {};
        const lines = content.split('\n');
        
        lines.forEach(line => {
            const trimmed = line.trim();
            if (trimmed && !trimmed.startsWith('#')) {
                const [key, ...valueParts] = trimmed.split('=');
                if (key && valueParts.length > 0) {
                    config[key.trim()] = valueParts.join('=').trim();
                }
            }
        });
        
        return config;
    }

    getDefaultConfig() {
        return {
            PORT: '3001',
            API_KEY: 'demo_key',
            NODE_ENV: 'development'
        };
    }

    generateApiKey() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2);
        return `chat_app_${timestamp}_${random}`;
    }

    createProductionConfig() {
        const productionConfig = {
            PORT: '3001',
            API_KEY: this.generateApiKey(),
            NODE_ENV: 'production',
            CORS_ORIGIN: '*',
            RATE_LIMIT: '1000'
        };

        this.saveConfig(productionConfig);
        return productionConfig;
    }

    createDevelopmentConfig() {
        const devConfig = {
            PORT: '3001',
            API_KEY: 'demo_key',
            NODE_ENV: 'development',
            CORS_ORIGIN: '*',
            DEBUG: 'true'
        };

        this.saveConfig(devConfig);
        return devConfig;
    }

    saveConfig(config) {
        const content = Object.entries(config)
            .map(([key, value]) => `${key}=${value}`)
            .join('\n');

        try {
            fs.writeFileSync(this.configPath, content, 'utf8');
            console.log('✅ 配置已保存到 .env 文件');
        } catch (error) {
            console.error('❌ 保存配置失败:', error);
        }
    }

    validateApiKey(req, res, next) {
        const apiKey = req.headers['x-api-key'];
        const configApiKey = this.config.API_KEY;

        // 开发环境跳过验证
        if (this.config.NODE_ENV === 'development' && configApiKey === 'demo_key') {
            return next();
        }

        if (!apiKey || apiKey !== configApiKey) {
            return res.status(401).json({
                success: false,
                error: 'Invalid API key',
                message: '请提供有效的API密钥'
            });
        }

        next();
    }

    getConfig() {
        return this.config;
    }

    updateConfig(updates) {
        this.config = { ...this.config, ...updates };
        this.saveConfig(this.config);
    }
}

module.exports = DeployConfig;
