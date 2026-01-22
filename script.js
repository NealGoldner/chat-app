class ChatApp {
    constructor() {
        this.messages = [];
        this.username = '用户';
        this.isTyping = false;
        this.typingTimeout = null;
        this.autoResponseTimeout = null;
        this.funMode = false;
        this.emojiRainInterval = null;
        
        // 对话流程控制
        this.isAiResponding = false;
        this.userMessageQueue = [];
        this.aiResponseQueue = [];
        this.currentAiResponse = null;
        this.conversationCount = 0;
        this.lastUserMessageTime = 0;
        
        // 双语功能
        this.bilingualMode = true;
        this.translationCache = new Map();
        
        this.initializeElements();
        this.bindEvents();
        this.loadSettings();
        this.initializeChat();
        this.initFunMode();
    }

    initFunMode() {
        // 随机启动趣味模式
        if (Math.random() > 0.7) {
            this.enableFunMode();
        }
        
        // 添加趣味模式切换按钮
        this.addFunModeToggle();
    }

    addFunModeToggle() {
        const funBtn = document.createElement('button');
        funBtn.className = 'btn-icon fun-toggle';
        funBtn.id = 'fun-mode-btn';
        funBtn.title = '趣味模式';
        funBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                <path d="M2 12h2"></path>
                <path d="M20 12h2"></path>
                <path d="M12 2v2"></path>
                <path d="M12 20v2"></path>
            </svg>
        `;
        
        this.elements.headerActions.appendChild(funBtn);
        this.elements.funBtn = funBtn;
        
        funBtn.addEventListener('click', () => this.toggleFunMode());
    }

    toggleFunMode() {
        this.funMode = !this.funMode;
        document.body.classList.toggle('fun-mode', this.funMode);
        
        if (this.funMode) {
            this.enableFunMode();
            this.showNotification("🎉 趣味模式已开启！准备好享受有趣的聊天吧！");
        } else {
            this.disableFunMode();
            this.showNotification("趣味模式已关闭");
        }
    }

    enableFunMode() {
        this.funMode = true;
        document.body.classList.add('fun-mode');
        
        // 添加趣味样式到现有元素
        this.elements.typingIndicator.classList.add('fun-mode');
        this.elements.sendBtn.classList.add('fun-mode');
        this.elements.emojiBtn.classList.add('fun-mode');
        
        // 启动表情雨
        this.startEmojiRain();
        
        // 添加趣味效果到欢迎消息
        const welcomeMsg = document.querySelector('.welcome-message');
        if (welcomeMsg) {
            welcomeMsg.classList.add('fun-mode');
        }
    }

    disableFunMode() {
        this.funMode = false;
        document.body.classList.remove('fun-mode');
        
        // 移除趣味样式
        this.elements.typingIndicator.classList.remove('fun-mode');
        this.elements.sendBtn.classList.remove('fun-mode');
        this.elements.emojiBtn.classList.remove('fun-mode');
        
        const welcomeMsg = document.querySelector('.welcome-message');
        if (welcomeMsg) {
            welcomeMsg.classList.remove('fun-mode');
        }
        
        // 停止表情雨
        this.stopEmojiRain();
    }

    startEmojiRain() {
        if (this.emojiRainInterval) return;
        
        this.emojiRainInterval = setInterval(() => {
            if (Math.random() > 0.8) {
                this.createEmojiRain();
            }
        }, 3000);
    }

    stopEmojiRain() {
        if (this.emojiRainInterval) {
            clearInterval(this.emojiRainInterval);
            this.emojiRainInterval = null;
        }
    }

    createEmojiRain() {
        const emojis = ['🌟', '✨', '💫', '🎉', '🎊', '🎈', '🌈', '🦄', '🎨', '🎭', '🎪', '🎯'];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        
        const emojiElement = document.createElement('div');
        emojiElement.className = 'emoji-rain';
        emojiElement.textContent = emoji;
        emojiElement.style.left = Math.random() * window.innerWidth + 'px';
        emojiElement.style.animationDuration = (Math.random() * 3 + 2) + 's';
        
        document.body.appendChild(emojiElement);
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (emojiElement.parentNode) {
                emojiElement.parentNode.removeChild(emojiElement);
            }
        }, 5000);
    }

    addFunMessageEffect(messageElement) {
        if (!this.funMode) return;
        
        const effects = ['fun-bounce', 'fun-shake', 'fun-wiggle', 'fun-rainbow', 'fun-heartbeat'];
        const randomEffect = effects[Math.floor(Math.random() * effects.length)];
        
        messageElement.classList.add(randomEffect);
        
        // 添加星星效果
        this.createSparkles(messageElement);
        
        // 移除动画类
        setTimeout(() => {
            messageElement.classList.remove(randomEffect);
        }, 2000);
    }

    createSparkles(element) {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const sparkle = document.createElement('div');
                sparkle.className = 'sparkle';
                sparkle.style.left = Math.random() * element.offsetWidth + 'px';
                sparkle.style.top = Math.random() * element.offsetHeight + 'px';
                
                element.appendChild(sparkle);
                
                setTimeout(() => {
                    if (sparkle.parentNode) {
                        sparkle.parentNode.removeChild(sparkle);
                    }
                }, 1500);
            }, i * 100);
        }
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
            soundEffectsCheckbox: document.getElementById('sound-effects'),
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
            emojiPicker: document.getElementById('emoji-picker'),
            bilingualBtn: document.getElementById('bilingual-btn'),
            bilingualModeCheckbox: document.getElementById('bilingual-mode'),
            headerActions: document.querySelector('.header-actions')
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
        
        // 双语模式事件
        this.elements.bilingualBtn.addEventListener('click', this.toggleBilingualMode.bind(this));
        this.elements.bilingualModeCheckbox.addEventListener('change', this.updateBilingualMode.bind(this));
        
        // 聊天提示按钮事件
        document.querySelectorAll('.prompt-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const prompt = e.target.getAttribute('data-prompt');
                this.elements.messageInput.value = prompt;
                this.sendMessage();
            });
        });
        
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
        
        // 如果AI正在回应，将用户消息加入队列
        if (this.isAiResponding) {
            this.userMessageQueue.push(messageText);
            this.showMessageQueueIndicator();
            this.elements.messageInput.value = '';
            this.elements.charCount.textContent = '0 / 2000';
            this.elements.sendBtn.disabled = true;
            this.autoResizeTextarea();
            return;
        }
        
        this.addMessage(messageText, 'user');
        this.elements.messageInput.value = '';
        this.elements.charCount.textContent = '0 / 2000';
        this.elements.sendBtn.disabled = true;
        this.autoResizeTextarea();
        
        // 更新对话统计
        this.conversationCount++;
        this.lastUserMessageTime = Date.now();
        
        // 检查是否需要防尬聊提示
        this.checkAwkwardConversation();
        
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
        
        // 检查是否需要翻译
        const needsTranslation = message.sender === 'other' && this.containsEnglish(message.text);
        
        messageDiv.innerHTML = `
            <div class="message-content">
                <div class="message-text">${this.escapeHtml(message.text)}</div>
                ${needsTranslation ? '<div class="translation-section"></div>' : ''}
                <span class="message-time">${this.formatTime(message.timestamp)}</span>
                <div class="message-actions">
                    ${needsTranslation && !this.bilingualMode ? `
                        <button class="translate-btn" onclick="chatApp.translateMessage(${message.id})" title="翻译">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                <path d="M5 8l6 6"></path>
                                <path d="M4 14l6-6 2-3"></path>
                                <path d="M2 5h12"></path>
                                <path d="M7 2h1"></path>
                                <path d="M22 22l-5-10-5 10"></path>
                                <path d="M14 18h6"></path>
                            </svg>
                        </button>
                    ` : ''}
                </div>
                <div class="message-reactions" id="reactions-${message.id}"></div>
            </div>
        `;
        
        this.removeWelcomeMessage();
        this.elements.messagesContainer.appendChild(messageDiv);
        
        // 添加趣味效果
        this.addFunMessageEffect(messageDiv);
        
        // 自动翻译（如果开启双语模式）
        if (needsTranslation && this.bilingualMode) {
            setTimeout(() => {
                this.translateMessage(message.id);
            }, 1000);
        }
        
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
        // 设置AI正在回应状态
        this.isAiResponding = true;
        this.showAiStatus('thinking', 'AI正在思考中...');
        
        this.showTypingIndicator();
        
        const responseDelay = Math.random() * 2000 + 1000;
        
        this.autoResponseTimeout = setTimeout(() => {
            this.hideTypingIndicator();
            this.showAiStatus('responding', 'AI正在回复...');
            this.generateAutoResponse();
        }, responseDelay);
    }

    showAiStatus(status, text) {
        // 移除现有状态指示器
        const existingIndicator = document.querySelector('.ai-status-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        const indicator = document.createElement('div');
        indicator.className = `ai-status-indicator active ${status}`;
        indicator.innerHTML = `
            <div class="status-dot"></div>
            <span>${text}</span>
        `;

        this.elements.messagesContainer.appendChild(indicator);
        this.scrollToBottom();
    }

    hideAiStatus() {
        const indicator = document.querySelector('.ai-status-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    generateAutoResponse() {
        const responses = [
            // 俏皮回应
            "哇！这个问题好有趣~ 让我想想... 🤔",
            "嘿嘿，你问到点子上了！我觉得是这样的... 😄",
            "哎呀，这个问题让我想起了昨天看到的一个有趣的事情！",
            "让我用我的超级大脑来分析一下... 🧠✨",
            "这个问题很有深度！不过我觉得我们可以用更简单的方式来看待它~",
            
            // 幽默回应
            "这个问题嘛... 我觉得答案可能藏在冰箱里！🍔",
            "让我查查我的数据库... 哦等等，我好像把密码忘了！😅",
            "你知道吗？这个问题让我想起了我奶奶的菜谱！",
            "这个问题好难啊... 我需要喝杯咖啡才能回答！☕",
            "让我想想... 如果我是你，我会先吃个冰淇淋再思考这个问题！🍦",
            
            // 互动回应
            "这个问题很有意思！不过我想先听听你的看法？",
            "嗯... 你猜猜我会怎么回答？😉",
            "让我反问你一个问题：如果你是我，你会怎么回答？",
            "这个问题让我好奇！你是怎么想到这个问题的？",
            "哇，你的思维方式很特别！能告诉我更多吗？",
            
            // 活泼回应
            "叮咚！你的专属AI助手上线！🎉 这个问题我来啦~",
            "收到！正在启动我的智慧模式... 🚀",
            "这个问题让我兴奋起来了！来吧，让我们深入聊聊！",
            "太棒了！我喜欢这种有挑战性的问题！💪",
            "这个问题让我的CPU都在发热了！🔥",
            
            // 温暖回应
            "你这个问题问得真好，让我感觉很温暖呢~ 💝",
            "和你聊天真的很开心！这个问题我们慢慢聊~",
            "我觉得你是个很有想法的人！这个问题很有深度~",
            "每次和你聊天，我都能学到新东西！谢谢你~",
            "你的问题让我觉得世界真美好！🌈",
            
            // 创意回应
            "让我用诗意的语言来回答：这个问题如星辰般闪耀... ✨",
            "如果这个问题是一首歌，那它一定是首摇滚乐！🎸",
            "这个问题像一杯好茶，需要慢慢品味~ 🍵",
            "让我用画画的方式来思考... 🎨 这个问题的色彩很丰富！",
            "这个问题让我想起了春天的第一朵花！🌸",
            
            // 游戏化回应
            "答对了！奖励你一朵小红花！🌺 等等，这不是考试... 😅",
            "这个问题让我想玩个游戏！我们来玩问答游戏怎么样？🎮",
            "Level Up! 你的问题让我升级了！⬆️",
            "解锁新成就：提出了一个有趣的问题！🏆",
            "这个问题让我想起了猜谜语！谜底是... 答案在你心里！💝",
            
            // 趣味游戏互动
            "我们来玩个游戏吧！你问我一个问题，我回答后，我也要问你一个！😊",
            "这个问题让我想到了一个有趣的游戏：20个问题！你想玩吗？🎲",
            "让我猜猜你在想什么... 嗯... 是不是关于... 🤔 猜对了吗？",
            "这个问题让我想起了成语接龙！我先来：一帆风顺！你的呢？🎯",
            "我们来玩个文字游戏吧！用你的问题最后一个字开头说一个词！🎪"
        ];
        
        // 根据消息内容选择合适的回应类型
        const userMessage = this.messages[this.messages.length - 1]?.text || '';
        let selectedResponse;
        
        // 检查是否要启动小游戏
        if (this.shouldStartGame(userMessage)) {
            selectedResponse = this.startMiniGame(userMessage);
        } else if (userMessage.includes('你') || userMessage.includes('吗') || userMessage.includes('？')) {
            // 问题类消息
            selectedResponse = responses[Math.floor(Math.random() * 15)]; // 前15个是互动回应
        } else if (userMessage.includes('谢谢') || userMessage.includes('谢')) {
            // 感谢类消息
            selectedResponse = "不用谢！能帮到你我很开心~ 😊 你还有其他想聊的吗？";
        } else if (userMessage.includes('再见') || userMessage.includes('拜拜')) {
            // 告别类消息
            selectedResponse = "再见啦！期待下次和你聊天！记得想我哦~ 👋💕";
        } else {
            // 其他消息
            selectedResponse = responses[Math.floor(Math.random() * responses.length)];
        }
        
        this.addMessage(selectedResponse, 'other');
        
        // AI回应完成后的处理
        setTimeout(() => {
            this.hideAiStatus();
            this.isAiResponding = false;
            
            // 处理队列中的用户消息
            this.processMessageQueue();
        }, 500);
    }

    processMessageQueue() {
        if (this.userMessageQueue.length > 0) {
            const nextMessage = this.userMessageQueue.shift();
            
            // 隐藏队列指示器
            this.hideMessageQueueIndicator();
            
            // 延迟一点再处理下一条消息，让用户看到AI回应完成
            setTimeout(() => {
                this.addMessage(nextMessage, 'user');
                
                // 更新对话统计
                this.conversationCount++;
                this.lastUserMessageTime = Date.now();
                
                // 继续处理队列或开始新的AI回应
                if (this.userMessageQueue.length > 0) {
                    this.showMessageQueueIndicator();
                    setTimeout(() => {
                        this.simulateOtherPersonTyping();
                    }, 1000);
                } else {
                    setTimeout(() => {
                        this.simulateOtherPersonTyping();
                    }, 1000);
                }
            }, 800);
        }
    }

    showMessageQueueIndicator() {
        const queueCount = this.userMessageQueue.length;
        if (queueCount > 0) {
            // 显示队列指示器
            const lastMessage = this.messages[this.messages.length - 1];
            if (lastMessage) {
                let indicator = lastMessage.querySelector('.message-queue-indicator');
                if (!indicator) {
                    indicator = document.createElement('div');
                    indicator.className = 'message-queue-indicator';
                    lastMessage.appendChild(indicator);
                }
                indicator.textContent = queueCount;
                indicator.classList.add('show');
            }
        }
    }

    hideMessageQueueIndicator() {
        const indicators = document.querySelectorAll('.message-queue-indicator');
        indicators.forEach(indicator => {
            indicator.classList.remove('show');
        });
    }

    checkAwkwardConversation() {
        // 检查是否出现尬聊情况
        const recentMessages = this.messages.slice(-5);
        const userMessages = recentMessages.filter(msg => msg.sender === 'user');
        
        // 如果用户连续发送很短的消息，可能不知道说什么
        if (userMessages.length >= 3) {
            const shortMessages = userMessages.filter(msg => msg.text.length < 10);
            if (shortMessages.length >= 2) {
                this.showAwkwardHint();
                return;
            }
        }
        
        // 如果对话次数很少，提供更多建议
        if (this.conversationCount <= 2 && this.messages.length <= 4) {
            setTimeout(() => {
                this.showConversationSuggestions();
            }, 3000);
        }
    }

    showAwkwardHint() {
        const hint = document.createElement('div');
        hint.className = 'awkward-hint';
        hint.innerHTML = `
            <div class="hint-text">💭 感觉不知道说什么了吗？试试这些话题：</div>
            <div class="hint-suggestions">
                <button class="hint-btn" onclick="chatApp.sendSuggestion('分享一个你今天遇到的有趣事情')">分享趣事</button>
                <button class="hint-btn" onclick="chatApp.sendSuggestion('你最喜欢什么季节？为什么？')">聊季节</button>
                <button class="hint-btn" onclick="chatApp.sendSuggestion('如果可以拥有一个超能力，你想要什么？')">超能力</button>
                <button class="hint-btn" onclick="chatApp.sendSuggestion('推荐一本好书或好电影')">推荐</button>
            </div>
        `;
        
        this.elements.messagesContainer.appendChild(hint);
        this.scrollToBottom();
        
        // 10秒后自动移除
        setTimeout(() => {
            if (hint.parentNode) {
                hint.remove();
            }
        }, 10000);
    }

    showConversationSuggestions() {
        if (this.messages.length > 6) return; // 已经有对话了，不需要建议
        
        const suggestions = [
            "想听听我的故事吗？我可以讲个有趣的！😊",
            "我们来玩个游戏吧！猜谜语怎么样？🎮",
            "你知道我最喜欢什么颜色吗？猜猜看！🎨",
            "如果可以去任何地方旅行，你想去哪里？✈️",
            "分享一个你的小秘密吧，我不会告诉别人的！🤫"
        ];
        
        const randomSuggestion = suggestions[Math.floor(Math.random() * suggestions.length)];
        
        setTimeout(() => {
            this.addMessage(randomSuggestion, 'other');
        }, 2000);
    }

    sendSuggestion(text) {
        this.elements.messageInput.value = text;
        this.sendMessage();
        
        // 移除防尬聊提示
        const hints = document.querySelectorAll('.awkward-hint');
        hints.forEach(hint => hint.remove());
    }

    // 双语功能
    toggleBilingualMode() {
        this.bilingualMode = !this.bilingualMode;
        this.elements.bilingualModeCheckbox.checked = this.bilingualMode;
        this.updateBilingualButton();
        
        if (this.bilingualMode) {
            this.showNotification("🌐 双语模式已开启，将自动显示中文翻译");
            this.translateAllMessages();
        } else {
            this.showNotification("🌐 双语模式已关闭，点击翻译按钮查看中文");
            this.hideAllTranslations();
        }
        
        this.saveSettings();
    }

    updateBilingualMode() {
        this.bilingualMode = this.elements.bilingualModeCheckbox.checked;
        this.updateBilingualButton();
        
        if (this.bilingualMode) {
            this.translateAllMessages();
        } else {
            this.hideAllTranslations();
        }
    }

    updateBilingualButton() {
        if (this.elements.bilingualBtn) {
            this.elements.bilingualBtn.classList.toggle('active', this.bilingualMode);
            this.elements.bilingualBtn.title = this.bilingualMode ? '关闭双语模式' : '开启双语模式';
        }
    }

    containsEnglish(text) {
        // 检查文本是否包含英文字符
        return /[a-zA-Z]/.test(text) && !/^[\u4e00-\u9fa5\s\W]+$/.test(text);
    }

    async translateMessage(messageId) {
        const message = this.messages.find(msg => msg.id === messageId);
        if (!message || message.sender !== 'other') return;
        
        const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
        const translationSection = messageElement.querySelector('.translation-section');
        const translateBtn = messageElement.querySelector('.translate-btn');
        
        if (!translationSection) return;
        
        // 检查缓存
        const cacheKey = message.text;
        if (this.translationCache.has(cacheKey)) {
            this.displayTranslation(translationSection, this.translationCache.get(cacheKey), translateBtn);
            return;
        }
        
        // 显示加载状态
        if (translateBtn) {
            translateBtn.disabled = true;
            translateBtn.innerHTML = '<div class="loading-spinner"></div>';
        }
        
        translationSection.innerHTML = '<div class="translation-loading">正在翻译...</div>';
        
        try {
            // 模拟翻译API调用
            const translation = await this.simulateTranslation(message.text);
            
            // 缓存翻译结果
            this.translationCache.set(cacheKey, translation);
            
            // 显示翻译
            this.displayTranslation(translationSection, translation, translateBtn);
            
        } catch (error) {
            console.error('Translation failed:', error);
            translationSection.innerHTML = '<div class="translation-error">翻译失败，请重试</div>';
        }
    }

    async simulateTranslation(text) {
        // 模拟翻译延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // 简单的翻译映射（实际应用中应该使用真正的翻译API）
        const translations = {
            "Wow! This question is interesting~ Let me think... 🤔": "哇！这个问题好有趣~ 让我想想... 🤔",
            "Hehe, you've asked the right question! I think it's like this... 😄": "嘿嘿，你问到点子上了！我觉得是这样的... 😄",
            "Oh, this question reminds me of something interesting I saw yesterday!": "哎呀，这个问题让我想起了昨天看到的一个有趣的事情！",
            "Let me analyze this with my super brain... 🧠✨": "让我用我的超级大脑来分析一下... 🧠✨",
            "This question has depth! But I think we can look at it in a simpler way~": "这个问题很有深度！不过我觉得我们可以用更简单的方式来看待它~",
            "This question... I think the answer might be hidden in the fridge! 🍔": "这个问题嘛... 我觉得答案可能藏在冰箱里！🍔",
            "Let me check my database... Oh wait, I think I forgot the password! 😅": "让我查查我的数据库... 哦等等，我好像把密码忘了！😅",
            "Did you know? This question reminds me of my grandma's recipe!": "你知道吗？这个问题让我想起了我奶奶的菜谱！",
            "This question is so hard... I need a cup of coffee to answer! ☕": "这个问题好难啊... 我需要喝杯咖啡才能回答！☕",
            "Let me think... If I were you, I'd eat an ice cream first and then think about this question! 🍦": "让我想想... 如果我是你，我会先吃个冰淇淋再思考这个问题！🍦"
        };
        
        // 如果有预定义翻译，使用它；否则返回模拟翻译
        if (translations[text]) {
            return translations[text];
        }
        
        // 模拟翻译（简单处理）
        return `[中文翻译] ${text}`;
    }

    displayTranslation(translationSection, translation, translateBtn) {
        translationSection.innerHTML = `
            <div class="translation-text">
                <div class="translation-label">🇨🇳 中文翻译：</div>
                <div class="translation-content">${this.escapeHtml(translation)}</div>
            </div>
        `;
        
        if (translateBtn) {
            translateBtn.disabled = false;
            translateBtn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
                </svg>
            `;
            translateBtn.title = '翻译完成';
        }
    }

    translateAllMessages() {
        const otherMessages = this.messages.filter(msg => msg.sender === 'other' && this.containsEnglish(msg.text));
        
        otherMessages.forEach((message, index) => {
            setTimeout(() => {
                this.translateMessage(message.id);
            }, index * 200); // 间隔200ms翻译，避免同时请求过多
        });
    }

    hideAllTranslations() {
        const translationSections = document.querySelectorAll('.translation-section');
        translationSections.forEach(section => {
            section.innerHTML = '';
        });
        
        // 重置翻译按钮
        const translateBtns = document.querySelectorAll('.translate-btn');
        translateBtns.forEach(btn => {
            btn.disabled = false;
            btn.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M5 8l6 6"></path>
                    <path d="M4 14l6-6 2-3"></path>
                    <path d="M2 5h12"></path>
                    <path d="M7 2h1"></path>
                    <path d="M22 22l-5-10-5 10"></path>
                    <path d="M14 18h6"></path>
                </svg>
            `;
            btn.title = '翻译';
        });
    }

    startMiniGame(userMessage) {
        const games = [
            "太好了！我们来玩猜谜语游戏吧！我先出一个：什么东西越洗越脏？🤔",
            "成语接龙开始！我先来：一帆风顺！该你了！🎯",
            // ... (其他游戏选项)
            "20个问题游戏！你想一个东西，我可以用20个是/否问题来猜出来！准备好了吗？🎲",
            "文字游戏！用'聊天'的最后一个字'天'开头说一个词！我先来：天空！☁️",
            "猜数字游戏！我想了一个1-100的数字，你来猜！🎯"
        ];
        
        return games[Math.floor(Math.random() * games.length)];
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
                    <h2>欢迎使用智能对话助手！</h2>
                    <p>我是您的AI聊天助手，随时准备为您提供帮助。请输入您想要讨论的话题或问题。</p>
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
        // 直接清空聊天，无需确认
        this.messages = [];
        this.elements.messagesContainer.innerHTML = '';
        this.addWelcomeMessage();
        this.showNotification('聊天记录已清空');
    }

    startVoiceRecording() {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            this.showNotification('您的浏览器不支持语音录制功能');
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
                this.showNotification('无法访问麦克风，请检查权限设置');
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
        const settings = {
            username: this.elements.usernameInput.value,
            bilingualMode: this.elements.bilingualModeCheckbox.checked,
            theme: this.elements.themeSelect.value,
            notifications: this.elements.notificationsCheckbox.checked,
            soundEffects: this.elements.soundEffectsCheckbox.checked,
            funMode: this.funMode
        };
        
        localStorage.setItem('chatAppSettings', JSON.stringify(settings));
        
        this.username = settings.username;
        this.bilingualMode = settings.bilingualMode;
        
        this.updateUserInitial();
        this.updateBilingualButton();
        this.applyTheme(settings.theme);
        
        this.closeSettings();
        this.showNotification('设置已保存');
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
            console.log('此浏览器不支持桌面通知');
            return;
        }
        
        // 检查是否在中国区，使用本地通知替代
        const isChinaRegion = navigator.language.includes('zh') || 
                              navigator.systemLanguage.includes('zh') ||
                              Intl.DateTimeFormat().resolvedOptions().timeZone.includes('Asia/Shanghai');
        
        if (isChinaRegion) {
            // 使用简单的页面内通知，避免权限问题
            this.showPageNotification(message);
            return;
        }
        
        if (Notification.permission === 'granted') {
            new Notification('对话网站', {
                body: message,
                icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234a90e2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    new Notification('对话网站', {
                        body: message,
                        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234a90e2"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>'
                    });
                }
            });
        }
    }

    showPageNotification(message) {
        // 创建页面内通知元素
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--primary-color);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            font-size: 14px;
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // 3秒后自动移除
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
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
