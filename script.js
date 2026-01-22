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
            attachBtn: document.getElementById('attach-btn'),
            searchBtn: document.getElementById('search-btn'),
            clearBtn: document.getElementById('clear-btn'),
            searchContainer: document.getElementById('search-container'),
            searchInput: document.getElementById('search-input'),
            closeSearchBtn: document.getElementById('close-search-btn'),
            searchResults: document.getElementById('search-results'),
            voiceBtn: document.getElementById('voice-btn'),
            emojiPicker: document.getElementById('emoji-picker')
        };
    }

    bindEvents() {
        this.elements.messageInput.addEventListener('input', this.handleInputChange.bind(this));
        this.elements.messageInput.addEventListener('keydown', this.handleKeyDown.bind(this));
        this.elements.sendBtn.addEventListener('click', this.sendMessage.bind(this));
        this.elements.settingsBtn.addEventListener('click', this.openSettings.bind(this));
        this.elements.closeSettings.addEventListener('click', this.closeSettings.bind(this));
        this.elements.saveSettings.addEventListener('click', this.saveSettings.bind(this));
        this.elements.emojiBtn.addEventListener('click', this.toggleEmojiPicker.bind(this));
        this.elements.attachBtn.addEventListener('click', this.handleAttachment.bind(this));
        this.elements.searchBtn.addEventListener('click', this.toggleSearch.bind(this));
        this.elements.clearBtn.addEventListener('click', this.clearChat.bind(this));
        this.elements.closeSearchBtn.addEventListener('click', this.closeSearch.bind(this));
        this.elements.searchInput.addEventListener('input', this.handleSearch.bind(this));
        this.elements.voiceBtn.addEventListener('mousedown', this.startVoiceRecording.bind(this));
        this.elements.voiceBtn.addEventListener('mouseup', this.stopVoiceRecording.bind(this));
        this.elements.voiceBtn.addEventListener('mouseleave', this.stopVoiceRecording.bind(this));
        
        // Emoji picker events
        document.querySelectorAll('.emoji-item').forEach(item => {
            item.addEventListener('click', (e) => this.selectEmoji(e.target.textContent));
        });
        
        // Click outside to close emoji picker
        document.addEventListener('click', (e) => {
            if (!this.elements.emojiPicker.contains(e.target) && e.target !== this.elements.emojiBtn) {
                this.elements.emojiPicker.style.display = 'none';
            }
        });
        
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
        messageDiv.setAttribute('data-message-id', message.id);
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${this.escapeHtml(message.text)}</div>
                <span class="message-time">${this.formatTime(message.timestamp)}</span>
                <div class="message-reactions" id="reactions-${message.id}"></div>
            </div>
        `;
        
        this.removeWelcomeMessage();
        this.elements.messagesContainer.appendChild(messageDiv);
        
        // Add reaction functionality
        this.addMessageReactions(message.id);
    }

    addMessageReactions(messageId) {
        const reactionsContainer = document.getElementById(`reactions-${messageId}`);
        const commonReactions = ['❤️', '👍', '😂', '🎉', '😍'];
        
        commonReactions.forEach(emoji => {
            const reaction = document.createElement('span');
            reaction.className = 'reaction';
            reaction.textContent = emoji;
            reaction.addEventListener('click', () => this.toggleReaction(messageId, emoji, reaction));
            reactionsContainer.appendChild(reaction);
        });
    }

    toggleReaction(messageId, emoji, element) {
        element.classList.toggle('active');
        
        // Store reaction data (in a real app, this would be sent to a server)
        const message = this.messages.find(msg => msg.id === messageId);
        if (message) {
            if (!message.reactions) message.reactions = {};
            message.reactions[emoji] = element.classList.contains('active');
        }
        
        // Show notification
        const action = element.classList.contains('active') ? '添加了' : '移除了';
        this.showNotification(`${action}反应 ${emoji}`);
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

    toggleEmojiPicker() {
        const picker = this.elements.emojiPicker;
        picker.style.display = picker.style.display === 'none' ? 'block' : 'none';
        if (picker.style.display === 'block') {
            this.elements.searchInput.focus();
        }
    }

    selectEmoji(emoji) {
        const cursorPosition = this.elements.messageInput.selectionStart;
        const currentValue = this.elements.messageInput.value;
        const newValue = currentValue.slice(0, cursorPosition) + emoji + currentValue.slice(cursorPosition);
        
        this.elements.messageInput.value = newValue;
        this.elements.messageInput.selectionStart = cursorPosition + emoji.length;
        this.elements.messageInput.selectionEnd = cursorPosition + emoji.length;
        
        this.handleInputChange({ target: this.elements.messageInput });
        this.elements.emojiPicker.style.display = 'none';
        this.elements.messageInput.focus();
    }

    toggleSearch() {
        const searchContainer = this.elements.searchContainer;
        const isVisible = searchContainer.style.display !== 'none';
        
        if (isVisible) {
            this.closeSearch();
        } else {
            searchContainer.style.display = 'block';
            this.elements.searchInput.focus();
        }
    }

    closeSearch() {
        this.elements.searchContainer.style.display = 'none';
        this.elements.searchInput.value = '';
        this.elements.searchResults.innerHTML = '';
    }

    handleSearch(e) {
        const query = e.target.value.toLowerCase().trim();
        
        if (query === '') {
            this.elements.searchResults.innerHTML = '';
            return;
        }

        const results = this.messages.filter(msg => 
            msg.text.toLowerCase().includes(query)
        );

        this.displaySearchResults(results, query);
    }

    displaySearchResults(results, query) {
        const resultsContainer = this.elements.searchResults;
        
        if (results.length === 0) {
            resultsContainer.innerHTML = '<div class="search-result-item">没有找到匹配的消息</div>';
            return;
        }

        resultsContainer.innerHTML = results.map(msg => `
            <div class="search-result-item" data-message-id="${msg.id}">
                <span class="result-text">${this.highlightSearchTerm(msg.text, query)}</span>
                <span class="result-time">${this.formatTime(msg.timestamp)}</span>
            </div>
        `).join('');

        // Add click events to search results
        resultsContainer.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const messageId = parseInt(item.dataset.messageId);
                this.scrollToMessage(messageId);
                this.closeSearch();
            });
        });
    }

    highlightSearchTerm(text, term) {
        const regex = new RegExp(`(${term})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }

    scrollToMessage(messageId) {
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        if (messageElement) {
            messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            messageElement.style.backgroundColor = 'var(--warning-color)';
            setTimeout(() => {
                messageElement.style.backgroundColor = '';
            }, 2000);
        }
    }

    clearChat() {
        if (confirm('确定要清空所有聊天记录吗？此操作无法撤销。')) {
            this.messages = [];
            this.elements.messagesContainer.innerHTML = '';
            this.addWelcomeMessage();
            this.showNotification('聊天记录已清空');
        }
    }

    startVoiceRecording() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('您的浏览器不支持语音录制功能');
            return;
        }

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                this.mediaRecorder = new MediaRecorder(stream);
                this.audioChunks = [];
                
                this.mediaRecorder.ondataavailable = (event) => {
                    this.audioChunks.push(event.data);
                };
                
                this.mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
                    this.handleVoiceMessage(audioBlob);
                    stream.getTracks().forEach(track => track.stop());
                };
                
                this.mediaRecorder.start();
                this.showVoiceRecordingIndicator();
            })
            .catch(error => {
                console.error('Error accessing microphone:', error);
                alert('无法访问麦克风，请检查权限设置');
            });
    }

    stopVoiceRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
            this.hideVoiceRecordingIndicator();
        }
    }

    showVoiceRecordingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'voice-recording';
        indicator.innerHTML = `
            <div class="recording-dot"></div>
            <span>正在录制...</span>
        `;
        indicator.id = 'voice-recording-indicator';
        
        this.elements.inputContainer.appendChild(indicator);
    }

    hideVoiceRecordingIndicator() {
        const indicator = document.getElementById('voice-recording-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    handleVoiceMessage(audioBlob) {
        // Convert audio to base64 for storage
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Audio = reader.result;
            const message = `🎵 语音消息 (${this.formatFileSize(audioBlob.size)})`;
            this.addMessage(message, 'user');
            
            // Simulate response to voice message
            setTimeout(() => {
                this.simulateOtherPersonTyping();
            }, 1000);
        };
        reader.readAsDataURL(audioBlob);
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
