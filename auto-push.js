const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

class AutoPusher {
    constructor() {
        this.repoName = 'chat-website';
        this.username = 'kingthenzone';
        this.email = 'kingthenzone@gmail.com';
        this.githubToken = process.env.GITHUB_TOKEN || '';
    }

    async executeCommand(command) {
        return new Promise((resolve, reject) => {
            exec(command, { cwd: __dirname }, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error.message}`);
                    reject(error);
                } else {
                    console.log(stdout);
                    if (stderr) console.log(`Warning: ${stderr}`);
                    resolve(stdout);
                }
            });
        });
    }

    async checkGitStatus() {
        try {
            const status = await this.executeCommand('git status --porcelain');
            return status.trim().length > 0;
        } catch (error) {
            console.error('Error checking git status:', error);
            return false;
        }
    }

    async addAndCommit(message = 'Auto commit: Update files') {
        try {
            await this.executeCommand('git add .');
            await this.executeCommand(`git commit -m "${message}"`);
            console.log('✅ Files committed successfully');
            return true;
        } catch (error) {
            console.error('❌ Error committing files:', error);
            return false;
        }
    }

    async pushToGitHub() {
        try {
            // Check if remote exists
            const remotes = await this.executeCommand('git remote -v');
            
            if (!remotes.includes('origin')) {
                console.log('🔧 Setting up remote origin...');
                const repoUrl = `https://${this.username}:${this.githubToken}@github.com/${this.username}/${this.repoName}.git`;
                await this.executeCommand(`git remote add origin ${repoUrl}`);
            }

            // Push to GitHub
            await this.executeCommand('git push -u origin master');
            console.log('🚀 Successfully pushed to GitHub!');
            return true;
        } catch (error) {
            console.error('❌ Error pushing to GitHub:', error);
            console.log('\n💡 Possible solutions:');
            console.log('1. Set GITHUB_TOKEN environment variable');
            console.log('2. Create the repository on GitHub first');
            console.log('3. Check your internet connection');
            return false;
        }
    }

    async createGitHubRepo() {
        if (!this.githubToken) {
            console.log('❌ GITHUB_TOKEN not set. Please set it as environment variable.');
            return false;
        }

        const https = require('https');
        const data = JSON.stringify({
            name: this.repoName,
            description: '现代化的对话网站，支持 Cloudflare 部署',
            private: false,
            auto_init: false
        });

        const options = {
            hostname: 'api.github.com',
            port: 443,
            path: '/user/repos',
            method: 'POST',
            headers: {
                'Authorization': `token ${this.githubToken}`,
                'Content-Type': 'application/json',
                'Content-Length': data.length,
                'User-Agent': 'Auto-Push-Script'
            }
        };

        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let body = '';
                res.on('data', chunk => body += chunk);
                res.on('end', () => {
                    if (res.statusCode === 201) {
                        console.log('✅ GitHub repository created successfully!');
                        resolve(true);
                    } else if (res.statusCode === 422) {
                        console.log('⚠️ Repository already exists');
                        resolve(true);
                    } else {
                        console.error('❌ Error creating repository:', body);
                        resolve(false);
                    }
                });
            });

            req.on('error', (error) => {
                console.error('❌ Request error:', error);
                reject(error);
            });

            req.write(data);
            req.end();
        });
    }

    async autoPush() {
        console.log('🔄 Starting auto-push process...\n');

        try {
            // Check if there are changes to commit
            const hasChanges = await this.checkGitStatus();
            
            if (!hasChanges) {
                console.log('ℹ️ No changes to commit');
                return;
            }

            // Add and commit changes
            const committed = await this.addAndCommit();
            if (!committed) return;

            // Create GitHub repository if needed
            const repoCreated = await this.createGitHubRepo();
            if (!repoCreated) return;

            // Push to GitHub
            await this.pushToGitHub();

            console.log('\n🎉 Auto-push completed successfully!');
            console.log('📁 Repository: https://github.com/' + this.username + '/' + this.repoName);

        } catch (error) {
            console.error('❌ Auto-push failed:', error);
        }
    }

    async setupPeriodicPush(intervalMinutes = 5) {
        console.log(`⏰ Setting up periodic push every ${intervalMinutes} minutes...`);
        
        setInterval(async () => {
            console.log('\n🔄 Running periodic push check...');
            await this.autoPush();
        }, intervalMinutes * 60 * 1000);
    }
}

// Command line interface
if (require.main === module) {
    const args = process.argv.slice(2);
    const pusher = new AutoPusher();

    if (args.includes('--help') || args.includes('-h')) {
        console.log(`
Auto Push Script for GitHub

Usage:
  node auto-push.js [options]

Options:
  --help, -h     Show this help message
  --watch, -w    Enable periodic watching (every 5 minutes)
  --commit <msg> Custom commit message
  --token <token> GitHub personal access token

Environment Variables:
  GITHUB_TOKEN   Your GitHub personal access token

Examples:
  node auto-push.js                    # One-time push
  node auto-push.js --watch           # Enable periodic watching
  node auto-push.js --commit "Fix bug" # Custom commit message

Note: Make sure to create a GitHub Personal Access Token with 'repo' scope.
        `);
        process.exit(0);
    }

    if (args.includes('--watch') || args.includes('-w')) {
        const intervalIndex = args.findIndex(arg => arg === '--interval');
        const interval = intervalIndex !== -1 ? parseInt(args[intervalIndex + 1]) : 5;
        
        pusher.setupPeriodicPush(interval);
        pusher.autoPush(); // Initial push
    } else {
        pusher.autoPush();
    }
}

module.exports = AutoPusher;
