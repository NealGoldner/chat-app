class ChatApp {
    constructor() {
        this.messages = [];
        this.username = '用户';
        this.isTyping = false;
        this.typingTimeout = null;
        this.autoResponseTimeout = null;
        
        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
        this.initializeChat();
    }

    initializeElements() {
        this.elements = {
            messageInput: document.getElementById('message-input'),
            sendBtn: document.getElementById('send-btn'),
            messagesContainer: document.getElementById('messages-container'),
            typingIndicator: document.getElementById('typing-indicator'),
            charCount: document.getElementById('char-count'),
            settingsBtn: document.getElementById('settings-btn'),
            settingsModal: document.getElementById('settings-modal'),
            closeSettings: document.getElementById('close-settings'),
            saveSettings: document.getElementById('save-settings'),
            usernameInput: document.getElementById('username'),
            themeSelect: document.getElementById('theme'),
            notificationsCheckbox: document.getElementById('notifications'),
            userInitial: document.getElementById('user-initial'),
            emojiBtn: document.getElementById('emoji-btn'),
            attachBtn: document.getElementById('attach-btn')
        };
    }

    bindEvents() {
        this.elements.messageInput.addEventListener('input', this.handleInputChange.bind(this));
        this.elements.messageInput.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.elements.sendBtn.addEventListener('click', this.sendMessage.bind(this));
        this.elements.settingsBtn.addEventListener('click', this.openSettings.bind(this));
        this.elements.closeSettings.addEventListener('click', this.closeSettings.bind(this));
        this.elements.saveSettings.addEventListener('click', this.saveSettings.bind(this));
        this.elements.emojiBtn.addEventListener('click', this.insertEmoji.bind(this));
        this.elements.attachBtn.addEventListener('click', this.handleAttachment.bind(this));
        
        this.elements.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.elements.settingsModal) {
                this.closeSettings();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.elements.settingsModal.style.display !== 'none') {
                this.closeSettings();
            }
        });
    }

    initializeChat() {
        this.updateUserInitial();
        this.addWelcomeMessage();
        this.scrollToBottom();
    }

    handleInputChange(e) {
        const text = e.target.value;
        const charCount = text.length;
        
        this.elements.charCount.textContent = `${charCount} / 2000`;
        this.elements.sendBtn.disabled = charCount.trim() === 0;
        
        this.autoResizeTextarea();
        
        if (!this.isTyping && charCount > 0) {
            this.startTyping();
        }
        
        clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
            this.stopTyping();
        }, 1000);
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.sendMessage();
        }
    }

    autoResizeTextarea() {
        const textarea = this.elements.messageInput;
        textarea.style.height = 'auto';
        textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }

    startTyping() {
        this.isTyping = true;
    }

    stopTyping() {
        this.isTyping = false;
    }

    sendMessage() {
        const messageText = this.elements.messageInput.value.trim();
        
        if (messageText === '') return;
        
        this.addMessage(messageText, 'user');
        this.elements.messageInput.value = '';
        this.elements.charCount.textContent = '0 / 2000';
        this.elements.sendBtn.disabled = true;
        this.autoResizeTextarea();
        
        this.simulateOtherPersonTyping();
    }

    addMessage(text, sender, timestamp = new Date()) {
        const message = {
            id: Date.now(),
            text: text,
            sender: sender,
            timestamp: timestamp
        };
        
        this.messages.push(message);
        this.renderMessage(message);
        this.scrollToBottom();
    }

    renderMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender}`;
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${this.escapeHtml(message.text)}</div>
                <span class="message-time">${this.formatTime(message.timestamp)}</span>
            </div>
        `;
        
        this.removeWelcomeMessage();
        this.elements.messagesContainer.appendChild(messageDiv);
    }

    simulateOtherPersonTyping() {
        this.showTypingIndicator();
        
        const responseDelay = Math.random() * 2000 + 1000;
        
        this.autoResponseTimeout = setTimeout(() => {
            this.hideTypingIndicator();
            this.generateAutoResponse();
        }, responseDelay);
    }

    generateAutoResponse() {
        const responses = [
            "这是一个很有趣的问题！让我想想...",
            "我理解你的意思。从我的角度来看...",
            "谢谢你的分享！这让我想到了...",
            "你说得对，我完全同意这个观点。",
            "这个话题很值得深入讨论。",
            "我能感受到你的热情！继续说下去吧。",
            "这确实是个复杂的问题，需要仔细考虑。",
            "你的见解很独特，我学到了很多。",
            "让我们从另一个角度来看看这个问题。",
            "我很高兴能和你讨论这个话题！"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        this.addMessage(randomResponse, 'other');
    }

    showTypingIndicator() {
        this.elements.typingIndicator.style.display = 'flex';
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        this.elements.typingIndicator.style.display = 'none';
    }

    addWelcomeMessage() {
        if (this.messages.length === 0) {
            const welcomeDiv = document.createElement('div');
            welcomeDiv.className = 'welcome-message';
            welcomeDiv.innerHTML = `
                <div class="welcome-content">
                    <h2>欢迎使用对话网站！</h2>
                    <p>我是您的AI助手，随时准备为您解答问题。请输入您想要讨论的话题。</p>
                </div>
            `;
            this.elements.messagesContainer.appendChild(welcomeDiv);
        }
    }

    removeWelcomeMessage() {
        const welcomeMessage = this.elements.messagesContainer.querySelector('.welcome-message');
        if (welcomeMessage) {
            welcomeMessage.remove();
        }
    }

    scrollToBottom() {
        setTimeout(() => {
            this.elements.messagesContainer.scrollTop = this.elements.messagesContainer.scrollHeight;
        }, 100);
    }

    formatTime(date) {
        return date.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    insertEmoji() {
        const emojis = ['😊', '😂', '❤️', '👍', '🎉', '🤔', '😍', '🙏', '💪', '✨'];
        const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        const cursorPosition = this.elements.messageInput.selectionStart;
        const currentValue = this.elements.messageInput.value;
        const newValue = currentValue.slice(0, cursorPosition) + randomEmoji + currentValue.slice(cursorPosition);
        
        this.elements.messageInput.value = newValue;
        this.elements.messageInput.selectionStart = cursorPosition + randomEmoji.length;
        this.elements.messageInput.selectionEnd = cursorPosition + randomEmoji.length;
        
        this.handleInputChange({ target: this.elements.messageInput });
        this.elements.messageInput.focus();
    }

    handleAttachment() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,.pdf,.doc,.docx';
        
        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const message = `📎 已选择文件: ${file.name} (${this.formatFileSize(file.size)})`;
                this.addMessage(message, 'user');
            }
        });
        
        input.click();
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    openSettings() {
        this.elements.settingsModal.style.display = 'flex';
        this.elements.usernameInput.value = this.username;
        this.elements.usernameInput.focus();
    }

    closeSettings() {
        this.elements.settingsModal.style.display = 'none';
    }

    saveSettings() {
        const newUsername = this.elements.usernameInput.value.trim();
        const theme = this.elements.themeSelect.value;
        const notifications = this.elements.notificationsCheckbox.checked;
        
        if (newUsername) {
            this.username = newUsername;
            this.updateUserInitial();
        }
        
        this.applyTheme(theme);
        
        const settings = {
            username: this.username,
            theme: theme,
            notifications: notifications
        };
        
        localStorage.setItem('chatSettings', JSON.stringify(settings));
        
        if (notifications) {
            this.showNotification('设置已保存');
        }
        
        this.closeSettings();
    }

    loadSettings() {
        const savedSettings = localStorage.getItem('chatSettings');
        
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            this.username = settings.username || '用户';
            this.elements.usernameInput.value = this.username;
            this.elements.themeSelect.value = settings.theme || 'light';
            this.elements.notificationsCheckbox.checked = settings.notifications !== false;
            
            this.applyTheme(settings.theme || 'light');
        }
    }

    applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.style.setProperty('--bg-primary', '#1a1a1a');
            document.documentElement.style.setProperty('--bg-secondary', '#2d2d2d');
            document.documentElement.style.setProperty('--bg-tertiary', '#404040');
            document.documentElement.style.setProperty('--text-primary', '#ffffff');
            document.documentElement.style.setProperty('--text-secondary', '#b0b0b0');
            document.documentElement.style.setProperty('--text-muted', '#808080');
            document.documentElement.style.setProperty('--border-color', '#404040');
            document.documentElement.style.setProperty('--message-other-bg', '#2d2d2d');
            document.documentElement.style.setProperty('--message-other-text', '#ffffff');
        } else {
            document.documentElement.style.setProperty('--bg-primary', '#ffffff');
            document.documentElement.style.setProperty('--bg-secondary', '#f8f9fa');
            document.documentElement.style.setProperty('--bg-tertiary', '#e9ecef');
            document.documentElement.style.setProperty('--text-primary', '#212529');
            document.documentElement.style.setProperty('--text-secondary', '#6c757d');
            document.documentElement.style.setProperty('--text-muted', '#adb5bd');
            document.documentElement.style.setProperty('--border-color', '#dee2e6');
            document.documentElement.style.setProperty('--message-other-bg', '#f1f3f4');
            document.documentElement.style.setProperty('--message-other-text', '#212529');
        }
    }

    updateUserInitial() {
        const initial = this.username.charAt(0).toUpperCase();
        this.elements.userInitial.textContent = initial;
    }

    showNotification(message) {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications');
            return;
        }
        
        if (Notification.permission === 'granted') {
            new Notification('对话网站', {
                body: message,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23007bff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('对话网站', {
                        body: message,
                        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23007bff"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
                    });
                }
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
});

if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
