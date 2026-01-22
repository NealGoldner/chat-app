const express = require('express');
const cors = require('cors');
const path = require('path');
const DeployConfig = require('./deploy-config');

// 初始化部署配置
const deployConfig = new DeployConfig();
const config = deployConfig.getConfig();

require('dotenv').config();

const app = express();
const PORT = process.env.PORT || config.PORT || 3001;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// AI对话API
app.post('/api/chat', async (req, res) => {
    try {
        const { message, language = 'zh' } = req.body;
        
        // 模拟AI响应（实际应用中可以集成真正的AI服务）
        const responses = {
            zh: [
                "这是一个很有趣的问题！让我仔细想想... 🤔",
                "我理解您的意思。从我的角度来看...",
                "感谢您的分享！这让我想到了...",
                "您说得对，我完全同意这个观点。",
                "这个话题很值得深入探讨。",
                "我能感受到您的热情！请继续说下去吧。",
                "这确实是个复杂的问题，需要仔细考虑。",
                "您的见解很独特，我学到了很多。",
                "让我们从另一个角度来看看这个问题。"
            ],
            en: [
                "That's an interesting question! Let me think... 🤔",
                "I understand what you mean. From my perspective...",
                "Thank you for sharing! This reminds me of...",
                "You're right, I completely agree with this point.",
                "This topic is worth discussing in depth.",
                "I can feel your enthusiasm! Please continue.",
                "This is indeed a complex issue that needs careful consideration.",
                "Your insights are unique, I've learned a lot.",
                "Let's look at this from another angle."
            ]
        };
        
        const languageResponses = responses[language] || responses.zh;
        const randomResponse = languageResponses[Math.floor(Math.random() * languageResponses.length)];
        
        // 模拟处理时间
        setTimeout(() => {
            res.json({
                success: true,
                response: randomResponse,
                timestamp: new Date().toISOString()
            });
        }, 1000);
        
    } catch (error) {
        console.error('Chat API error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
});

// 翻译API
app.post('/api/translate', async (req, res) => {
    try {
        const { text, from = 'en', to = 'zh' } = req.body;
        
        // 模拟翻译（实际应用中可以集成真正的翻译服务）
        const translations = {
            'Wow! This question is interesting~ Let me think... 🤔': '哇！这个问题好有趣~ 让我想想... 🤔',
            'Hehe, you\'ve asked the right question! I think it\'s like this... 😄': '嘿嘿，你问到点子上了！我觉得是这样的... 😄',
            'Oh, this question reminds me of something interesting I saw yesterday!': '哎呀，这个问题让我想起了昨天看到的一个有趣的事情！',
            'Let me analyze this with my super brain... 🧠✨': '让我用我的超级大脑来分析一下... 🧠✨',
            'This question has depth! But I think we can look at it in a simpler way~': '这个问题很有深度！不过我觉得我们可以用更简单的方式来看待它~'
        };
        
        // 模拟翻译延迟
        setTimeout(() => {
            const translatedText = translations[text] || `[${to.toUpperCase()}] ${text}`;
            
            res.json({
                success: true,
                originalText: text,
                translatedText: translatedText,
                from: from,
                to: to,
                timestamp: new Date().toISOString()
            });
        }, 800);
        
    } catch (error) {
        console.error('Translation API error:', error);
        res.status(500).json({
            success: false,
            error: 'Translation service error'
        });
    }
});

// 语音转文字API（模拟）
app.post('/api/speech-to-text', async (req, res) => {
    try {
        // 这里应该处理音频文件并转换为文字
        // 由于是演示，我们返回一个模拟结果
        
        setTimeout(() => {
            res.json({
                success: true,
                text: "这是语音转文字的结果",
                confidence: 0.95,
                timestamp: new Date().toISOString()
            });
        }, 1500);
        
    } catch (error) {
        console.error('Speech to text API error:', error);
        res.status(500).json({
            success: false,
            error: 'Speech recognition error'
        });
    }
});

// 健康检查API
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        apis: ['/api/chat', '/api/translate', '/api/speech-to-text']
    });
});

// API密钥验证中间件
function validateApiKey(req, res, next) {
    return deployConfig.validateApiKey(req, res, next);
}

// 应用API密钥验证到需要保护的接口
app.use('/api/chat', validateApiKey);
app.use('/api/translate', validateApiKey);
app.use('/api/speech-to-text', validateApiKey);

// 错误处理中间件
app.use((error, req, res, next) => {
    console.error('Server error:', error);
    res.status(500).json({
        success: false,
        error: 'Internal server error',
        timestamp: new Date().toISOString()
    });
});

// 404处理
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'API endpoint not found',
        path: req.originalUrl,
        timestamp: new Date().toISOString()
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`🚀 API Server running on port ${PORT}`);
    console.log(`📱 API endpoints:`);
    console.log(`   POST /api/chat - AI对话接口`);
    console.log(`   POST /api/translate - 翻译接口`);
    console.log(`   POST /api/speech-to-text - 语音转文字接口`);
    console.log(`   GET /api/health - 健康检查接口`);
    
    if (process.env.API_KEY) {
        console.log(`🔑 API_KEY is configured`);
    } else {
        console.log(`⚠️  API_KEY is not configured (open access)`);
    }
});

module.exports = app;
