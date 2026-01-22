#!/usr/bin/env node

// 部署设置脚本
const DeployConfig = require('./deploy-config');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function setupDeployment() {
    console.log('🚀 对话网站部署配置向导\n');
    console.log('请选择部署环境：');
    console.log('1. 开发环境 (本地测试)');
    console.log('2. 生产环境 (正式部署)');
    console.log('3. 自定义配置');
    
    const choice = await question('\n请输入选择 (1-3): ');
    
    const deployConfig = new DeployConfig();
    
    switch (choice) {
        case '1':
            console.log('\n📝 配置开发环境...');
            const devConfig = deployConfig.createDevelopmentConfig();
            console.log('✅ 开发环境配置完成！');
            console.log(`API_KEY: ${devConfig.API_KEY}`);
            console.log(`PORT: ${devConfig.PORT}`);
            break;
            
        case '2':
            console.log('\n🏭 配置生产环境...');
            const prodConfig = deployConfig.createProductionConfig();
            console.log('✅ 生产环境配置完成！');
            console.log(`API_KEY: ${prodConfig.API_KEY}`);
            console.log(`PORT: ${prodConfig.PORT}`);
            console.log('\n⚠️  请保存好API_KEY，部署时需要使用！');
            break;
            
        case '3':
            console.log('\n⚙️  自定义配置...');
            await customSetup(deployConfig);
            break;
            
        default:
            console.log('❌ 无效选择，使用默认开发配置');
            deployConfig.createDevelopmentConfig();
    }
    
    console.log('\n📋 配置文件已创建：.env');
    console.log('\n🚀 启动命令：');
    console.log('  API服务器: node api-server.js');
    console.log('  前端服务器: node server.js');
    
    rl.close();
}

async function customSetup(deployConfig) {
    const port = await question('请输入端口号 (默认3001): ') || '3001';
    const apiKey = await question('请输入API密钥 (留空自动生成): ') || deployConfig.generateApiKey();
    const corsOrigin = await question('请输入CORS允许的源 (默认*): ') || '*';
    
    const customConfig = {
        PORT: port,
        API_KEY: apiKey,
        CORS_ORIGIN: corsOrigin,
        NODE_ENV: 'custom'
    };
    
    deployConfig.saveConfig(customConfig);
    console.log('✅ 自定义配置完成！');
    console.log(`API_KEY: ${customConfig.API_KEY}`);
    console.log(`PORT: ${customConfig.PORT}`);
}

// 如果直接运行此脚本
if (require.main === module) {
    setupDeployment().catch(console.error);
}

module.exports = { setupDeployment };
